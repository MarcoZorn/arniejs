// Gooey Cursor — springy lag chain of neon blobs merged by an SVG goo filter.
// Head follows the pointer; each node trails the previous. Click spawns a burst.
const svg = document.getElementById('stage');
const group = document.getElementById('goo-group');
const NS = 'http://www.w3.org/2000/svg';

let mx = window.innerWidth/2, my = window.innerHeight/2;
window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });

const CHAIN = 16;
const nodes = [];
for (let i = 0; i < CHAIN; i++) {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('r', Math.max(6, 26 - i * 1.1));
  c.setAttribute('fill', 'url(#grad)');
  group.appendChild(c);
  nodes.push({ el:c, x:mx, y:my, vx:0, vy:0 });
}

let bursts = [];
function spawnBurst(x, y) {
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random()*0.5;
    const sp = 4 + Math.random() * 7;
    const el = document.createElementNS(NS, 'circle');
    el.setAttribute('r', 10 + Math.random()*12);
    el.setAttribute('fill', 'url(#grad)');
    group.appendChild(el);
    bursts.push({ el, x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, life:1 });
  }
}
window.addEventListener('pointerdown', e => spawnBurst(e.clientX, e.clientY));

function tick() {
  let px = mx, py = my;
  for (let i = 0; i < CHAIN; i++) {
    const nd = nodes[i];
    const k = 0.28 - i * 0.006;
    nd.vx += (px - nd.x) * k; nd.vy += (py - nd.y) * k;
    nd.vx *= 0.62; nd.vy *= 0.62;
    nd.x += nd.vx; nd.y += nd.vy;
    nd.el.setAttribute('cx', nd.x.toFixed(1));
    nd.el.setAttribute('cy', nd.y.toFixed(1));
    px = nd.x; py = nd.y;
  }

  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];
    b.x += b.vx; b.y += b.vy;
    b.vx *= 0.92; b.vy *= 0.92; b.vy += 0.15;
    b.life -= 0.02;
    if (b.life <= 0) { b.el.remove(); bursts.splice(i, 1); continue; }
    b.el.setAttribute('cx', b.x.toFixed(1));
    b.el.setAttribute('cy', b.y.toFixed(1));
    b.el.setAttribute('r', (b.life * 20).toFixed(1));
  }
  requestAnimationFrame(tick);
}
tick();
