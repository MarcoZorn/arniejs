// Game of Life — Conway's Life on a wrapping grid. Cells carry an "age" that drives a
// heatmap color with soft glow; state interpolates between steps for a smooth living look.
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha:false });
const CELL = 14;               // cell size in CSS px
let W, H, DPR, cw, ch;
let grid, next, age, fade;     // fade = per-cell 0..1 render intensity
const STEP_MS = 130;           // simulation step interval
let lastStep = 0;

function alloc() {
  const n = cw * ch;
  grid = new Uint8Array(n);
  next = new Uint8Array(n);
  age  = new Uint16Array(n);
  fade = new Float32Array(n);
}
function seed(density = 0.22) {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < density ? 1 : 0;
    age[i] = grid[i];
    fade[i] = grid[i];
  }
}
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  cw = Math.ceil(W / CELL); ch = Math.ceil(H / CELL);
  alloc(); seed();
}
window.addEventListener('resize', resize);

function idx(x, y) { return ((y + ch) % ch) * cw + ((x + cw) % cw); }

function step() {
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      let n = 0;
      n += grid[idx(x-1,y-1)] + grid[idx(x,y-1)] + grid[idx(x+1,y-1)];
      n += grid[idx(x-1,y  )]                    + grid[idx(x+1,y  )];
      n += grid[idx(x-1,y+1)] + grid[idx(x,y+1)] + grid[idx(x+1,y+1)];
      const i = y * cw + x;
      const alive = grid[i] ? (n === 2 || n === 3) : (n === 3);
      next[i] = alive ? 1 : 0;
      if (alive) age[i] = Math.min(age[i] + 1, 512);
      else age[i] = 0;
    }
  }
  const t = grid; grid = next; next = t;
}

// age-based heatmap: young = teal, mature = amber, old = magenta-white
function color(a) {
  const k = Math.min(a / 60, 1);
  let r, g, b;
  if (k < 0.5) { const u = k / 0.5; r = 40 + u*215; g = 220 - u*40; b = 200 - u*120; }
  else { const u = (k - 0.5) / 0.5; r = 255; g = 180 - u*90; b = 80 + u*160; }
  return [r|0, g|0, b|0];
}

function render() {
  ctx.fillStyle = '#1a1208';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  const r = CELL * 0.42;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      // ease fade toward current alive state
      fade[i] += ((grid[i] ? 1 : 0) - fade[i]) * 0.18;
      const f = fade[i];
      if (f < 0.02) continue;
      const [cr, cg, cb] = color(age[i]);
      const px = x * CELL + CELL/2, py = y * CELL + CELL/2;
      ctx.shadowColor = `rgba(${cr},${cg},${cb},0.9)`;
      ctx.shadowBlur = 10 * f;
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.85 * f})`;
      ctx.beginPath();
      ctx.arc(px, py, r * (0.5 + 0.5*f), 0, Math.PI*2);
      ctx.fill();
    }
  }
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'source-over';
}

function loop(t) {
  if (t - lastStep > STEP_MS) { step(); lastStep = t; }
  render();
  requestAnimationFrame(loop);
}

// painting
let painting = false;
function paintAt(e) {
  const x = (e.clientX / CELL) | 0, y = (e.clientY / CELL) | 0;
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const i = idx(x+dx, y+dy);
    grid[i] = 1; age[i] = Math.max(age[i], 1); fade[i] = 1;
  }
}
canvas.addEventListener('pointerdown', e => { painting = true; paintAt(e); });
window.addEventListener('pointermove', e => { if (painting) paintAt(e); });
window.addEventListener('pointerup', () => { painting = false; });
window.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); seed(0.24); } });

resize();
requestAnimationFrame(loop);
