# NLC Pole Yard — Inventory & Testing

Shared pole map for the whole team. Everyone opens the same link and sees the same poles, same tested status, same notes, live.

## What's in the folder

```
index.html                  the app
netlify.toml                tells Netlify where the function is
package.json                pulls in Netlify Blobs
netlify/functions/poles.mjs shared storage API (the "somewhere it logs to")
```

All four files are required. Storage is **Netlify Blobs** — built into your Netlify account, free, nothing else to sign up for.

## Access levels

| Level | How | Can do |
|---|---|---|
| **Viewer** | just the link | See map, list, every pole's details. Nothing else. |
| **Crew** (partial) | ☰ → Access → crew code | Mark poles tested / untested. |
| **Admin** (full) | ☰ → Access → admin code | Everything: add, edit, delete, reset rounds, import. |

Codes are checked on the server — they're not in the HTML, so nobody can pull them out of the page. A phone remembers its code after one entry. Change a code in Netlify and every phone using the old one drops back to viewer.

**Until you set the codes (step 3 below), everyone with the link is admin.** That's on purpose so the app works before setup — just don't share the link before you've done step 3.

## 1. One required edit

Open `index.html`, near the top of the `<script>`, set `NOTIFY_EMAIL` to your address.

Also worth setting up front: `AREAS` — the sections of your pole yard (Climbing Area, Distribution Area, etc.), each with a short code. Numbering restarts at 1 within each area, so `CA1, CA2…` and `DA1, DA2…` are independent counts, not one long running number. Ships with:
```js
const AREAS = [
  { code: "CA", label: "Climbing Area" },
  { code: "DA", label: "Distribution Area" },
  { code: "TA", label: "Transmission Area" },
  { code: "UG", label: "Underground" },
  { code: "RA", label: "Rigging Area" },
];
```
Rename, remove, or add entries to match your actual yard — `code` is what shows up in the pole ID, `label` is the button text in the app.

## 2. Deploy (works from your phone)

Drag-and-drop doesn't work on mobile and the app needs a function, so go through GitHub. This also means every future edit auto-redeploys.

Everything below is done in a phone browser at github.com and app.netlify.com — no computer needed.

