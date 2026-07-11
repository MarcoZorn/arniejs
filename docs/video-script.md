# ArnieJS intro video — shot-by-shot script

Two cuts: a **60–90s** main version (YouTube, X, homepage embed) and a **30s** vertical cut (Instagram Reels / TikTok / Reddit). Built for Remotion or manual screen recording + editing. All timestamps are targets, not hard locks — pacing beats precision on the quick-cut sections.

Palette/type reminder for every text overlay: earthy palette (`#1a1208` background, `#f0e6d3` cream text, `#c4622d` terracotta accent), Syne font, no drop shadows — flat and warm.

---

## MAIN CUT — 75s target (acceptable range 60–90s)

### 0:00–0:05 — Logo animation
- **Visual:** Black/deep-brown (`#1a1208`) frame. Arnie mascot SVG fades in and scales up slightly (0.9 → 1.0, ease-out), centered.
- **Text:** "ArnieJS" types out letter-by-letter directly below the mascot, cursor blink on the last character, then a small 🌱 pops in next to it.
- **Audio:** A single soft "pluck"/kalimba note on the logo fade-in. Silence otherwise — let it breathe.
- **Duration:** 5s.

### 0:05–0:15 — Problem montage
- **Shot A (0:05–0:08):** Terminal window, `npm install` being typed and run. Progress spinner. Package count ticking up rapidly on screen ("added 340 packages...").
- **Shot B (0:08–0:11):** Quick cut to a `package.json` file scrolling fast — a wall of `"dependencies"` entries, too many to read, deliberately overwhelming.
- **Shot C (0:11–0:15):** Terminal again — a red `npm ERR!` peer-dependency conflict wall of text. Screen shake (subtle, 2px) on the error appearing. Cut to black.
- **Audio:** Tension build — a low rising drone or fast ticking sound synced to the package counter. Cuts to silence on the black frame.
- **On-screen text (small, corner, appears 0:13):** "sound familiar?"
- **Duration:** 10s.

### 0:15–0:30 — Solution reveal
- **Shot A (0:15–0:18):** Hard cut from black to the ArnieJS homepage loading — hero section, mascot, tagline "180+ vanilla JS components. Grown from scratch." Warm color flood replaces the previous cold terminal grays.
- **Shot B (0:18–0:26):** Scroll/pan through the gallery grid — thumbnails flying past in a smooth scroll (use the real gallery.html), landing briefly on a few standout cards (bloom-button, product-card, blob-cursor).
- **Shot C (0:26–0:30):** Zoom into one card (e.g. tilt-image-reveal) as it's clicked, detail panel slides in.
- **Audio:** Music shifts to warm, organic (acoustic guitar or marimba), tempo picks up.
- **On-screen text (0:16):** "No dependencies. No build step."
- **Duration:** 15s.

### 0:30–0:50 — Component showcase (quick cuts, 2–3s each)
Each shot: component filling most of the frame, its interaction actually triggered on camera (real hover/click, not a static screenshot). Hard cuts, no crossfade, matched to a musical beat if possible.

1. **0:30–0:33** — `tilt-cards` / `3d-perspective-cards`: cursor moves across, card tilts in 3D with glare.
2. **0:33–0:36** — `magnetic-cursor` / `magnetic-letters`: text or button visibly pulled toward the cursor.
3. **0:36–0:39** — `blob-cursor` or `liquid-button-v2`: gooey blob morph on hover/click.
4. **0:39–0:42** — `sand-simulation` or `gravity-seeds` (effects): particles poured/falling, colorful and satisfying.
5. **0:42–0:45** — `otp-input` or `tag-input` (forms): fast realistic typing into the field, auto-advance/chip creation visible.
6. **0:45–0:48** — `checkout-stepper` or `product-card`: add-to-cart button clicked, cart-drawer slides in with the item.
7. **0:48–0:50** — Quick 3-shot flash montage (0.6s each) of three more components not yet shown, to imply "there's way more" — e.g. `weather-widget`, `terminal-window`, `growth-heatmap`.

