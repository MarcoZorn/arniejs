<div align="center">
  <img src="assets/arnie.svg" width="120" alt="Arnie the gardener" />

  <h1>ArnieJS 🌱</h1>

  <p><strong>180+ vanilla JS components. Grown from scratch. No deps.</strong></p>

  <p><em>"A good gardener never needs shortcuts."</em></p>

  ![Components](https://img.shields.io/badge/components-180+-c4622d?style=flat-square)
  ![Dependencies](https://img.shields.io/badge/dependencies-0-5a7a3a?style=flat-square)
  ![Build step](https://img.shields.io/badge/build%20step-none-9b6b3a?style=flat-square)
  ![License](https://img.shields.io/badge/license-MIT-d4a85a?style=flat-square)

  <br/>
  <a href="https://github.com/MarcoZorn/arniejs">
    <img src="https://img.shields.io/github/stars/MarcoZorn/arniejs?style=flat-square&color=c4622d&label=⭐%20star%20the%20garden" alt="Star ArnieJS">
  </a>
</div>

---

## Meet Arnie

Arnie is a fictional old gardener. He has never used pesticides, synthetic fertilisers, or automated watering systems. Everything in his garden grows from scratch, naturally, and outlasts anything the neighbours grow with their chemical shortcuts. His tomatoes are legendary.

**ArnieJS works the same way.**

180+ UI components grown from pure HTML, CSS, and JavaScript. No npm packages. No Webpack. No synthetic dependencies that break every six months when a maintainer renames a config option.

Just copy three files. Drop them in. Watch them grow.

> *"My neighbour installed a framework. Now he spends weekends debugging peer dependency conflicts. My tomatoes are fine."*
> — Arnie

> If ArnieJS saves you from another `npm install`, a ⭐ keeps the garden alive.
> [Star on GitHub →](https://github.com/MarcoZorn/arniejs)

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
Replace `31-bloom-button` with any component folder name. See [cdn.html](https://marcozorn.github.io/arniejs/cdn.html) for the full pattern.

Arnie doesn't love CDNs (he prefers to grow his own), but he understands not everyone has time to dig in the soil.

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
  <p>Useful? ⭐ <a href="https://github.com/MarcoZorn/arniejs">Star on GitHub</a> — it keeps Arnie gardening.</p>
  <p>Made by <a href="https://github.com/MarcoZorn">MarcoZorn</a></p>
  <p><a href="https://marcozorn.github.io/arniejs">Landing</a> · <a href="https://github.com/MarcoZorn/arniejs/issues">Issues</a> · <a href="CONTRIBUTING.md">Contribute</a></p>
</div>
