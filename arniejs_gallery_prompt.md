# ARNIEJS — Follow-up Prompt: Gallery Site + CDN
# Run this AFTER the main build prompt is complete and pushed.
# Adds: live component gallery (B) + CDN distribution (C)

---

## WHAT THIS ADDS

1. **Gallery site** — navigable, searchable, filterable component browser
   with live preview in iframe + "Copy HTML/CSS/JS" buttons per component.
   Replaces the static landing page with a full app at marcozorn.github.io/arniejs.

2. **CDN distribution** — every component includable via 2 lines in `<head>`.
   No file copying needed. Works via jsDelivr (free, automatic from GitHub).

---

## STEP 1 — GENERATE COMPONENT METADATA

First, read every component folder and generate a `registry.json` file
that catalogs all 180+ components. This powers both the gallery and the CDN.

Create `docs/registry.json`:

```json
[
  {
    "id": "bloom-button",
    "number": "31",
    "name": "Bloom Button",
    "category": "buttons",
    "description": "Petal-like radial burst on hover. Pure CSS + one RAF loop.",
    "tags": ["button", "hover", "animation", "interactive"],
    "files": {
      "html": "components/ui/31-bloom-button/index.html",
      "css": "components/ui/31-bloom-button/style.css",
      "js": "components/ui/31-bloom-button/script.js"
    },
    "cdn": {
      "css": "https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/31-bloom-button/style.css",
      "js": "https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/31-bloom-button/script.js"
    },
    "type": "ui"
  }
]
```

Write a Node.js script `scripts/generate-registry.js` that:
1. Reads all folders in `components/ui/` and `components/effects/`
2. Parses the folder name to extract number + slug
3. Reads the first 3 lines of each `index.html` for a `<!-- description: ... -->` comment
4. Generates the full `registry.json`

Add `<!-- description: ... -->` and `<!-- category: ... -->` HTML comments
to the first line of EVERY component's `index.html` so the script can parse them.

```bash
node scripts/generate-registry.js
git add docs/registry.json scripts/generate-registry.js
git commit -m "feat(registry): generate component registry JSON"
```

---

## STEP 2 — GALLERY SITE (docs/index.html — full replacement)

Replace the existing landing page with a full gallery app.
Single HTML file. Vanilla JS only (ironic but necessary — no React).
Tailwind CDN for layout utility. Syne font. Earthy palette.

### Layout

```
┌─────────────────────────────────────────────────┐
│  HEADER: logo + nav (Gallery / Docs / GitHub)   │
├──────────┬──────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT                        │
│          │                                      │
│ Search   │  Category header                     │
│          │                                      │
│ Category │  ┌──────┐ ┌──────┐ ┌──────┐        │
│ filters  │  │ Card │ │ Card │ │ Card │        │
│          │  └──────┘ └──────┘ └──────┘        │
│ Type     │                                      │
│ (UI/FX)  │  ┌──────┐ ┌──────┐ ┌──────┐        │
│          │  │ Card │ │ Card │ │ Card │        │
│ Tags     │  └──────┘ └──────┘ └──────┘        │
└──────────┴──────────────────────────────────────┘
```

### Component card

Each card shows:
- **Live preview** — `<iframe>` that loads the component's `index.html` directly
  from the GitHub Pages URL. Pointer-events disabled so you can see it without
  accidentally interacting.
- **Component name** — bold, Syne
- **Category badge** — earthy color per category
- **Hover state** — card lifts, preview becomes interactive (pointer-events: auto),
  "Open full preview" button appears

```html
<div class="component-card" data-id="bloom-button" data-category="buttons">
  <div class="preview-wrap">
    <iframe
      src="https://marcozorn.github.io/arniejs/components/ui/31-bloom-button/"
      title="bloom-button preview"
      loading="lazy"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
    <div class="preview-overlay">
      <!-- removed on hover so iframe becomes interactive -->
    </div>
  </div>
  <div class="card-meta">
    <span class="card-name">Bloom Button</span>
    <span class="card-badge">buttons</span>
  </div>
</div>
```

### Click to open detail panel

Clicking a card opens a slide-in panel (right side, 480px wide) with:

