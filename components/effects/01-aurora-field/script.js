/* AURORA FIELD — interactive flow-field particle system
   Pure canvas 2D, no libraries. Curl-ish noise field drives thousands of
   additive-blended particles; the cursor warps the field, clicks send shockwaves. */

const cv = document.getElementById('c');
const ctx = cv.getContext('2d', { alpha: false });

let W, H, DPR;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.width = innerWidth * DPR;
  H = cv.height = innerHeight * DPR;
  ctx.scale(1, 1);
}
addEventListener('resize', resize);
resize();

/* --- tiny value-noise (deterministic, cheap) --- */
const perm = new Uint8Array(512);
function seedNoise() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher–Yates with an LCG so it's varied but Date-free
  let s = (state.seed = (state.seed * 1103515245 + 12345) & 0x7fffffff);
  for (let i = 255; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
function grad(h, x, y) {
  switch (h & 3) {
    case 0: return x + y; case 1: return -x + y;
    case 2: return x - y; default: return -x - y;
  }
}
function noise(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x), v = fade(y);
  const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1];
  const ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1];
  return lerp(
    lerp(grad(aa, x, y), grad(ba, x - 1, y), u),
    lerp(grad(ab, x, y - 1), grad(bb, x - 1, y - 1), u),
    v
  );
}

/* --- state --- */
const state = { seed: 20260711, t: 0 };
const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, active: false };
const shocks = [];

const COUNT = Math.round((innerWidth * innerHeight) / 1400);
const SCALE = 0.0016;   // field frequency
const SPEED = 2.4;

let particles = [];
function spawn() {
  particles = new Array(COUNT).fill(0).map(() => reseedParticle({}));
}
function reseedParticle(p) {
  p.x = Math.random() * W;
  p.y = Math.random() * H;
  p.life = 60 + Math.random() * 220;
  p.age = 0;
  p.hue = 190 + Math.random() * 130;   // cyan → magenta band
  p.w = 0.6 + Math.random() * 1.6;
  return p;
}

function reshuffle() {
  state.seed = (state.seed ^ ((state.t * 1000) | 0)) >>> 0 || 1;
  seedNoise();
  spawn();
}

/* --- input --- */
addEventListener('pointermove', e => {
  pointer.px = pointer.x; pointer.py = pointer.y;
  pointer.x = e.clientX * DPR; pointer.y = e.clientY * DPR;
  pointer.active = true;
});
addEventListener('pointerdown', e => {
  shocks.push({ x: e.clientX * DPR, y: e.clientY * DPR, r: 0, life: 1 });
});
addEventListener('keydown', e => { if (e.key.toLowerCase() === 'r') reshuffle(); });

/* --- render loop --- */
ctx.fillStyle = '#1a1208';
ctx.fillRect(0, 0, W, H);

function frame() {
  state.t += 0.006;

  // trail fade instead of clear → silky light trails
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(5,6,10,0.075)';
  ctx.fillRect(0, 0, W, H);

  ctx.globalCompositeOperation = 'lighter';

  const mvx = pointer.x - pointer.px, mvy = pointer.y - pointer.py;
  const mSpeed = Math.min(Math.hypot(mvx, mvy), 60);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // base flow angle from noise field, animated over time
    const n = noise(p.x * SCALE, p.y * SCALE + state.t);
    let a = n * Math.PI * 3;
    let vx = Math.cos(a), vy = Math.sin(a);

    // cursor attraction + swirl
    if (pointer.active) {
      const dx = pointer.x - p.x, dy = pointer.y - p.y;
      const d2 = dx * dx + dy * dy;
      const R = 220 * DPR;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) + 0.001;
        const f = (1 - d / R);
        // tangential swirl for a vortex feel
        vx += (-dy / d) * f * 2.2 + (mvx / 60) * f;
        vy += (dx / d) * f * 2.2 + (mvy / 60) * f;
      }
    }

    // shockwaves push particles outward on a ring
    for (const s of shocks) {
      const dx = p.x - s.x, dy = p.y - s.y;
      const d = Math.hypot(dx, dy) + 0.001;
      const band = Math.abs(d - s.r);
      if (band < 60 * DPR) {
        const f = (1 - band / (60 * DPR)) * s.life * 6;
        vx += (dx / d) * f; vy += (dy / d) * f;
      }
    }

    const m = Math.hypot(vx, vy) || 1;
    p.x += (vx / m) * SPEED * DPR;
    p.y += (vy / m) * SPEED * DPR;

    // brightness reacts to cursor motion for a "living" feel
    const light = 55 + mSpeed * 0.4;
    ctx.strokeStyle = `hsla(${p.hue},95%,${Math.min(72, light)}%,0.55)`;
    ctx.lineWidth = p.w * DPR;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + (vx / m) * 3 * DPR, p.y + (vy / m) * 3 * DPR);
    ctx.stroke();

    p.age++;
    if (p.age > p.life || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
      reseedParticle(p);
    }
  }

  // advance shockwaves
  for (let i = shocks.length - 1; i >= 0; i--) {
    const s = shocks[i];
    s.r += 9 * DPR; s.life *= 0.965;
    if (s.life < 0.03) shocks.splice(i, 1);
  }

  requestAnimationFrame(frame);
}

seedNoise();
spawn();
frame();
