// Matrix Rain — Canvas digital rain with bright leading glyph, fade trails,
// variable column speeds and a mouse disturbance field.
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha:false });
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンｱｲｳ0123456789:.=*+-<>¦';
let W, H, DPR, cols, colW = 18;
let drops = [];
let mouse = { x:-9999, y:-9999, t:0 };

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  cols = Math.ceil(W / colW);
  drops = [];
  for (let i = 0; i < cols; i++) {
    drops.push({
      y: Math.random() * -H,
      speed: 0.6 + Math.random() * 1.9,
      len: 8 + (Math.random() * 22 | 0),
      head: '',
      cd: 0
    });
  }
  ctx.fillStyle = '#1a1208'; ctx.fillRect(0, 0, W, H);
}
window.addEventListener('resize', resize);

function rndGlyph() { return GLYPHS[(Math.random() * GLYPHS.length) | 0]; }

function draw() {
  ctx.fillStyle = 'rgba(5,6,10,0.10)';
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'top';
  const fontSize = 15;
  ctx.font = `${fontSize}px 'Space Mono', monospace`;

  for (let i = 0; i < cols; i++) {
    const d = drops[i];
    const x = i * colW + colW / 2;

    let boost = 0;
    if (mouse.t > 0) {
      const dd = Math.abs(x - mouse.x);
      if (dd < 140) boost = (1 - dd / 140) * mouse.t;
    }

    d.cd -= 1;
    if (d.cd <= 0) { d.head = rndGlyph(); d.cd = 2 + (Math.random()*4|0); }

    const speed = d.speed * (1 + boost * 2.2);
    d.y += speed;

    const headRow = d.y / fontSize | 0;
    const headY = headRow * fontSize;

    for (let k = 0; k < d.len; k++) {
      const ry = headY - k * fontSize;
      if (ry < -fontSize || ry > H) continue;
      const ch = (k === 0) ? d.head : rndGlyph();
      if (k === 0) {
        ctx.shadowColor = 'rgba(150,255,190,0.9)';
        ctx.shadowBlur = 8 + boost * 10;
        ctx.fillStyle = 'rgba(220,255,235,0.95)';
      } else {
        ctx.shadowBlur = boost > 0.2 ? 4 : 0;
        ctx.shadowColor = 'rgba(60,255,140,0.5)';
        const fade = 1 - k / d.len;
        const green = (200 + boost * 55) | 0;
        ctx.fillStyle = `rgba(${(40 + boost*120)|0}, ${green}, ${(120 + boost*60)|0}, ${fade * (0.55 + boost*0.4)})`;
      }
      ctx.fillText(ch, x - fontSize/2, ry);
    }
    ctx.shadowBlur = 0;

    if (headY - d.len * fontSize > H) {
      d.y = Math.random() * -H * 0.4;
      d.speed = 0.6 + Math.random() * 1.9;
      d.len = 8 + (Math.random() * 22 | 0);
    }
  }

  if (mouse.t > 0) mouse.t -= 0.02;
  requestAnimationFrame(draw);
}

window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.t = 1; });
window.addEventListener('pointerleave', () => { mouse.t = 0; });

resize();
draw();
