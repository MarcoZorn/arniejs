// 27 Water Soil — 2D wave-height-field ripple simulation rendered over a clay/terracotta surface.
// Click / drag to disturb the surface. Height map is shaded via simple normal-based lighting
// and composited onto an earthy clay gradient, painted through an offscreen low-res buffer
// then scaled up to the full canvas for performance.
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let W, H, DPR;
function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  setupGrid();
}
addEventListener('resize', resize);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CELL = 6; // simulation cell size in css px
let cols, rows, cur, prev, offCanvas, offCtx, imgData, buf32;
const DAMPING = 0.986;

function setupGrid() {
  cols = Math.ceil(W / CELL) + 1;
  rows = Math.ceil(H / CELL) + 1;
  cur = new Float32Array(cols * rows);
  prev = new Float32Array(cols * rows);
  offCanvas = document.createElement('canvas');
  offCanvas.width = cols; offCanvas.height = rows;
  offCtx = offCanvas.getContext('2d');
  imgData = offCtx.createImageData(cols, rows);
  buf32 = new Uint32Array(imgData.data.buffer);
}

function idx(x, y) { return y * cols + x; }

function disturb(px, py, strength) {
  const x = Math.round(px / CELL), y = Math.round(py / CELL);
  const r = 2;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx < 1 || xx >= cols - 1 || yy < 1 || yy >= rows - 1) continue;
      const d = Math.hypot(dx, dy);
      if (d > r) continue;
      const falloff = 1 - d / r;
      prev[idx(xx, yy)] += strength * falloff;
    }
  }
}

// pointer handling
let dragging = false, lastX = 0, lastY = 0;
function pointerPos(e) {
  const t = e.touches ? e.touches[0] : e;
  return [t.clientX, t.clientY];
}
cv.addEventListener('pointerdown', e => {
  dragging = true;
  const [x, y] = pointerPos(e);
  lastX = x; lastY = y;
  disturb(x, y, 5.5);
});
addEventListener('pointerup', () => dragging = false);
addEventListener('pointermove', e => {
  const [x, y] = pointerPos(e);
  if (dragging) {
    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist > 8) {
      disturb(x, y, 2.2);
      lastX = x; lastY = y;
    }
  }
});
cv.addEventListener('pointerdown', e => e.preventDefault());

// ambient random drips so the pool is never fully still
let dripTimer = 0;
function maybeDrip(dt) {
  dripTimer -= dt;
  if (dripTimer <= 0) {
    dripTimer = 900 + Math.random() * 1400;
    disturb(Math.random() * W, Math.random() * H, 2.5 + Math.random() * 2);
  }
}

// clay palette stops (r,g,b) — deep terracotta to sand highlight, warm shadow towards rust/brown
function clayColor(t, h) {
  // t: base gradient position 0..1 (screen depth), h: local height displacement shading
  const stops = [
    [26, 18, 8],     // deep brown shadow
    [122, 60, 30],   // clay
    [196, 98, 45],   // terracotta
    [212, 168, 90],  // sand highlight
  ];
  const seg = t * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(seg));
  const f = seg - i;
  const a = stops[i], b = stops[i + 1];
  let r = a[0] + (b[0] - a[0]) * f;
  let g = a[1] + (b[1] - a[1]) * f;
  let bl = a[2] + (b[2] - a[2]) * f;
  const shade = 1 + h * 0.9;
  r = Math.max(0, Math.min(255, r * shade));
  g = Math.max(0, Math.min(255, g * shade));
  bl = Math.max(0, Math.min(255, bl * shade));
  return [r | 0, g | 0, bl | 0];
}

function step() {
  for (let y = 1; y < rows - 1; y++) {
    const row = y * cols;
    const rowU = row - cols, rowD = row + cols;
    for (let x = 1; x < cols - 1; x++) {
      const i = row + x;
      const n = (prev[i - 1] + prev[i + 1] + prev[rowU + x] + prev[rowD + x]) / 2 - cur[i];
      cur[i] = n * DAMPING;
    }
  }
  const t = cur; cur = prev; prev = t;
}

function render() {
  const data = buf32;
  const littleEndian = true; // typical, we build ABGR order below via DataView-free approach
  let p = 0;
  for (let y = 0; y < rows; y++) {
    const tGrad = y / rows;
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const h = prev[i];
      // simple normal-based lighting using neighbor slope
      const hl = x > 0 ? prev[i - 1] : h;
      const hr = x < cols - 1 ? prev[i + 1] : h;
      const hu = y > 0 ? prev[i - cols] : h;
      const hd = y < rows - 1 ? prev[i + cols] : h;
      const slopeX = (hr - hl) * 3.2;
      const slopeY = (hd - hu) * 3.2;
      const light = -slopeX * 0.6 - slopeY * 0.8;
      const [r, g, b] = clayColor(tGrad, light + h * 0.15);
      data[p++] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }
  offCtx.putImageData(imgData, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(offCanvas, 0, 0, cols, rows, 0, 0, W, H);

  // subtle vignette to ground the clay pool
  const vg = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.15, W / 2, H * 0.5, Math.max(W, H) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(15,9,4,0.55)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

let lastTime = performance.now();
function frame(now) {
  const dt = now - lastTime; lastTime = now;
  if (!reduced) {
    maybeDrip(dt);
    step();
    step();
    render();
    requestAnimationFrame(frame);
  }
}

resize();
if (reduced) {
  // paint a single static ripple frame, no animation loop
  disturb(W * 0.5, H * 0.45, 5);
  step(); render();
} else {
  disturb(W * 0.5, H * 0.45, 4);
  requestAnimationFrame(frame);
}
