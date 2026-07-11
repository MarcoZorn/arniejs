// 28 Northern Roots — aurora borealis reimagined in green/amber earth tones.
// Layered vertical sine-wave ribbons drift and glow, softly blurred, additive blend.
// Mouse position nudges the drift direction subtly.
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let W, H, DPR;
function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  buildRibbons();
}
addEventListener('resize', resize);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (a, b) => a + Math.random() * (b - a);

// earthy "aurora" palette — moss / sage / amber / rust / sand, no cool colors
const PALETTE = [
  [90, 122, 58],   // moss
  [143, 168, 110], // sage
  [196, 98, 45],   // terracotta
  [212, 168, 90],  // sand
  [160, 56, 32],   // rust
  [155, 107, 58],  // clay
];

let ribbons = [];
function buildRibbons() {
  ribbons = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const col = PALETTE[i % PALETTE.length];
    ribbons.push({
      baseX: rand(W * 0.1, W * 0.9),
      amp: rand(60, 160) * (W / 1600 + 0.4),
      freq: rand(0.0018, 0.0038),
      speed: rand(0.00025, 0.0007) * (Math.random() < 0.5 ? 1 : -1),
      phase: rand(0, Math.PI * 2),
      width: rand(70, 160),
      color: col,
      alpha: rand(0.18, 0.34),
      drift: rand(0.15, 0.4),
      driftPhase: rand(0, Math.PI * 2),
    });
  }
}

let mouseX = 0.5, mouseY = 0.5, smoothMX = 0.5;
addEventListener('pointermove', e => {
  mouseX = e.clientX / W;
  mouseY = e.clientY / H;
});

function drawRibbon(r, t) {
  const segs = 48;
  const pts = [];
  for (let s = 0; s <= segs; s++) {
    const y = (s / segs) * H;
    const sway = Math.sin(y * r.freq + t * r.speed * 1000 + r.phase) * r.amp;
    const driftWave = Math.sin(t * 0.00035 + r.driftPhase) * 40 * r.drift;
    const mouseNudge = (smoothMX - 0.5) * 90;
    const x = r.baseX + sway + driftWave + mouseNudge;
    pts.push([x, y]);
  }

  ctx.save();
  ctx.filter = 'blur(28px)';
  ctx.globalCompositeOperation = 'lighter';

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  const [cr, cg, cb] = r.color;
  grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
  grad.addColorStop(0.18, `rgba(${cr},${cg},${cb},${r.alpha})`);
  grad.addColorStop(0.5, `rgba(${Math.min(255, cr + 30)},${Math.min(255, cg + 20)},${cb},${r.alpha * 1.2})`);
  grad.addColorStop(0.82, `rgba(${cr},${cg},${cb},${r.alpha})`);
  grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);

  ctx.strokeStyle = grad;
  ctx.lineWidth = r.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let s = 1; s < pts.length; s++) ctx.lineTo(pts[s][0], pts[s][1]);
  ctx.stroke();

  // brighter thin core for extra glow definition
  ctx.filter = 'blur(6px)';
  ctx.lineWidth = Math.max(4, r.width * 0.12);
  ctx.strokeStyle = `rgba(${Math.min(255, cr + 60)},${Math.min(255, cg + 45)},${Math.min(255, cb + 20)},${r.alpha * 0.9})`;
  ctx.stroke();

  ctx.restore();
}

function backdrop() {
  ctx.fillStyle = 'rgba(20,14,7,0.16)';
  ctx.fillRect(0, 0, W, H);
}

function frame(t) {
  smoothMX += (mouseX - smoothMX) * 0.02;
  backdrop();
  for (const r of ribbons) drawRibbon(r, t);
  requestAnimationFrame(frame);
}

function staticFrame() {
  ctx.fillStyle = '#1a1208';
  ctx.fillRect(0, 0, W, H);
  for (const r of ribbons) drawRibbon(r, 0);
}

resize();
if (reduced) {
  staticFrame();
} else {
  ctx.fillStyle = '#1a1208';
  ctx.fillRect(0, 0, W, H);
  requestAnimationFrame(frame);
}
