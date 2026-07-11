// 30 Root Wave — procedural audio-waveform-style vertical bars in clay tones.
// No real audio: bar heights are driven by layered sine oscillators (poor-man's noise) so it
// reads as a music visualizer idling. Mouse position adds a local amplitude bump and a global tilt.
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let W, H, DPR;
function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  buildBars();
}
addEventListener('resize', resize);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

let bars = [];
const BAR_GAP = 5;
let barWidth = 6;

function buildBars() {
  bars = [];
  barWidth = 6;
  const count = Math.floor(W / (barWidth + BAR_GAP));
  const usedWidth = count * (barWidth + BAR_GAP) - BAR_GAP;
  const offsetX = (W - usedWidth) / 2;
  for (let i = 0; i < count; i++) {
    bars.push({
      x: offsetX + i * (barWidth + BAR_GAP),
      i,
      seedA: rand(0, Math.PI * 2),
      seedB: rand(0, Math.PI * 2),
      seedC: rand(0, Math.PI * 2),
      freqA: rand(0.7, 1.3),
      freqB: rand(1.6, 2.8),
      freqC: rand(0.15, 0.4),
    });
  }
}

let mouseX = -9999, mouseY = 0.5, smoothMY = 0.5;
addEventListener('pointermove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY / H;
});
addEventListener('pointerleave', () => { mouseX = -9999; });

// clay palette gradient stops from base (dark rust) to tip (sand/cream)
function barColor(t, boost) {
  const stops = [
    [122, 60, 30],   // clay
    [196, 98, 45],   // terracotta
    [212, 168, 90],  // sand
    [240, 230, 211], // cream tip highlight
  ];
  const seg = t * (stops.length - 1);
  const idx = Math.min(stops.length - 2, Math.floor(seg));
  const f = seg - idx;
  const a = stops[idx], b = stops[idx + 1];
  const r = a[0] + (b[0] - a[0]) * f;
  const g = a[1] + (b[1] - a[1]) * f;
  const bl = a[2] + (b[2] - a[2]) * f;
  const s = 1 + boost * 0.4;
  return `rgb(${clamp(r * s, 0, 255) | 0},${clamp(g * s, 0, 255) | 0},${clamp(bl * s, 0, 255) | 0})`;
}

function barHeight(bar, t, baseline) {
  const w1 = Math.sin(t * 0.0016 * bar.freqA + bar.seedA);
  const w2 = Math.sin(t * 0.0027 * bar.freqB + bar.seedB) * 0.5;
  const w3 = Math.sin(t * 0.0004 * bar.freqC + bar.seedC) * 0.7;
  let n = (w1 + w2 + w3) / 2.2; // roughly -1..1
  n = (n + 1) / 2; // 0..1

  // mouse proximity bump
  let bump = 0;
  if (mouseX > -1000) {
    const d = Math.abs(bar.x - mouseX);
    bump = Math.exp(-(d * d) / (2 * 160 * 160)) * 0.6;
  }

  const amp = baseline * (0.15 + n * 0.85 + bump);
  return { h: amp, energy: n + bump };
}

function render(t) {
  ctx.clearRect(0, 0, W, H);
  smoothMY += (mouseY - smoothMY) * 0.03;
  const centerY = H * (0.5 + (smoothMY - 0.5) * 0.12);
  const baseline = H * 0.38;

  for (const bar of bars) {
    const { h, energy } = barHeight(bar, t, baseline);
    const x = bar.x;
    const halfH = h / 2;
    const grad = ctx.createLinearGradient(0, centerY - halfH, 0, centerY + halfH);
    grad.addColorStop(0, barColor(1, energy));
    grad.addColorStop(0.5, barColor(0.15, energy));
    grad.addColorStop(1, barColor(1, energy));
    ctx.fillStyle = grad;

    const radius = Math.min(barWidth / 2, 3);
    roundRect(ctx, x, centerY - halfH, barWidth, h, radius);
    ctx.fill();

    // soft glow cap
    ctx.save();
    ctx.globalAlpha = 0.35 + energy * 0.15;
    ctx.fillStyle = barColor(1, energy);
    ctx.beginPath();
    ctx.arc(x + barWidth / 2, centerY - halfH, barWidth * 0.55, 0, Math.PI * 2);
    ctx.arc(x + barWidth / 2, centerY + halfH, barWidth * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function frame(t) {
  render(t);
  requestAnimationFrame(frame);
}

resize();
if (reduced) {
  render(0);
} else {
  requestAnimationFrame(frame);
}
