// Shared "Policies & Specs" document — one Netlify Blob, viewer-readable, admin-editable.
// Reuses the same ADMIN_KEY / CREW_KEY env vars as poles.mjs (see that file for how roles work).
//
// GET /api/policies   -> { content, updatedAt, updatedBy }  (anyone)
// PUT /api/policies   -> body { content, updatedBy? }        (admin only)
import { getStore } from "@netlify/blobs";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
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

const DOC_KEY = "policies";
const EMPTY = { content: "", updatedAt: null, updatedBy: null };

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const store = getStore("site-docs");
  const isAdmin = roleFor(req) === "admin";

  try {
    if (req.method === "GET") {
      const doc = await store.get(DOC_KEY, { type: "json" });
      return json(doc || EMPTY);
    }
    if (req.method === "PUT") {
      if (!isAdmin) return json({ error: "admin code required" }, 403);
      const { content, updatedBy } = await req.json();
      const doc = { content: content || "", updatedAt: new Date().toISOString(), updatedBy: updatedBy || "" };
      await store.setJSON(DOC_KEY, doc);
      return json(doc);
    }
    return json({ error: "not found" }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};

export const config = { path: ["/api/policies"] };
