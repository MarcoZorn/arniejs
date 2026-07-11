# ARNIEJS — Claude Code Build Prompt (v2)
# Earthy palette · Better story · One-shot full build

---

## STEP 0 — IDENTITY + SETUP

```bash
git config user.name "MarcoZorn"
git config user.email "YOUR_EMAIL"

mkdir -p /home/marco/Documents/PROJECTS/arniejs
cd /home/marco/Documents/PROJECTS/arniejs
git init

gh repo create MarcoZorn/arniejs --public \
  --description "🌱 180+ vanilla JS components. Grown from scratch. No deps." \
  --homepage "https://marcozorn.github.io/arniejs"

git remote add origin https://github.com/MarcoZorn/arniejs.git
```

---

## THE PRODUCT

**ArnieJS** — 180+ vanilla JS UI components and visual effects.
Zero dependencies. Zero build step. Just copy three files and go.

### Why "Arnie"?

Arnie is the name of a fictional old gardener who refuses to use pesticides, synthetic fertilisers, or fancy equipment. He just knows plants. Everything in his garden grows from scratch, is naturally robust, and outlasts anything the neighbours grow with their chemical shortcuts.

ArnieJS is the same. Components grown from scratch — pure HTML, CSS, and JavaScript. No synthetic framework dependencies. No artificial npm packages. Naturally robust, works everywhere, outlasts any framework churn.

**"Grown from scratch. Works everywhere. Just like Arnie's tomatoes."**

The mascot is Arnie himself: a cheerful old gardener face with a straw hat, holding a tiny component like a seedling. Earthy, warm, a bit weathered, very trustworthy. The vibe: your favourite open-source project maintained by someone who genuinely loves the craft.

---

## DESIGN SYSTEM — EARTHY PALETTE

Apply consistently across ALL components (existing + new) and landing page.

```css
/* Core palette */
--bg-deep:     #1a1208;   /* very dark brown, near-black */
--bg-surface:  #241a0e;   /* dark walnut */
--bg-card:     #2e2010;   /* dark terracotta base */
--bg-subtle:   #3d2b14;   /* lifted surface */

/* Text */
--text-primary: #f0e6d3;  /* warm cream */
--text-muted:   #a89070;  /* aged parchment */
--text-faint:   #6b5540;  /* distant earth */

/* Accents */
--accent-terra: #c4622d;  /* terracotta — primary CTA */
--accent-moss:  #5a7a3a;  /* moss green — success, secondary */
--accent-sage:  #8fa86e;  /* sage — hover states */
--accent-clay:  #9b6b3a;  /* clay — interactive */
--accent-sand:  #d4a85a;  /* warm sand — highlight */
--accent-rust:  #a03820;  /* rust — warnings, emphasis */

/* Borders */
--border:       #3d2b14;
--border-light: #5a3e20;

/* Background gradient */
background: radial-gradient(1200px 700px at 50% -10%, #2e1a08 0%, #1a1208 70%);

/* Font */
font-family: 'Syne', sans-serif; /* keep Syne — it works beautifully with earthy */
```

**Animation character:** organic, breathing, slightly slow. Not snappy/electric. Spring easing, gentle fades, bloom-ins rather than snaps.

---

## STEP 1 — READ EXISTING COMPONENTS

Read all files from:
- `/home/marco/Documents/PROJECTS/codepen-components/` (30 UI components)
- `/home/marco/Documents/PROJECTS/codepen/` (11 visual effects)

Understand each component's:
- Visual behaviour and interaction model
- JS pattern (RAF loop, event listener, IntersectionObserver)
- Current color values to replace

**Color replacement map (apply to ALL existing components):**
```
#161b28, #0b0d12, #0d0f14  →  #1a1208 (--bg-deep)
#1e2535, #1a2040            →  #241a0e (--bg-surface)
#4f8ef7, #5585ff            →  #c4622d (--accent-terra)
#7c5cfc, #6c4fe0            →  #5a7a3a (--accent-moss)
#00d4ff, #00c8ff            →  #d4a85a (--accent-sand)
#ff6b35                     →  #a03820 (--accent-rust)
#e8ecf4, #ffffff            →  #f0e6d3 (--text-primary)
#8899aa, #94a3b8            →  #a89070 (--text-muted)
```

---

