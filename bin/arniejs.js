#!/usr/bin/env node
// ArnieJS CLI — the shadcn model for vanilla JS.
// Usage: npx arniejs-cli add <component-name>

const fs = require('fs');
const path = require('path');

const REPO = 'MarcoZorn/arniejs';
const RAW = `https://raw.githubusercontent.com/${REPO}/main`;

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.text();
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function add(name) {
  if (!name) {
    console.error('Usage: npx arniejs-cli add <component-name>');
    process.exit(1);
  }

  console.log(`🌱 Digging up "${name}" from the garden…`);

  let registry;
  try {
    registry = await fetchJson(`${RAW}/registry.json`);
  } catch (err) {
    console.error('Could not reach the ArnieJS registry:', err.message);
    process.exit(1);
  }

  const entry = registry.find((e) => e.id === name || `${e.number}-${e.id}` === name);
  if (!entry) {
    const close = registry.filter((e) => e.id.includes(name)).slice(0, 8).map((e) => e.id);
    console.error(`No component named "${name}" found.`);
    if (close.length) console.error(`Did you mean: ${close.join(', ')}?`);
    console.error('Browse the full list at https://marcozorn.github.io/arniejs/gallery.html');
    process.exit(1);
  }

  const destDir = path.join(process.cwd(), 'arniejs', entry.id);
  fs.mkdirSync(destDir, { recursive: true });

  const files = { 'index.html': entry.files.html, 'style.css': entry.files.css, 'script.js': entry.files.js };
  for (const [filename, relPath] of Object.entries(files)) {
    const content = await fetchText(`${RAW}/${relPath}`);
    fs.writeFileSync(path.join(destDir, filename), content);
  }

  console.log(`✅ Planted "${entry.name}" in ./arniejs/${entry.id}/`);
  console.log(`   index.html · style.css · script.js — no dependencies, no build step.`);
  console.log('\n🌱  If ArnieJS saves you time, star the garden:');
  console.log('    https://github.com/MarcoZorn/arniejs\n');
}

async function list() {
  let registry;
  try {
    registry = await fetchJson(`${RAW}/registry.json`);
  } catch (err) {
    console.error('Could not reach the ArnieJS registry:', err.message);
    process.exit(1);
  }
  const byCategory = {};
  for (const e of registry) {
    (byCategory[e.category] ||= []).push(e.id);
  }
  for (const [cat, ids] of Object.entries(byCategory)) {
    console.log(`\n${cat}:`);
    console.log('  ' + ids.join(', '));
  }
}

async function search(query) {
  if (!query) {
    console.error('Usage: npx arniejs-cli search <query>');
    process.exit(1);
  }
  let registry;
  try {
    registry = await fetchJson(`${RAW}/registry.json`);
  } catch (err) {
    console.error('Could not reach the ArnieJS registry:', err.message);
    process.exit(1);
  }
  const q = query.toLowerCase();
  const matches = registry.filter((e) =>
    e.id.includes(q) ||
    e.name.toLowerCase().includes(q) ||
    e.description.toLowerCase().includes(q) ||
    e.tags.some((t) => t.includes(q))
  );
  if (!matches.length) {
    console.log(`No components match "${query}".`);
    return;
  }
  console.log(`${matches.length} match(es) for "${query}":\n`);
  matches.forEach((e) => console.log(`  ${e.id}  (${e.category})  — ${e.description}`));
  console.log(`\nPlant one with: npx arniejs-cli add <name>`);
}

function help() {
  console.log(`ArnieJS CLI — copy vanilla JS components straight into your project.

Usage:
  npx arniejs-cli add <component-name>   Plant a component in ./arniejs/<name>/
  npx arniejs-cli list                   List every component, grouped by category
  npx arniejs-cli search <query>         Search components by name, tag, or description
  npx arniejs-cli help                   Show this message

Examples:
  npx arniejs-cli add bloom-button
  npx arniejs-cli search cursor
  npx arniejs-cli search ecommerce

No dependencies. No build step. Just files.`);
}

const [, , cmd, arg] = process.argv;

(async () => {
  if (cmd === 'add') await add(arg);
  else if (cmd === 'list') await list();
  else if (cmd === 'search') await search(arg);
  else help();
})();