```
┌────────────────────────────────────────────┐
│  ← Back    Bloom Button        [Open full] │
├────────────────────────────────────────────┤
│  LIVE PREVIEW (large iframe, interactive)  │
│                                            │
├────────────────────────────────────────────┤
│  [HTML] [CSS] [JS] [CDN]   ← tabs         │
│                                            │
│  code block with copy button              │
│                                            │
├────────────────────────────────────────────┤
│  CDN USAGE                                 │
│  <link rel="stylesheet" href="cdn...css"> │
│  <script src="cdn...js"></script>          │
│  + paste the HTML markup                   │
└────────────────────────────────────────────┘
```

### Copy buttons

Each tab (HTML/CSS/JS) has a copy button that copies the raw file content
to clipboard. Fetch the file from GitHub raw URL on demand (not preloaded).

```js
async function copyFile(url) {
  const res = await fetch(url);
  const text = await res.text();
  await navigator.clipboard.writeText(text);
  showFeedback('Copied!');
}
```

### Search

Real-time search bar at top of sidebar.
Filters cards by name, description, and tags from registry.json.
Debounced 150ms. Highlights matching text in card names.

```js
const query = searchInput.value.toLowerCase();
cards.forEach(card => {
  const match = card.dataset.name.includes(query) ||
                card.dataset.tags.includes(query);
  card.style.display = match ? '' : 'none';
});
```

### Category filters

Sidebar pill buttons, one per category:
All · Buttons · Cards · Navigation · Forms · Loaders ·
Data Display · Overlays · Layout · Misc · Effects

Active state: terracotta background. Click filters the grid.
Multiple categories selectable (toggle behavior).

### URL routing

Update URL on filter/search so people can share links:
`https://marcozorn.github.io/arniejs/?category=buttons`
`https://marcozorn.github.io/arniejs/?search=tilt`
`https://marcozorn.github.io/arniejs/?component=bloom-button`

Parse URL params on load and apply filters immediately.

### Hero section (above the grid)

Compact — not a full landing page hero. Just:
- `arniejs 🌱` logo left
- Tagline: "180+ vanilla JS components. Grown from scratch."
- Star CTA badge: "⭐ Star the garden" → GitHub
- Component count: "180 components · 0 dependencies"

This replaces the full landing page hero from the previous prompt.
The gallery IS the landing page now.

---

## STEP 3 — INDIVIDUAL COMPONENT PAGES

Each component needs its own standalone URL on GitHub Pages so the iframes work.

The `index.html` inside each component folder already IS the standalone page
(it has the full HTML document). GitHub Pages serves it at:
`https://marcozorn.github.io/arniejs/components/ui/31-bloom-button/`

So the iframes in the gallery just point to those URLs. No extra build step needed.

Verify that each `index.html` is a complete HTML document
(has `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`).
Fix any that are body-only fragments.

```bash
# Quick check — count files that start with <!DOCTYPE
grep -rl "<!DOCTYPE" components/ | wc -l
# Should equal total component count
```

Commit any fixes: `fix(components): ensure all index.html are complete documents`

---

## STEP 4 — CDN DISTRIBUTION

ArnieJS components are automatically available via jsDelivr CDN
because the repo is public on GitHub. No setup needed.

**CDN URL pattern:**
```
CSS: https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/[folder]/style.css
JS:  https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/[folder]/script.js
```

### Add CDN docs page (docs/cdn.html)

Simple page explaining CDN usage:

```html
<!-- In your <head>: -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/31-bloom-button/style.css">

<!-- Before </body>: -->
<script src="https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/31-bloom-button/script.js"></script>

<!-- In your <body>: -->
<!-- paste the HTML from the component's index.html body -->
```

