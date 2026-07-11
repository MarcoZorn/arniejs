#!/usr/bin/env node
// Reads components/ui and components/effects, derives category/description/tags
// per component, writes docs/registry.json and docs/sitemap.xml, and injects
// <!-- description: --> / <!-- category: --> comments into each index.html.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://marcozorn.github.io/arniejs';

const UI_CATEGORIES = [
  { max: 30, name: 'misc' },       // pre-existing imported components, mixed
  { max: 40, name: 'buttons' },
  { max: 55, name: 'cards' },
  { max: 65, name: 'navigation' },
  { max: 80, name: 'forms' },
  { max: 90, name: 'loaders' },
  { max: 100, name: 'data-display' },
  { max: 110, name: 'overlays' },
  { max: 120, name: 'layout' },
  { max: 140, name: 'misc' },
  { max: 155, name: 'ecommerce' },
  { max: 170, name: 'saas' },
  { max: 180, name: 'blog' },
  { max: 190, name: 'portfolio' },
  { max: 210, name: 'utility' },
  { max: 240, name: 'fun' },
];

function categoryForUi(num) {
  for (const c of UI_CATEGORIES) if (num <= c.max) return c.name;
  return 'misc';
}

function titleFromSlug(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function extractCssVars(css) {
  const rootMatch = css.match(/:root\s*{([^}]*)}/);
  if (!rootMatch) return [];
  const body = rootMatch[1];
  const varRe = /--([a-zA-Z0-9_-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g;
  const found = [];
  let m;
  while ((m = varRe.exec(body))) {
    found.push({ name: `--${m[1]}`, value: m[2] });
  }
  const priority = (n) => (/accent/i.test(n) ? 0 : /bg/i.test(n) ? 1 : /text|txt|muted/i.test(n) ? 2 : 3);
  found.sort((a, b) => priority(a.name) - priority(b.name));
  // de-dupe by value+name, cap at 6
  const seen = new Set();
  const out = [];
  for (const v of found) {
    const key = v.name;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
    if (out.length >= 6) break;
  }
  return out;
}

function extractDescription(html, title) {
  let m = html.match(/class="[a-zA-Z0-9_-]*(?:sub|desc|tagline|caption)[a-zA-Z0-9_-]*"[^>]*>([^<]{6,140})/i);
  if (m) return m[1].trim().replace(/\s+/g, ' ');
  m = html.match(/class="cap"[^>]*>\s*<b>[^<]*<\/b>\s*<span>([^<]{4,140})<\/span>/i);
  if (m) return m[1].trim().replace(/\s+/g, ' ');
  m = html.match(/class="hint"[^>]*>([^<]{4,140})/i);
  if (m) return m[1].trim().replace(/\s+/g, ' ');
  m = html.match(/<p[^>]*>([^<]{10,140})/i);
  if (m) return m[1].trim().replace(/\s+/g, ' ');
  return `${title} — a vanilla JS ArnieJS component. Zero dependencies.`;
}

function collect(kind) {
  const dir = path.join(ROOT, 'components', kind === 'ui' ? 'ui' : 'effects');
  const folders = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isDirectory());
  folders.sort((a, b) => parseInt(a) - parseInt(b));

  const entries = [];
  for (const folder of folders) {
    const m = folder.match(/^(\d+)-(.+)$/);
    if (!m) continue;
    const [, numStr, slug] = m;
    const num = parseInt(numStr, 10);
    const title = titleFromSlug(slug);
    const category = kind === 'ui' ? categoryForUi(num) : 'effects';

    const htmlPath = path.join(dir, folder, 'index.html');
    const cssPath = path.join(dir, folder, 'style.css');
    let html = fs.readFileSync(htmlPath, 'utf8');
    const css = fs.readFileSync(cssPath, 'utf8');
    const description = extractDescription(html, title);
    const cssVars = extractCssVars(css);

    const tags = Array.from(new Set([...slug.split('-'), category, kind]));

    const relBase = `components/${kind === 'ui' ? 'ui' : 'effects'}/${folder}`;
    const entry = {
      id: slug,
      number: numStr,
      name: title,
      category,
      description,
      tags,
      files: {
        html: `${relBase}/index.html`,
        css: `${relBase}/style.css`,
        js: `${relBase}/script.js`,
      },
      cdn: {
        css: `https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/${relBase}/style.css`,
        js: `https://cdn.jsdelivr.net/gh/MarcoZorn/arniejs@main/${relBase}/script.js`,
      },
      pageUrl: `${SITE}/${relBase}/`,
      type: kind,
      thumbnail: `assets/thumbnails/${kind}-${slug}.jpg`,
      cssVars,
    };
    entries.push(entry);

    // inject/refresh the description + category comments right after <!doctype html>
    const commentBlock = `<!-- description: ${description} -->\n<!-- category: ${category} -->`;
    if (html.includes('<!-- description:')) {
      html = html.replace(/<!-- description:.*-->\n?<!-- category:.*-->\n?/, `${commentBlock}\n`);
    } else {
      html = html.replace(/(<!doctype html>\n)/i, `$1${commentBlock}\n`);
    }
    fs.writeFileSync(htmlPath, html);
  }
  return entries;
}

const registry = [...collect('ui'), ...collect('effects')];
fs.writeFileSync(path.join(ROOT, 'registry.json'), JSON.stringify(registry, null, 2) + '\n');

const urls = [
  `  <url><loc>${SITE}/</loc><priority>1.0</priority></url>`,
  `  <url><loc>${SITE}/gallery.html</loc><priority>0.9</priority></url>`,
  `  <url><loc>${SITE}/docs.html</loc><priority>0.8</priority></url>`,
  `  <url><loc>${SITE}/cdn.html</loc><priority>0.7</priority></url>`,
  ...registry.map((e) => `  <url><loc>${e.pageUrl}</loc><priority>0.5</priority></url>`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

console.log(`registry: ${registry.length} entries written to registry.json`);
console.log(`sitemap: ${urls.length} urls written to sitemap.xml`);