**GitHub side:**
1. github.com → sign in (free account if you don't have one) → **New repository** → name it `nlc-pole-yard` → Create.
2. Tap **Add file → Upload files**. Upload `index.html`, `netlify.toml`, `package.json`.
3. Commit changes.
4. Tap **Add file → Create new file**. In the filename box type `netlify/functions/poles.mjs` (the slashes create the folders). Paste the contents of `poles.mjs` into the body. Commit.

**Netlify side:**
5. app.netlify.com → **Add new site → Import an existing project → GitHub** → authorize → pick `nlc-pole-yard`.
6. Leave build settings as-is (netlify.toml handles it) → **Deploy**.
7. About a minute later you get a live `something.netlify.app` link. Rename it under Site settings if you want.

## 3. Set the access codes (Netlify website, works on phone)

1. Netlify → your site → **Site configuration → Environment variables → Add a variable**.
2. Key `ADMIN_KEY`, value = whatever code you want admins to type (e.g. `nlc-boss-2026`). Save.
3. Add another: key `CREW_KEY`, value = the crew code. Save.
4. **Deploys → Trigger deploy → Deploy site.** Env vars only take effect after a redeploy — skip this and the codes won't work.
5. Open the app → ☰ → Access → type the admin code. Badge top-right flips from VIEWER to ADMIN.

Give instructors the crew code. Keep the admin code to yourself or whoever manages inventory.

**Updating later:** edit the file on GitHub (or upload a replacement), commit — Netlify redeploys in ~1 min.

## How the team uses it

Send everyone the link. "Add to Home Screen" gives it an app icon.

**Item types:** the yard isn't just poles anymore. ＋ Add Item now asks what you're adding first — **Pole**, **Pad-Mount Transformer**, **Pedestal**, **Building/Shed**, **Underground Pit**, or a **Conductor Span** — then walks you through the right flow for that type. Each type gets its own icon on the map (⚡ transformer, 🔌 pedestal, 🏚 building, 🕳️ pit, 🔗 span) so you can tell them apart at a glance; poles stay plain colored dots like before.

**Labeling underground pits:** transformers and pedestals use the same Area system as poles — so a pad-mount in the underground lot gets a label like `UG1`, `UG2`, tapping the **Underground** area chip when you add it. Each pit-mounted piece gets its own coded, unique label the same way poles do. Buildings default to the **Buildings & Sheds** area (`BLD1`, `BLD2`...).

**Mapping a pole, transformer, or pedestal (admin):** ＋ Add Item → pick the type → choose:
- **I'm At the Pole — Use GPS** — locks GPS, then pan the satellite view so the pin sits exactly on the pole, Confirm.
- **Not There — Place on Map** — skips GPS entirely, pan/zoom the satellite view to find the pole from imagery and drop the pin there. Use this for poles you're mapping from memory or from the office.

Either way, tap an area button and it fills in the next number for that area (`CA7` if there's already CA1–CA6) — or just type your own ID if you'd rather. Then tap what's on it, notes, Save. Flip "Tested right now" if you're testing as you go.

**Dropping several poles fast (admin):** ＋ Add Pole → ⚡ Drop Several Pins Fast. Every tap on the map drops a numbered pin instantly — no GPS lock, no form, no confirm. There's also 📍 Drop at My Location for walking the yard quickly (uses your live location if ⌖ is on, otherwise grabs a fast GPS reading). Tap ✓ Done when you're finished. The pins land with no components/notes — open the Pole List afterward and fill each one in at your own pace. Good for a fast first pass through a big yard; use the regular GPS or manual flow when you want the satellite fine-tune on each pole as you go.

**Marking multiple poles tested at once (crew or admin):** ☰ → Mark Multiple Tested → tap each pole on the map (rings yellow when selected) → ✅ Mark Selected Tested → enter your name once → done. All selected poles turn green together, and you get **one** email covering the whole batch (pole-by-pole list with components, notes, and map links) instead of one email per pole.

**Moving multiple pins together (admin):** ☰ → Move Multiple Pins → tap each pole on the map you want to shift (they ring yellow when selected) → 🧲 Move Selected Together → drag the magnet handle on the satellite view and every selected pole moves with it as one group → Confirm — Move All. Good for correcting a whole cluster that's off by the same amount (a batch drop that landed shifted, or a run of poles that all need to move together) instead of repositioning each one individually.

**Buildings, sheds & pits (admin):** ＋ Add Item → Building/Shed or Underground Pit → drop it like anything else (GPS or place-on-map). Neither has a components list or a test button — instead each has an editable **inventory**: open it → 📦 Edit Inventory → add rows (item name + quantity), remove any, Save. Anyone with the link can see what's inside; only admins can edit the list.

**Marking a building, shed, or pit as an area instead of a point:** these two types can be outlined instead of pinned as a single dot. ＋ Add Item → Building/Shed or Underground Pit → **🔲 Mark as an Area (4 Corner Pins)** → tap the four corners of the footprint on the map, in order around its edge → it auto-fills in and drops you into the usual label form. The map draws the outline; the item still has a single record (label, notes, inventory) at its center. To fix a boundary later, open the item → **🔲 Redraw Boundary (4 Corners)** and tap four new corners — or use **📍 Reposition Pin** if it was placed as a plain point and you just want to move the dot.

**Conductor spans — tracking wire/conductor size between two structures:** a conductor runs between two structures, so it's tracked as a line rather than a field on one record (useful since a single pole can have several conductors leaving it in different directions). ＋ Add Item → **🔗 Conductor Span** → tap the first pole/transformer/pedestal it leaves from, then tap the second one it connects to → enter the **Conductor Size** (e.g. `4/0 ACSR`, `397 MCM AAC`) and any notes → Save. The line is drawn live between the two structures' current positions — if you move or reposition either endpoint, the span follows automatically. Tap the line (or its label) on the map, or find it in the Pole List, to view, edit, or delete it. Deleting either endpoint deletes its spans too.

**Creating a work order (crew or admin):** open any pole, transformer, or pedestal → 🧾 Create Work Order → fill in Trainee, Instructor, Priority, and what the trouble is → Generate & Print. This builds a page matching NLC's field work order template exactly — Circuit Information, Reported Trouble, Safety/Hazard Notes (pre-filled from the item's notes), the Crew & PPE checklist, Materials Used (pre-filled from what's on file for that structure), and signature lines — with a **QR code** at the bottom that scans straight back to that item's page in the app. It opens in a new tab ready to print; remembers the last trainee/instructor typed so repeat work orders are faster. Buildings/sheds don't get work orders (they're not something you troubleshoot).

**Deleting several items at once (admin):** ☰ → Delete Multiple → tap each item on the map (rings yellow) → 🗑 Delete Selected → confirm. Same select-then-act pattern as the move and bulk-test tools.

**Fixing a pin that's in the wrong spot (admin):** open the pole → **📍 Reposition Pin** → drag the satellite map so the pin lands on the correct spot → Confirm. Doesn't touch the pole's number, components, or notes — just moves it.

**Testing (crew or admin):** tap a pole on the map or in the list → ✅ Mark Tested & Email → it asks who's testing (remembers the last name typed, so it's a one-tap confirm after the first time) → turns green for everyone, email fires with the tester's name in it.