## STEP 2 — COPY + ADAPT EXISTING COMPONENTS

```bash
mkdir -p components/ui components/effects
cp -r /home/marco/Documents/PROJECTS/codepen-components/* components/ui/
cp -r /home/marco/Documents/PROJECTS/codepen/* components/effects/
```

After copying, update colors in ALL existing CSS files using the replacement map above. Do this with sed or by reading and rewriting each style.css.

```bash
# Example — adapt all existing CSS files to earthy palette
find components/ -name "style.css" -exec sed -i \
  -e 's/#161b28/#1a1208/g' \
  -e 's/#0b0d12/#1a1208/g' \
  -e 's/#4f8ef7/#c4622d/g' \
  -e 's/#7c5cfc/#5a7a3a/g' \
  -e 's/#e8ecf4/#f0e6d3/g' \
  -e 's/#8899aa/#a89070/g' \
  {} \;
```

Verify a few files look correct after replacement.

Commit:
```bash
git add components/
git commit -m "feat: import 41 existing components with earthy palette adaptation"
```

---

## REPO STRUCTURE

```
arniejs/
├── components/
│   ├── ui/           ← 30 existing + 120 new
│   └── effects/      ← 11 existing + 30 new
├── docs/
│   ├── index.html    ← landing page
│   └── assets/
│       ├── arnie.svg ← mascot
│       └── og-image.png
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## STEP 3 — 120 NEW UI COMPONENTS

Every component:
- `components/ui/[NN]-[name]/index.html` + `style.css` + `script.js`
- Earthy palette exclusively
- IIFE pattern: `(function() { ... })()`
- Syne font via `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap')`
- Zero external JS dependencies
- `prefers-reduced-motion` respected

Commit each separately: `feat(ui): add [name] component`

### BATCH A — Buttons (10)
31. `ripple-button` — earth-toned ink ripple on click
32. `morphing-button` — shape morphs circle→pill→rectangle, terracotta fill
33. `bloom-button` — petal-like radial burst on hover (earthy organic feel)
34. `shockwave-button` — concentric rings in clay/sand tones
35. `typewriter-button` — text types itself on hover, cream on dark
36. `ember-button` — warm glow pulse, ember/fire tones
37. `split-button` — text splits to reveal second message, moss green
38. `glitch-button` — warm channel shift glitch, rust tones
39. `magnetic-button` — follows cursor, snaps back, clay accent
40. `seed-button` — tiny particle burst like seeds scattering on click

### BATCH B — Cards (15)
41. `parchment-card` — aged paper texture feel, cream/brown tones
42. `holographic-card` — warm rainbow shimmer (amber/copper instead of rainbow)
43. `expandable-card` — expands to detail, terracotta accent border
44. `stacked-cards` — fan spread on hover, warm layered shadows
45. `reveal-card` — moss green overlay slides away on hover
46. `field-notes-card` — notebook/journal aesthetic, lined paper feel
47. `polaroid-stack` — warm-tinted photos scatter on hover
48. `ember-card` — subtle warm glow border, breathing animation
49. `clay-border-card` — animated clay/terracotta gradient border
50. `stat-card` — KPI with count-up, sand accent
51. `profile-card` — avatar with social links fanning out, earthy
52. `pricing-card` — moss green highlight, feature checklist
53. `feature-card` — icon + title + description, hover lift with warm shadow
54. `testimonial-card` — quote with avatar, sage green stars
55. `bark-card` — subtle wood grain CSS texture as background

### BATCH C — Navigation (10)
56. `sidebar-nav` — collapsible, terracotta active indicator
57. `mega-menu` — full-width dropdown, earthy section headers
58. `breadcrumb` — animated trail, clay separators
59. `root-tab-bar` — mobile bottom nav, moss indicator
60. `floating-dock` — dock with earthy magnify effect
61. `radial-menu` — circular fan menu, sage green segments
62. `hamburger-morph` — burger to X, terracotta accent
63. `scroll-spy-nav` — highlights on scroll, sand underline
64. `field-command` — command palette with earthy styling
65. `grove-menu` — tree-branch style dropdown, organic feel

