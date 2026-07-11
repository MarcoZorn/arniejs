// Liquid Metaballs — gooey blobs via radial gradients + CSS blur/contrast
const stage = document.getElementById('stage');
const glow  = document.getElementById('glow');
const sc = stage.getContext('2d');
const gc = glow.getContext('2d');
let W, H, DPR;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  for (const c of [stage, glow]) {
    c.width = W * DPR; c.height = H * DPR;
    c.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
  }
}
window.addEventListener('resize', resize);
resize();

// mercury / neon palette
const palette = [
  [120, 190, 255], [90, 255, 220], [180, 130, 255], [80, 160, 255]
];

const mouse = { x: W / 2, y: H / 2, active: false };
window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; });
window.addEventListener('pointerleave', () => mouse.active = false);

class Blob {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : (Math.random() < .5 ? -80 : H + 80);
    this.r = 40 + Math.random() * 70;
    this.vx = (Math.random() - .5) * .5;
    this.vy = (Math.random() - .5) * .5;
    this.col = palette[(Math.random() * palette.length) | 0];
    this.phase = Math.random() * Math.PI * 2;
  }
  step() {
    this.phase += 0.01;
    const rr = this.r + Math.sin(this.phase) * 8;
    if (mouse.active) {
      const dx = mouse.x - this.x, dy = mouse.y - this.y;
      const d = Math.hypot(dx, dy) + .001;
      const f = Math.min(60 / d, 0.12);
      this.vx += (dx / d) * f;
      this.vy += (dy / d) * f;
    }
    this.vx *= 0.96; this.vy *= 0.96;
    this.x += this.vx; this.y += this.vy;
    if (this.x < -120) this.x = W + 120; if (this.x > W + 120) this.x = -120;
    if (this.y < -120) this.y = H + 120; if (this.y > H + 120) this.y = -120;
    this.drawR = rr;
  }
  draw(ctx, alpha) {
    const [r, g, b] = this.col;
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.drawR);
    grd.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
    grd.addColorStop(0.72, `rgba(${r},${g},${b},${alpha * 0.9})`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.drawR, 0, Math.PI * 2);
    ctx.fill();
  }
}

const blobs = Array.from({ length: 11 }, () => new Blob());
const mBlob = new Blob(); mBlob.r = 55;

function frame(t) {
  sc.clearRect(0, 0, W, H);
  gc.clearRect(0, 0, W, H);

  for (const bl of blobs) { bl.step(); bl.draw(sc, 1); bl.draw(gc, 0.5); }

  if (mouse.active) {
    mBlob.x += (mouse.x - mBlob.x) * 0.2;
    mBlob.y += (mouse.y - mBlob.y) * 0.2;
    mBlob.drawR = 55 + Math.sin(t * 0.004) * 10;
    mBlob.col = [200, 240, 255];
    mBlob.draw(sc, 1); mBlob.draw(gc, 0.6);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
