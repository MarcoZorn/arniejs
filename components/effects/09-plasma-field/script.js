// Plasma Field — sine interference plasma rendered per-pixel at 1/SCALE resolution
// then upscaled by the canvas. Smooth HSL palette cycling; mouse shifts palette phase.
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const SCALE = 4;
let W, H, img, buf, palette;
let mousePhase = 0, targetPhase = 0;

function hsl2rgb(h, s, l) {
  h /= 360; const a = s * Math.min(l, 1 - l);
  const f = n => { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k-3, 9-k, 1)); };
  return [f(0)*255, f(8)*255, f(4)*255];
}
function buildPalette(hueShift) {
  const p = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const h = ((i / 256) * 360 + hueShift) % 360;
    const [r, g, b] = hsl2rgb(h, 0.72, 0.55 + 0.12 * Math.sin(i / 256 * Math.PI * 2));
    p[i*3] = r; p[i*3+1] = g; p[i*3+2] = b;
  }
  return p;
}

function resize() {
  W = Math.ceil(window.innerWidth / SCALE);
  H = Math.ceil(window.innerHeight / SCALE);
  canvas.width = W; canvas.height = H;
  img = ctx.createImageData(W, H);
  buf = img.data;
  for (let i = 3; i < buf.length; i += 4) buf[i] = 255;
}
window.addEventListener('resize', resize);

function draw(t) {
  t *= 0.001;
  mousePhase += (targetPhase - mousePhase) * 0.05;
  const hueShift = (t * 22 + mousePhase) % 360;
  palette = buildPalette(hueShift);

  const cx = W * 0.5, cy = H * 0.5;
  const t1 = t * 1.3, t2 = t * 0.9, t3 = t * 1.7, t4 = t * 2.0;
  let idx = 0;
  for (let y = 0; y < H; y++) {
    const sy = y * 0.045;
    const sA = Math.sin(sy + t1);
    const dy = y - cy;
    for (let x = 0; x < W; x++) {
      const sx = x * 0.045;
      let v = sA;
      v += Math.sin(sx + t2);
      v += Math.sin((sx + sy) * 0.5 + t3);
      const dx = x - cx;
      v += Math.sin(Math.sqrt(dx*dx + dy*dy) * 0.05 + t4);
      const pi = (((v * 32) + 128) & 255);
      const p3 = pi * 3;
      buf[idx]   = palette[p3];
      buf[idx+1] = palette[p3+1];
      buf[idx+2] = palette[p3+2];
      idx += 4;
    }
  }
  ctx.putImageData(img, 0, 0);
  requestAnimationFrame(draw);
}

window.addEventListener('pointermove', e => {
  targetPhase = (e.clientX / window.innerWidth) * 360;
});

resize();
requestAnimationFrame(draw);