### BATCH D — Forms (15)
66. `otp-input` — 6-digit code, clay underline style
67. `root-password` — password strength with earth-tone meter
68. `tag-input` — chip tags in sage/terracotta
69. `phone-input` — country picker with warm tones
70. `harvest-datepicker` — calendar with earthy colours
71. `clay-color-picker` — hue/saturation canvas, warm palette
72. `range-dual` — two-handle slider, terracotta track fill
73. `earth-toggle` — iOS-style toggle, moss green on
74. `radio-cards` — selectable cards, warm selected state
75. `grove-search` — expanding search, sandy focus ring
76. `autocomplete` — filtered dropdown, earthy styling
77. `soil-textarea` — autogrow textarea, clay border
78. `number-stepper` — +/- with hold-to-repeat, earthy
79. `field-upload` — drag+drop upload, seed/sprout metaphor
80. `signature-pad` — canvas, warm cream background

### BATCH E — Loaders (10)
81. `soil-skeleton` — shimmer skeleton in warm tones
82. `root-progress` — multi-step with terracotta connector
83. `sun-timer` — countdown with warm SVG arc
84. `sprout-loader` — 3 dots that bounce like seedlings
85. `harvest-bar` — top-of-page progress, clay fill
86. `seed-spinners` — 6 CSS spinners, all earthy
87. `pulse-ember` — ripple pulse in warm amber
88. `skeleton-field` — full card skeleton, parchment tones
89. `growth-upload` — upload progress, sprout metaphor
90. `soil-indeterminate` — indeterminate bar, earth tones

### BATCH F — Data Display (10)
91. `field-table` — sortable table, warm row hover
92. `grove-bar-chart` — animated bars, moss/terracotta
93. `root-line-chart` — SVG line with warm animated draw
94. `clay-donut` — SVG donut, earthy segment colours
95. `sand-sparkline` — inline sparkline for stat cards
96. `growth-heatmap` — GitHub-style, sage green scale
97. `branch-tree` — collapsible nested tree, organic
98. `field-gantt` — minimal gantt, clay tones
99. `harvest-comparison` — feature table, earthy checkmarks
100. `soil-leaderboard` — rank list with warm animations

### BATCH G — Overlays (10)
101. `root-sheet` — swipeable bottom drawer, dark earthy
102. `grove-notifications` — stacked stack with dismiss
103. `clay-tooltip` — direction-aware tooltip, warm
104. `field-popover` — anchored popover, earthy
105. `bark-alert` — dismissible alert strip, rust tones
106. `harvest-cookie` — GDPR banner, warm earthy
107. `ember-snackbar` — snackbar queue, terracotta action
108. `soil-overlay` — blur overlay, warm tint
109. `grove-spotlight` — spotlight with dark earth overlay
110. `root-drawer` — slide-in drawer, earthy backdrop

### BATCH H — Layout (10)
111. `sticky-header` — shrinks on scroll, clay underline
112. `growth-scroll` — reading progress, moss fill
113. `harvest-infinite` — IntersectionObserver load-more
114. `field-masonry` — JS masonry, earthy gap
115. `root-horizontal` — touch-friendly horizontal scroll
116. `grove-snap` — full-page snap, clay dot indicators
117. `soil-parallax` — multi-layer earthy parallax
118. `bloom-reveal` — elements bloom in on scroll
119. `branch-sidebar` — sticky sidebar, organic
120. `back-to-soil` — back-to-top with growth progress

### BATCH I — Misc (20)
121. `field-zoom` — click to zoom, warm lightbox
122. `harvest-compare` — before/after slider v2
123. `root-reorder` — drag to reorder list
124. `grove-panels` — resizable panels, earthy handle
125. `bark-copy` — code block copy button, warm feedback
126. `earth-mode` — day/night toggle, sun/moon earthy
127. `soil-share` — native share + copy, earthy
128. `seed-reading` — reading time calculator
129. `grove-highlight` — text select popover, earthy
130. `root-anchor` — smooth scroll enhanced
131. `field-lazy` — blur-up lazy image loading
132. `harvest-avatars` — stacked avatars, warm
133. `clay-badge` — notification badge, pop-in
134. `soil-chip` — dismissible chip, earthy
135. `root-divider` — animated divider, clay
136. `grove-timeline` — horizontal scrollable, earthy
137. `branch-stepper` — vertical step indicator
138. `empty-field` — empty state, illustrated earthy
139. `error-grove` — error state with animation
140. `bark-shortcut` — keyboard shortcut display
141. `split-reveal` — text splits by word, warm
142. `soil-scramble` — text scrambles then resolves
143. `clay-gradient-text` — animated warm gradient on text
144. `harvest-typewriter` — typewriter, earthy cursor
145. `blur-bloom` — text unblurs word by word
146. `root-counter` — reaction counter +1 animation
147. `swipe-root` — swipe to delete, earthy
148. `field-pinch` — pinch-to-zoom on images
149. `grove-press` — long press with progress
150. `seed-confetti` — earthy confetti (brown/green/sand)