**Retest due dates:** poles go amber automatically once they were last tested more than `RETEST_DAYS` days ago (set near the top of `index.html`, defaults to 365). Red = never tested, amber = tested but due again, green = tested and current. Filter the Pole List by "Due for Retest" to see what needs attention.

**Sharing a link to one pole:** open any pole → 🔗 Share Link to This Pole. On a phone this opens your share sheet (text, email, whatever); on desktop it copies the link. Opening that link takes anyone straight to that pole, zoomed in, details open — no hunting on the map.

**Saved Views (bookmark a spot on the map):** ☰ → Saved Views. Pan/zoom the map to wherever you want (e.g. "North Yard"), name it, ＋ Save Current View. Each saved view has **Go** (jump there), **🔗** (share as a link — opens the app zoomed to that exact spot), and 🗑 (delete). Saved views live on your phone only, not shared with the team — the link is what makes a view shareable.

**Printing the inventory:** ☰ → Print Inventory — opens a clean table (ID, type, status, components, notes, tested by, tested date, retest-due date, GPS) for every pole/transformer/pedestal, a Buildings, Sheds & Pits table with each one's inventory, and a Conductor Spans table (between, size, notes), in a new tab, print-ready. Good for a binder or a compliance file.

**Finding what's left:** ☰ → Pole List → "Not Tested" filter (buildings, sheds, pits, and spans don't show under test-status filters since they're never "tested" — they only show under "All"). Header shows `42 items · 38 testable · 30 tested · 8 remaining`.

**Changing a pole (admin):** open it → Edit Details. Updates for everyone.

**New testing round (admin):** ☰ → Reset All Tests. Every pole goes back to red for everyone. Inventory untouched.

**Map buttons:** ⌖ = live blue dot that follows you (drag map to stop following, tap again to turn off). ⛶ = zoom to all poles. **📏 = measure distance** — tap it on, then tap two poles or any two spots on the map; shows the distance in feet (or miles if far). Tap 📏 again to turn off.

**Distance to a pole:** with ⌖ (live location) turned on, opening any pole shows how far it is from where you're standing right now — handy for finding the nearest untested pole.

## Sync status (top-right pill)

- **synced** — everything's on the server.
- **N unsynced** — you made changes with no signal. They're saved on your phone and push automatically when you're back online. Don't clear browser data while this shows.
- **offline** — can't reach the server; you're seeing the last data your phone pulled.

Other people's changes show up when you open the app or tap ☰ → Refresh. It doesn't push to your screen in real time — if two people edit the *same* pole within seconds of each other, last one wins.

## Email

**Default:** marking tested opens your mail app pre-filled. Tap send. Queues in your outbox with no signal and sends later — reliable out in the yard.

**Automatic (optional, ~10 min):** sends silently, no popup. Free tier 200/month.
1. emailjs.com → sign up.
2. Email Services → Add → connect Gmail → note the **Service ID**.
3. Email Templates → Create. To: `{{to_email}}`, Subject: `{{subject}}`, body:
   ```
   Pole: {{pole_id}}
   Status: TESTED
   Time: {{tested_at}}
   Components: {{components}}
   Notes: {{notes}}
   Location: {{lat}}, {{lng}}
   Map: {{map_link}}
   ```
   Note the **Template ID**.
4. Account → copy **Public Key**.
5. Paste all three into the `EMAILJS_*` constants in `index.html`, commit on GitHub. The app switches to automatic sending.

## Worth knowing

- Viewers can still see notes and coordinates. If even *viewing* should be restricted, password-protect the whole site (Site configuration → Access control) — that's a paid Netlify feature, so the code system above is the free route.
- ☰ → Export Backup once in a while. Netlify Blobs is reliable, but a JSON file in your email is free insurance.
- Editing the component list (Transformer, Crossarm, etc.), the area list, or the item types is just editing those lines near the top of `index.html`.
- Work order QR codes are generated by a free third-party service (api.qrserver.com) at print time — it needs internet access when you print, same as everything else in the app, and nothing about your poles is sent to it beyond the link itself.
- Work orders aren't saved anywhere — each one is generated fresh with a unique Work Order # when you print it. If you need a record of which work orders were issued, that's worth adding later (would need a small server change, not just this file).

## NetSuite

Not built. NetSuite is reachable from here, but wiring it up is a real side project, not a checkbox: it needs an integration record set up inside NetSuite by an admin, OAuth-based tokens (not a simple API key), and a server-side proxy so credentials never touch the browser. Worth doing once there's a clear use case — e.g. pushing tested poles as asset records, or pulling transformer specs from NetSuite instead of storing them here. Say what should flow between the two systems and that becomes its own scoped build.