- **Audio:** Music at full energy, a subtle "click"/"whoosh" foley synced to each cut.
- **On-screen text (appears once, 0:44, small corner):** "290+ and counting"
- **Duration:** 20s.

### 0:50–1:05 — How to use
- **Shot A (0:50–0:55):** Terminal, clean and calm (return to the warm palette terminal theme, not the cold one from the problem montage). Type: `npx @mzorn/arniejs add bloom-button`. Enter.
- **Shot B (0:55–0:59):** Quick file-tree animation — three files appear one by one: `index.html`, `style.css`, `script.js`, each with a small "✓ planted" checkmark.
- **Shot C (0:59–1:05):** Cut to a browser — the bloom-button component is live and working, cursor hovers it, petals bloom. Caption overlay: "That's it."
- **Audio:** Music drops back down, cleaner/sparser — let the terminal typing sound (mechanical keyboard clicks) carry the beat.
- **Duration:** 15s.

### 1:05–1:20 — Call to action
- **Shot A (1:05–1:10):** Cut back to the Arnie mascot, centered, warm background. GitHub star icon animates in next to the repo name with a satisfying pop.
- **Shot B (1:10–1:15):** Text builds line by line:
  - "Just copy 3 files."
  - "Zero dependencies."
  - "Zero build step."
- **Shot C (1:15–1:20):** Final card: Arnie mascot + tagline + URL "marcozorn.github.io/arniejs" + a closing quote fades in: *"A good gardener never needs shortcuts." — Arnie*
- **Audio:** Music resolves to its final chord/note, fades out over the last second.
- **Duration:** 15s.

**Total: ~75s** (trim the 0:48–0:50 flash montage to hit 60s if needed; extend the component showcase to 8–10 items to reach 90s).

---

## SOCIAL CUT — 30s (Instagram Reels / TikTok / Reddit, vertical 9:16)

Faster, no problem montage — assume the audience already gets the npm-fatigue joke or doesn't need convincing, just show the payoff.

### 0:00–0:04 — Hook
- **Visual:** Cold terminal error screen (same red `npm ERR!` wall from the main cut, but immediate — no buildup).
- **Text overlay, bold, center:** "me trying to add ONE button to my site"
- **Audio:** Comedic sting / record-scratch sound.

### 0:04–0:07 — Hard cut to solution
- **Visual:** Hard cut to warm ArnieJS gallery, mascot visible.
- **Text overlay:** "or... just copy 3 files"
- **Audio:** Music beat drops in.

### 0:07–0:20 — Component flash reel
- 6–7 components at ~2s each, same style as main cut's showcase section but faster and punchier: `bloom-button`, `blob-cursor`, `product-card` (add-to-cart), `sand-simulation`, `magnetic-letters`, `tilt-image-reveal`.
- **Text overlay (appears once, ~0:14):** "290+ components. 0 dependencies."
- **Audio:** Music at full energy, hard-cut foley on every transition.

### 0:20–0:26 — CLI payoff
- **Visual:** Terminal, `npx @mzorn/arniejs add bloom-button`, files appear, cut to it working in browser.
- **Text overlay:** "npx @mzorn/arniejs add [anything]"

### 0:26–0:30 — CTA
- **Visual:** Arnie mascot + logo lockup, centered.
- **Text overlay:** "⭐ marcozorn.github.io/arniejs"
- **Audio:** Music resolves, quick fade.

**Total: 30s.**

---

## Production notes

- Record all component interactions live from the actual site (`gallery.html` and individual component pages) — no mockups. The whole pitch is "this is real," so the video should never show anything the viewer can't immediately go try themselves.
- Keep every on-screen caption under ~6 words. This is a scroll-past medium.
- No voiceover required for either cut — text overlays + music + real UI carry it. If Marco wants a VO pass later, the shot list above doubles as a beat sheet.
- Suggested tools: Remotion (React-based, can literally render the real HTML/CSS components as video frames) or a straightforward screen recording (OBS/QuickTime) of the live site edited in DaVinci Resolve / CapCut.