---

## STEP 4 — 30 NEW VISUAL EFFECTS

All use earthy palette: brown/amber/moss/clay tones instead of blue/cyan/neon.

```
components/effects/12-smoke-cursor/     — warm brown smoke
components/effects/13-constellation/    — amber stars, clay lines
components/effects/14-liquid-canvas/    — clay/mud liquid
components/effects/15-wormhole/         — warm tunnel
components/effects/16-earth-grid/       — topographic TRON, brown
components/effects/17-root-helix/       — organic helix, moss
components/effects/18-gravity-seeds/    — seed physics, fall + attract
components/effects/19-morphing-blob/    — organic clay blob
components/effects/20-leaf-rain/        — falling leaves (not pixels)
components/effects/21-spiral-roots/     — root system spiral
components/effects/22-ember-arc/        — warm ember lightning
components/effects/23-soil-automata/    — cellular automata, earth tones
components/effects/24-clay-voronoi/     — voronoi, warm seeds
components/effects/25-lissajous/        — lissajous, sand tones
components/effects/26-sand-simulation/  — falling sand, earthy
components/effects/27-water-soil/       — water ripple on clay
components/effects/28-northern-roots/   — aurora in green/amber
components/effects/29-branch-tree/      — fractal tree, organic
components/effects/30-root-wave/        — animated waveform, clay
components/effects/31-earth-morph/      — shapes morph, terracotta
components/effects/32-warm-bokeh/       — amber/clay soft orbs
components/effects/33-cloth-field/      — cloth simulation, canvas
components/effects/34-hex-soil/         — hex grid wave, earthy
components/effects/35-seed-scope/       — kaleidoscope, warm
components/effects/36-root-tunnel/      — tunnel in brown/amber
components/effects/37-root-network/     — neural net, moss/clay
components/effects/38-solar-roots/      — orbiting with amber trails
components/effects/39-soil-particles/   — text explodes to soil
components/effects/40-field-lines/      — magnetic field, earthy
components/effects/41-ink-earth/        — ink drop in warm clay
```

Commit each: `feat(effects): add [name] effect`

---

## STAR CTA (added post-hoc)

Add a star CTA in three places:

1. **README** — under the 4 badges:
```markdown
<br/>
<a href="https://github.com/MarcoZorn/arniejs">
  <img src="https://img.shields.io/github/stars/MarcoZorn/arniejs?style=flat-square&color=c4622d&label=⭐%20star%20the%20garden" alt="Star ArnieJS">
</a>
```
2. **README** — right after "Meet Arnie", before "What's inside":
```markdown
> If ArnieJS saves you from another `npm install`, a ⭐ keeps the garden alive.
> [Star on GitHub →](https://github.com/MarcoZorn/arniejs)
```
3. **Landing page** — new section after the component grid:
```
STAR CTA SECTION — earthy card, centered:
"If ArnieJS saved you from an npm install, Arnie would love a ⭐"
[Star the garden] button → github.com/MarcoZorn/arniejs
Small text: "It takes 2 seconds. Arnie has been gardening for 40 years."
```

(No CLI installer exists in this project, so the `scripts/` post-install star nudge does not apply.)

---

## STEP 5 — ARNIE MASCOT SVG

Generate `docs/assets/arnie.svg`:

