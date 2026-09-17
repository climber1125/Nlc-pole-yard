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

Open `index.html`, near the top of the `<script>`, set `NOTIFY_EMAIL` to your address. Optional: change `POLE_PREFIX` if you don't want `NLC-1, NLC-2…`

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

**Mapping a pole (admin):** ＋ Add Pole → choose:
- **I'm At the Pole — Use GPS** — locks GPS, then pan the satellite view so the pin sits exactly on the pole, Confirm.
- **Not There — Place on Map** — skips GPS entirely, pan/zoom the satellite view to find the pole from imagery and drop the pin there. Use this for poles you're mapping from memory or from the office.

Either way it pre-fills the next number (`NLC-7`), tap what's on it, notes, Save. Flip "Tested right now" if you're testing as you go.

**Dropping several poles fast (admin):** ＋ Add Pole → ⚡ Drop Several Pins Fast. Every tap on the map drops a numbered pin instantly — no GPS lock, no form, no confirm. There's also 📍 Drop at My Location for walking the yard quickly (uses your live location if ⌖ is on, otherwise grabs a fast GPS reading). Tap ✓ Done when you're finished. The pins land with no components/notes — open the Pole List afterward and fill each one in at your own pace. Good for a fast first pass through a big yard; use the regular GPS or manual flow when you want the satellite fine-tune on each pole as you go.

**Moving multiple pins together (admin):** ☰ → Move Multiple Pins → tap each pole on the map you want to shift (they ring yellow when selected) → 🧲 Move Selected Together → drag the magnet handle on the satellite view and every selected pole moves with it as one group → Confirm — Move All. Good for correcting a whole cluster that's off by the same amount (a batch drop that landed shifted, or a run of poles that all need to move together) instead of repositioning each one individually.

**Fixing a pin that's in the wrong spot (admin):** open the pole → **📍 Reposition Pin** → drag the satellite map so the pin lands on the correct spot → Confirm. Doesn't touch the pole's number, components, or notes — just moves it.

**Testing (crew or admin):** tap a pole on the map or in the list → ✅ Mark Tested & Email → it asks who's testing (remembers the last name typed, so it's a one-tap confirm after the first time) → turns green for everyone, email fires with the tester's name in it.

**Retest due dates:** poles go amber automatically once they were last tested more than `RETEST_DAYS` days ago (set near the top of `index.html`, defaults to 365). Red = never tested, amber = tested but due again, green = tested and current. Filter the Pole List by "Due for Retest" to see what needs attention.

**Sharing a link to one pole:** open any pole → 🔗 Share Link to This Pole. On a phone this opens your share sheet (text, email, whatever); on desktop it copies the link. Opening that link takes anyone straight to that pole, zoomed in, details open — no hunting on the map.

**Saved Views (bookmark a spot on the map):** ☰ → Saved Views. Pan/zoom the map to wherever you want (e.g. "North Yard"), name it, ＋ Save Current View. Each saved view has **Go** (jump there), **🔗** (share as a link — opens the app zoomed to that exact spot), and 🗑 (delete). Saved views live on your phone only, not shared with the team — the link is what makes a view shareable.

**Printing the inventory:** ☰ → Print Inventory — opens a clean table (pole #, status, components, notes, tested by, tested date, retest-due date, GPS) in a new tab, print-ready. Good for a binder or a compliance file.

**Finding what's left:** ☰ → Pole List → "Not Tested" filter. Header always shows `42 poles · 30 tested · 12 remaining`.

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
- Editing the component list (Transformer, Crossarm, etc.) is just editing the chip lines in `index.html`.