Note: for versioned CDN (stable, won't break on updates):
```
https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@v1.0.0/components/ui/31-bloom-button/style.css
```

### Add CDN info to README

After the "How to use" section, add:

```markdown
## Option B — CDN (two lines, no file copying)

```html
<!-- In <head> -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/31-bloom-button/style.css">

<!-- Before </body> -->
<script
  src="https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/31-bloom-button/script.js">
</script>
```

Then paste the HTML markup from the component's `index.html`.
Replace `31-bloom-button` with any component folder name.

Arnie doesn't love CDNs (he prefers to grow his own), but he understands
not everyone has time to dig in the soil.
```

---

## STEP 5 — STAR CTA (add everywhere it's missing)

### In gallery hero:
```html
<a href="https://github.com/MarcoZorn/arniejs"
   class="star-cta"
   target="_blank">
  ⭐ If this saved you an npm install, star the garden
</a>
```

### In component detail panel footer:
```
"Useful? ⭐ Star on GitHub — it keeps Arnie gardening."
```

### In README (already partly there, strengthen):
Add after badges:
```markdown
<a href="https://github.com/MarcoZorn/arniejs/stargazers">
  <img src="https://img.shields.io/github/stars/MarcoZorn/arniejs?style=flat-square&color=c4622d&label=⭐%20star%20the%20garden">
</a>
```

Add floating "Star" widget (fixed bottom-right on gallery page):
```html
<a href="https://github.com/MarcoZorn/arniejs"
   class="star-float"
   target="_blank">
  ⭐ Star
</a>
```
Style: fixed, bottom-right, terracotta pill, disappears if user has starred
(can't detect this without auth, so show it always but make it subtle).

---

## STEP 6 — sitemap.xml UPDATE

Update `docs/sitemap.xml` to include gallery routes:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://marcozorn.github.io/arniejs/</loc><priority>1.0</priority></url>
  <url><loc>https://marcozorn.github.io/arniejs/cdn.html</loc><priority>0.7</priority></url>
  <!-- one entry per component — generated by the registry script -->
</urlset>
```

Update `scripts/generate-registry.js` to also write `docs/sitemap.xml`
with one `<url>` entry per component.

---

## STEP 7 — OG IMAGE UPDATE

Update `docs/assets/og-image.png` to show the gallery UI instead of just the logo.
Generate a 1200×630 screenshot of the gallery at 1200px width using chrome-devtools-mcp.
This is what shows when shared on Twitter/LinkedIn — the gallery screenshot
is much more compelling than a plain logo card.

---

## COMMIT PATTERN

```
feat(gallery): add live component gallery with search and filters
feat(gallery): add component detail panel with code tabs
feat(gallery): add copy-to-clipboard for HTML/CSS/JS
feat(gallery): add URL routing for filters and search
feat(registry): add generate-registry.js script
feat(cdn): add CDN usage docs page
feat(cdn): add CDN section to README
fix(components): ensure all index.html are complete documents
feat(star): add star CTA to gallery hero, detail panel, floating widget
chore(sitemap): update sitemap with component pages
```

Push after each commit.

---

## QUALITY CHECKS

- [ ] Gallery loads at marcozorn.github.io/arniejs with all components visible
- [ ] Search filters correctly
- [ ] Category filters work (single + multiple)
- [ ] Component card iframes load the live preview
- [ ] Detail panel opens on click with HTML/CSS/JS tabs
- [ ] Copy buttons work (clipboard API)
- [ ] CDN URLs resolve (test one: open cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/components/ui/31-bloom-button/style.css)
- [ ] URL routing works (?category=buttons, ?search=tilt)
- [ ] Star CTA visible in hero, detail panel, floating widget
- [ ] OG image shows gallery screenshot
- [ ] sitemap.xml includes all components
- [ ] Mobile layout works at 375px (sidebar collapses to top filter bar)

---

## FIRST MESSAGE FOR CLAUDE CODE

"Read this entire prompt before starting. This is a follow-up to the main ArnieJS build — the repo already exists with 180+ components at /home/marco/Documents/PROJECTS/arniejs. Execute in order: Step 1 (registry.json) → Step 2 (gallery site replacing docs/index.html) → Step 3 (verify component pages) → Step 4 (CDN docs) → Step 5 (star CTAs everywhere) → Step 6 (sitemap) → Step 7 (OG image screenshot). The gallery uses vanilla JS only — no React, no framework. Take chrome-devtools-mcp screenshots at 1440px and 375px after the gallery is built. Commit each feature separately."
