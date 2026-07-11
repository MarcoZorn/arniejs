// 32 Warm Bokeh — soft blurred amber/clay circular bokeh orbs drifting and overlapping.
// Radial-gradient + shadowBlur glow per orb, parallax depth, 'lighter' composite blending.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener('resize',resize);resize();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);

const PALETTE=[
  [196,98,45],   // terracotta
  [212,168,90],  // sand
  [155,107,58],  // clay
  [160,56,32],   // rust
  [240,230,211], // cream (rare, bright highlight orb)
];

const COUNT=46;
const orbs=[];
function makeOrb(randomizeX){
  const depth=rand(0.15,1); // 0 = far/small/slow, 1 = near/big/fast
  const c=PALETTE[Math.random()<0.08 ? 4 : Math.floor(rand(0,4))];
  return {
    x: randomizeX ? rand(0,W) : rand(-W*0.1,W*1.1),
    y: rand(0,H*1.15),
    r: rand(18,70) * (0.35+depth*0.9),
    depth,
    vx: rand(-1,1)*0.10*(0.3+depth),
    vy: -rand(0.06,0.22)*(0.3+depth),
    alpha: rand(0.18,0.42) * (0.4+depth*0.8),
    color:c,
    phase: rand(0,Math.PI*2),
    flicker: rand(0.15,0.5),
  };
}
for(let i=0;i<COUNT;i++) orbs.push(makeOrb(true));

let mx=0,my=0,tmx=0,tmy=0;
addEventListener('pointermove',e=>{
  tmx=(e.clientX/innerWidth-0.5)*2;
  tmy=(e.clientY/innerHeight-0.5)*2;
});

function drawOrb(o,t){
  const parX = mx * 26 * o.depth;
  const parY = my * 26 * o.depth;
  const x=o.x+parX, y=o.y+parY;
  const flick=1 + Math.sin(t*0.0009*o.flicker*4 + o.phase)*0.12;
  const a=o.alpha*flick;
  const [r,g,b]=o.color;

  const grad=ctx.createRadialGradient(x,y,0,x,y,o.r);
  grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
  grad.addColorStop(0.55, `rgba(${r},${g},${b},${a*0.5})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

  ctx.shadowColor=`rgba(${r},${g},${b},${Math.min(0.6,a*1.4)})`;
  ctx.shadowBlur=o.r*0.9;
  ctx.fillStyle=grad;
  ctx.beginPath();
  ctx.arc(x,y,o.r,0,Math.PI*2);
  ctx.fill();
}

function step(now){
  for(const o of orbs){
    o.x+=o.vx;
    o.y+=o.vy;
    if(o.y< -o.r*1.5){
      Object.assign(o, makeOrb(false));
      o.y=H+o.r;
    }
    if(o.x< -o.r*2) o.x=W+o.r*2;
    if(o.x> W+o.r*2) o.x=-o.r*2;
  }
}

function frame(now){
  mx += (tmx-mx)*0.04;
  my += (tmy-my)*0.04;

  ctx.setTransform(DPR,0,0,DPR,0,0);
  // gentle trail fade for dreamy motion-blur quality
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='rgba(26,18,8,0.16)';
  ctx.fillRect(0,0,W,H);

  ctx.globalCompositeOperation='lighter';
  // draw far orbs first (parallax depth ordering)
  orbs.sort((a,b)=>a.depth-b.depth);
  for(const o of orbs) drawOrb(o,now);
  ctx.shadowBlur=0;
  ctx.globalCompositeOperation='source-over';

  step(now);
  requestAnimationFrame(frame);
}

if(reduced){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='lighter';
  orbs.sort((a,b)=>a.depth-b.depth);
  for(const o of orbs) drawOrb(o,0);
  ctx.globalCompositeOperation='source-over';
}else{
  requestAnimationFrame(frame);
}
