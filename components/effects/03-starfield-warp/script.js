// Starfield Warp — hyperspace streaks reacting to mouse + click boost
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
let W, H, CX, CY, DPR;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  CX = W / 2; CY = H / 2;
}
window.addEventListener('resize', resize);
resize();

const mouse = { x: W / 2, y: H / 2 };
window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

let boost = 0;
window.addEventListener('pointerdown', () => { boost = 1; });

const N = 520;
const stars = [];
function makeStar(fresh) {
  return {
    a: Math.random() * Math.PI * 2,      // angle
    r: fresh ? Math.random() * 60 : 0,   // radius from centre
    z: 0.2 + Math.random() * 0.8,        // depth (speed/size factor)
    pr: 0,                               // previous radius (for streak)
    hue: 200 + Math.random() * 60        // blue-cyan-violet
  };
}
for (let i = 0; i < N; i++) stars.push(makeStar(true));

function frame() {
  ctx.fillStyle = 'rgba(5,6,10,0.28)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  const md = Math.hypot(mouse.x - CX, mouse.y - CY) / Math.hypot(CX, CY);
  const speed = 0.006 + md * 0.02 + boost * 0.05;
  boost *= 0.94;

  const maxR = Math.hypot(CX, CY);

  for (const s of stars) {
    s.pr = s.r;
    s.r += s.r * speed * s.z * 60 * 0.016 + 0.6 + s.z * 1.5 + boost * 40;
    const x = CX + Math.cos(s.a) * s.r;
    const y = CY + Math.sin(s.a) * s.r;
    const px = CX + Math.cos(s.a) * s.pr;
    const py = CY + Math.sin(s.a) * s.pr;

    if (s.r > maxR + 40 || x < -40 || x > W + 40 || y < -40 || y > H + 40) {
      Object.assign(s, makeStar(false));
      continue;
    }
    const prog = s.r / maxR;                 // 0 centre -> 1 edge
    const w = Math.max(0.4, prog * 2.4 * s.z);
    const light = 45 + prog * 45;
    ctx.strokeStyle = `hsla(${s.hue - prog * 40}, 90%, ${light}%, ${0.25 + prog * 0.7})`;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
