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

**Mapping a pole (admin):** ＋ Mark Pole Here → GPS locks → pan the satellite view so the pin is on the pole → Confirm → it pre-fills the next number (`NLC-7`) → tap what's on it → notes → Save. Flip "Tested right now" if you're testing as you go.

**Testing (crew or admin):** tap a pole on the map or in the list → ✅ Mark Tested & Email → turns green for everyone, email fires.

**Finding what's left:** ☰ → Pole List → "Not Tested" filter. Header always shows `42 poles · 30 tested · 12 remaining`.

**Changing a pole (admin):** open it → Edit Details. Updates for everyone.

**New testing round (admin):** ☰ → Reset All Tests. Every pole goes back to red for everyone. Inventory untouched.

**Map buttons:** ⌖ = live blue dot that follows you (drag map to stop following, tap again to turn off). ⛶ = zoom to all poles.

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
