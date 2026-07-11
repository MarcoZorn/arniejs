// Particle Text — particles assemble into cycling words, scatter on hover
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
let W, H, DPR;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  buildTargets(words[wi]);
}
window.addEventListener('resize', () => resize());

const mouse = { x: -999, y: -999 };
window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('pointerleave', () => { mouse.x = -999; mouse.y = -999; });

const words = ['CREATE', 'DESIGN', 'MOTION', 'DREAM'];
let wi = 0;

// offscreen for sampling
const off = document.createElement('canvas');
const oc = off.getContext('2d');
let targets = [];

function buildTargets(word) {
  const fs = Math.min(W * 0.24, 260);
  off.width = W; off.height = H;
  oc.clearRect(0, 0, W, H);
  oc.fillStyle = '#fff';
  oc.textAlign = 'center';
  oc.textBaseline = 'middle';
  oc.font = `800 ${fs}px Syne, sans-serif`;
  oc.fillText(word, W / 2, H / 2);
  const data = oc.getImageData(0, 0, W, H).data;
  const gap = Math.max(4, Math.round(fs / 46));
  targets = [];
  for (let y = 0; y < H; y += gap) {
    for (let x = 0; x < W; x += gap) {
      if (data[(y * W + x) * 4 + 3] > 128) {
        const hue = 190 + (x / W) * 120;   // gradient across the word
        targets.push({ x, y, hue });
      }
    }
  }
  assign();
}

const P = 2600;
const parts = [];
for (let i = 0; i < P; i++) {
  parts.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, tx: 0, ty: 0, hue: 210 });
}
function assign() {
  for (let i = 0; i < parts.length; i++) {
    const t = targets.length ? targets[i % targets.length] : { x: W / 2, y: H / 2, hue: 210 };
    parts[i].tx = t.x; parts[i].ty = t.y; parts[i].hue = t.hue;
  }
}

resize();
setInterval(() => { wi = (wi + 1) % words.length; buildTargets(words[wi]); }, 3600);

function frame() {
  ctx.fillStyle = 'rgba(5,6,10,0.35)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  for (const p of parts) {
    let ax = (p.tx - p.x) * 0.012;
    let ay = (p.ty - p.y) * 0.012;
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 14000) {
      const d = Math.sqrt(d2) + 0.01;
      const f = (1 - d / 118) * 3.2;
      ax += (dx / d) * f; ay += (dy / d) * f;
    }
    p.vx = (p.vx + ax) * 0.86;
    p.vy = (p.vy + ay) * 0.86;
    p.x += p.vx; p.y += p.vy;

    const sp = Math.min(1, Math.hypot(p.vx, p.vy) * 0.25);
    const light = 55 + sp * 35;
    ctx.fillStyle = `hsla(${p.hue}, 95%, ${light}%, 0.9)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
