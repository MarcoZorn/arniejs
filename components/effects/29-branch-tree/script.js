// 29 Branch Tree — recursive fractal tree, organic branching, tapering width, leaf dots at tips.
// Branch structure is generated once (recursive tree of nodes with base angles), then redrawn
// every frame with each node's angle nudged by a slow sine oscillation so the whole tree sways
// gently and coherently (small trunk sway cascades into larger tip sway through the transform stack).
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let W, H, DPR;
function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  grow();
}
addEventListener('resize', resize);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (a, b) => a + Math.random() * (b - a);

// earthy palette: bark clay/brown gradient, moss/sage/sand leaf dots
const BARK_A = [58, 34, 16];   // dark root brown
const BARK_B = [164, 96, 48];  // clay branch tip
const LEAF_COLORS = ['#8fa86e', '#5a7a3a', '#d4a85a', '#c4622d'];

const MAX_DEPTH = 11;

function buildNode(depth, len) {
  const node = {
    len,
    depth,
    phase: rand(0, Math.PI * 2),
    freq: rand(0.5, 1.1),
    children: [],
    isTip: depth >= MAX_DEPTH || len < 6,
  };
  if (!node.isTip) {
    const nKids = Math.random() < 0.22 ? 3 : 2;
    const baseSplit = rand(16, 30) * (Math.PI / 180);
    for (let i = 0; i < nKids; i++) {
      const spread = nKids === 3 ? (i - 1) * baseSplit * 1.15 : (i === 0 ? -baseSplit : baseSplit);
      const jitter = rand(-0.09, 0.09);
      const childLen = len * rand(0.72, 0.82);
      const child = buildNode(depth + 1, childLen);
      child.angleOffset = spread + jitter;
      node.children.push(child);
    }
  }
  return node;
}

let tree;
function grow() {
  const trunkLen = Math.min(H, W) * 0.16 + rand(-10, 10);
  tree = buildNode(0, trunkLen);
}

cv.addEventListener('pointerdown', () => grow());

function lerpColor(c1, c2, t) {
  return [
    c1[0] + (c2[0] - c1[0]) * t,
    c1[1] + (c2[1] - c1[1]) * t,
    c1[2] + (c2[2] - c1[2]) * t,
  ];
}

function drawNode(node, t) {
  const sway = Math.sin(t * 0.00035 * node.freq + node.phase) * (0.05 + node.depth * 0.012);
  const angle = (node.angleOffset || 0) + sway;

  ctx.rotate(angle);

  const depthT = Math.min(1, node.depth / MAX_DEPTH);
  const [r, g, b] = lerpColor(BARK_A, BARK_B, depthT);
  ctx.strokeStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
  ctx.lineWidth = Math.max(0.6, (MAX_DEPTH - node.depth) * 1.15);
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -node.len);
  ctx.stroke();

  ctx.translate(0, -node.len);

  if (node.isTip) {
    const col = LEAF_COLORS[node.depth % LEAF_COLORS.length];
    ctx.save();
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(0, 0, rand(2, 3.4), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  } else {
    for (const child of node.children) {
      ctx.save();
      drawNode(child, t);
      ctx.restore();
    }
  }
}

function render(t) {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(W / 2, H * 0.94);
  drawNode(tree, t);
  ctx.restore();
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