A cheerful cartoon gardener face:
- Round face, warm skin tone (#d4956a)
- Straw hat on top (#c4862d)
- Big smile, rosy cheeks
- Tiny seedling/sprout held up like a trophy
- Background circle: #2e2010
- Style: bold outlines (#1a1208), friendly, sticker-like
- 200×200 viewBox

This mascot appears in the README and landing page.

Commit: `feat(assets): add Arnie mascot SVG`

---

## STEP 6 — README.md

```markdown
<div align="center">
  <img src="docs/assets/arnie.svg" width="120" alt="Arnie the gardener" />
  
  <h1>ArnieJS 🌱</h1>
  
  <p><strong>180+ vanilla JS components. Grown from scratch. No deps.</strong></p>
  
  <p><em>"A good gardener never needs shortcuts."</em></p>

  ![Components](https://img.shields.io/badge/components-180+-c4622d?style=flat-square)
  ![Dependencies](https://img.shields.io/badge/dependencies-0-5a7a3a?style=flat-square)
  ![Build step](https://img.shields.io/badge/build%20step-none-9b6b3a?style=flat-square)
  ![License](https://img.shields.io/badge/license-MIT-d4a85a?style=flat-square)
</div>

---

## Meet Arnie

Arnie is a fictional old gardener. He has never used pesticides, synthetic fertilisers, or automated watering systems. Everything in his garden grows from scratch, naturally, and outlasts anything the neighbours grow with their chemical shortcuts. His tomatoes are legendary.

**ArnieJS works the same way.**

180+ UI components grown from pure HTML, CSS, and JavaScript. No npm packages. No Webpack. No synthetic dependencies that break every six months when a maintainer renames a config option.

Just copy three files. Drop them in. Watch them grow.

> *"My neighbour installed a framework. Now he spends weekends debugging peer dependency conflicts. My tomatoes are fine."*
> — Arnie

---

## What's inside

| Category | Components | Examples |
|---|---|---|
| 🌿 Buttons | 10 | bloom, ember glow, seed burst |
| 🪵 Cards | 15 | parchment, field notes, bark texture |
| 🌾 Navigation | 10 | grove menu, root tab bar, floating dock |
| 🌍 Forms | 15 | harvest datepicker, clay color picker |
| 🌱 Loaders | 10 | sprout loader, soil skeleton, sun timer |
| 📊 Data Display | 10 | grove bar chart, growth heatmap |
| 💬 Overlays | 10 | root drawer, ember snackbar |
| 🍂 Layout | 10 | bloom reveal, soil parallax |
| ✨ Misc | 20 | soil scramble, harvest typewriter |
| 🌌 Visual Effects | 41 | sand simulation, gravity seeds, clay voronoi |

---

## The rules (Arnie's garden rules)

```
✅ Zero dependencies       — Arnie grows his own
✅ Zero build step         — seeds don't need Webpack
✅ 3 files exactly         — HTML + CSS + JS. That's it.
✅ Works anywhere          — WordPress, Webflow, static HTML, React
✅ prefers-reduced-motion  — Arnie respects his elderly visitors
✅ Touch + Pointer events  — the garden is mobile-first

❌ No jQuery               — Arnie doesn't use fertiliser
❌ No GSAP                 — he doesn't trust the chemical industry
❌ No React                — he grows components, not factories
❌ No npm install          — he saves his own seeds
```

---

## How to use

Pick a component. Copy the 3 files. Done.

```
arniejs/
└── components/
    └── ui/
        └── 31-bloom-button/
            ├── index.html   ← markup
            ├── style.css    ← styling
            └── script.js    ← logic
```

No configuration. No `npm install`. No `.env` file.
Arnie would say: *"If it needs a config file, it's not ready yet."*

---

## Contributing

Want to plant something new?

1. Fork the garden
2. Create `components/ui/[NN]-[your-component]/` with 3 files
3. Follow Arnie's rules (zero dependencies, seriously)
4. Open a PR with a screenshot or GIF

If your component has an npm dependency, Arnie will not be angry.
He will just be quietly disappointed, which is worse.

---

## License

MIT. Grow it, fork it, transplant it anywhere.
Arnie asks only that you water it occasionally (keep it maintained).

---

<div align="center">
  <p>Made by <a href="https://github.com/MarcoZorn">MarcoZorn</a></p>
  <p><a href="https://marcozorn.github.io/arniejs">Landing</a> · <a href="https://github.com/MarcoZorn/arniejs/issues">Issues</a> · <a href="CONTRIBUTING.md">Contribute</a></p>
</div>
```

Commit: `docs(readme): add complete README with Arnie personality`

---

## STEP 7 — LANDING PAGE (docs/index.html)

Single HTML file. Tailwind CDN + GSAP CDN (ironic — the landing uses deps, the components don't; Arnie would not approve of this page).

**Palette:** earthy system above. Font: Syne.

**Sections:**

1. **Hero** — Arnie mascot SVG, big warm headline, "180+ vanilla JS components. Grown from scratch. No deps.", terracotta CTA "Browse components" → GitHub, secondary "See the garden" (landing scroll). GSAP stagger fade-in.

2. **Meet Arnie** — short story about the fictional gardener. 2 paragraphs. Warm card with soil texture feel. Pull quote from "Arnie" about frameworks.

3. **Stats** — count-up animated: 180+ Components / 0 Dependencies / 0 Build Steps / ∞ Tomatoes Saved

4. **Garden rules** — the 5 ✅ rules as a warm-toned poster card, earthy checklist style.

5. **Component grid** — 12 component cards: name, category badge (earthy color per category), one-line description. Hover: warm lift shadow.

6. **Visual effects preview** — 4 effect cards, slightly larger, with canvas preview hint.

7. **How to use** — file tree block, copy 3 files, done. Warm terminal-style block.

8. **Arnie's quote wall** — 3 funny fictional quotes from Arnie about frameworks. Styled as pull quotes.

9. **CTA** — "Stop installing. Start growing." → GitHub button terracotta.

10. **Footer** — MIT · Made by MarcoZorn · GitHub.

After building: screenshot with chrome-devtools-mcp at 1440px and 375px.

Commit: `feat(landing): add ArnieJS landing page with earthy design`

---

## STEP 8 — GITHUB SETUP

```bash
gh repo edit MarcoZorn/arniejs \
  --add-topic javascript \
  --add-topic vanilla-js \
  --add-topic components \
  --add-topic animation \
  --add-topic zero-dependencies \
  --add-topic ui-components \
  --add-topic css-animations \
  --add-topic frontend \
  --add-topic no-build \
  --add-topic open-source

gh api repos/MarcoZorn/arniejs/pages \
  --method POST \
  --field source='{"branch":"main","path":"/docs"}'

gh repo edit MarcoZorn/arniejs \
  --homepage "https://marcozorn.github.io/arniejs"

gh release create v1.0.0 \
  --title "ArnieJS v1.0.0 — The First Harvest" \
  --notes "Arnie's first harvest. 180+ vanilla JS components, grown from scratch.

## What's in the basket
- 30 UI components (existing, adapted to earthy palette)
- 11 visual effects (existing, adapted)
- 120 new UI components across 9 categories
- 30 new visual effects
- Landing page at marcozorn.github.io/arniejs
- MIT license

## How to use
Pick a component. Copy 3 files. No npm. No Webpack. Arnie approves.

\`\`\`bash
git clone https://github.com/MarcoZorn/arniejs
\`\`\`"
```

---

## COMMIT DISCIPLINE

One component = one commit.
```
feat(ui): add bloom-button component
feat(ui): add parchment-card component
feat(effects): add sand-simulation effect
docs(readme): add complete README with Arnie personality
feat(landing): add landing page with earthy design
feat(assets): add Arnie mascot SVG
```

Push every 10 commits.
Target: 180+ commits total.

---

## QUALITY CHECKS

- [ ] All existing component CSS files updated to earthy palette
- [ ] All 180+ components have exactly 3 files
- [ ] No component has npm imports or CDN script tags (Google Fonts @import only)
- [ ] Landing page renders at 1440px and 375px (chrome-devtools-mcp screenshot)
- [ ] README renders correctly on GitHub
- [ ] Arnie mascot SVG displays in README and landing
- [ ] GitHub Pages live
- [ ] v1.0.0 release created
- [ ] Topics added

---

## FIRST MESSAGE FOR CLAUDE CODE

"Read this entire prompt before starting. Execute in order: Step 0 (setup) → Step 1 (read existing) → Step 2 (copy + recolor) → Step 3 (120 new UI components) → Step 4 (30 new effects) → Step 5 (mascot SVG) → Step 6 (README) → Step 7 (landing) → Step 8 (GitHub). Read existing components first and match their code style exactly — IIFE pattern, CSS custom properties, Syne font. Apply the earthy color palette to EVERY component including the existing ones. Generate each component fully with real content, commit it, then move on. Take chrome-devtools-mcp screenshots after the landing page is built. Do not skip components or use placeholder files."
