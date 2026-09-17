// Shared pole storage — Netlify Blobs, one key per pole — with 3 access levels.
//
// Access codes come from Netlify environment variables (Site settings → Environment variables):
//   ADMIN_KEY  full access: add, edit, delete, reset, import
//   CREW_KEY   partial access: mark tested / untested only
// No code = viewer (read-only). If NEITHER env var is set, everyone is admin (so it works before setup).
//
// Client sends the code in header  x-key: <code>
//
// GET    /api/poles              -> all poles (anyone)
// POST   /api/poles/whoami       -> { role }  (checks the x-key header)
// POST   /api/poles/:id/tested   -> body {tested:true|false}  (crew or admin)
// PUT    /api/poles/:id          -> create/replace one pole   (admin)
// DELETE /api/poles/:id          -> remove one pole           (admin)
// POST   /api/poles/reset        -> all poles tested=false    (admin)
import { getStore } from "@netlify/blobs";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-key",
};
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...cors } });

function roleFor(req) {
  const admin = Netlify.env.get("ADMIN_KEY") || "";
  const crew = Netlify.env.get("CREW_KEY") || "";
  if (!admin && !crew) return "admin"; // nothing configured yet — open
  const key = req.headers.get("x-key") || "";
  if (admin && key === admin) return "admin";
  if (crew && key === crew) return "crew";
  return "viewer";
}

async function listAll(store) {
  const { blobs } = await store.list();
  const poles = await Promise.all(blobs.map(b => store.get(b.key, { type: "json" })));
  return poles.filter(Boolean);
}

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const store = getStore("poles");
  const parts = new URL(req.url).pathname.replace(/^\/api\/poles\/?/, "").split("/").filter(Boolean);
  const id = parts[0], sub = parts[1];
  const role = roleFor(req);
  const isAdmin = role === "admin", canTest = isAdmin || role === "crew";

  try {
    if (req.method === "GET") return json(await listAll(store));
    if (req.method === "POST" && id === "whoami") return json({ role });

    if (req.method === "POST" && id && sub === "tested") {
      if (!canTest) return json({ error: "crew or admin code required" }, 403);
      const existing = await store.get(id, { type: "json" });
      if (!existing) return json({ error: "not found" }, 404);
      const { tested } = await req.json();
      const updated = { ...existing, tested: !!tested, testedAt: tested ? new Date().toISOString() : null };
      await store.setJSON(id, updated);
      return json(updated);
    }

    if (!isAdmin) return json({ error: "admin code required" }, 403);

    if (req.method === "PUT" && id) {
      const pole = await req.json();
      if (!pole || pole.id !== id) return json({ error: "id mismatch" }, 400);
      await store.setJSON(id, pole);
      return json({ ok: true });
    }
    if (req.method === "DELETE" && id) { await store.delete(id); return json({ ok: true }); }
    if (req.method === "POST" && id === "reset") {
      const poles = await listAll(store);
      await Promise.all(poles.map(p => store.setJSON(p.id, { ...p, tested: false, testedAt: null })));
      return json({ ok: true, count: poles.length });
    }
    return json({ error: "not found" }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};

export const config = { path: ["/api/poles", "/api/poles/*"] };
