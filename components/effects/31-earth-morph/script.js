// 31 Earth Morph — geometric shapes continuously morph into each other (circle -> triangle -> square -> hexagon -> circle)
// via interpolated polygon vertex positions. Terracotta gradient fill, smooth continuous loop. Click to shift palette.
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

const N=120; // sample count per outline, shared across all shapes for direct correspondence

// radius(theta) for a regular polygon with k sides, circumradius 1, so the boundary
// traces straight edges rather than vertex-only points. k=0 => perfect circle.
function polyRadius(theta,k,rot){
  if(k<=0) return 1;
  const t=theta-rot;
  const seg=(2*Math.PI)/k;
  const a=((t%seg)+seg)%seg - seg/2;
  return Math.cos(Math.PI/k)/Math.cos(a);
}

function buildShape(k,rot){
  const pts=[];
  for(let i=0;i<N;i++){
    const theta=(i/N)*Math.PI*2;
    const r=polyRadius(theta,k,rot);
    pts.push({x:Math.cos(theta)*r,y:Math.sin(theta)*r});
  }
  return pts;
}

// shape sequence: circle -> triangle -> square -> hexagon -> back to circle
const shapes=[
  {pts:buildShape(0,0),        color:[196,98,45]},   // circle    terracotta
  {pts:buildShape(3,-Math.PI/2), color:[160,56,32]},  // triangle  rust
  {pts:buildShape(4,Math.PI/4),  color:[155,107,58]}, // square    clay
  {pts:buildShape(6,0),          color:[212,168,90]}, // hexagon   sand
];
shapes.push(shapes[0]); // loop back to circle for a seamless cycle

const palettes=[
  [[196,98,45],[160,56,32],[155,107,58],[212,168,90],[196,98,45]],
  [[90,122,58],[143,168,110],[196,98,45],[155,107,58],[90,122,58]],
  [[212,168,90],[196,98,45],[160,56,32],[240,230,211],[212,168,90]],
];
let paletteIdx=0;
function applyPalette(idx){
  for(let i=0;i<shapes.length;i++) shapes[i].color=palettes[idx][i];
}
applyPalette(0);

cv.addEventListener('pointerdown',()=>{
  paletteIdx=(paletteIdx+1)%palettes.length;
  applyPalette(paletteIdx);
});

function easeInOutCubic(t){ return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
function lerp(a,b,t){ return a+(b-a)*t; }

let segIndex=0;      // index into shapes[] for the "from" shape
const segDuration=2600; // ms per morph segment
let segStart=performance.now();
let rotAngle=0;

function draw(now){
  const dt=now-segStart;
  let t=Math.min(dt/segDuration,1);
  const eased=easeInOutCubic(t);

  const from=shapes[segIndex];
  const to=shapes[(segIndex+1)%shapes.length];

  const cx=W/2, cy=H/2;
  const baseR=Math.min(W,H)*0.24;
  const bob=Math.sin(now*0.0006)*baseR*0.06;
  const R=baseR + bob;

  rotAngle += reduced?0:0.0011;

  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.clearRect(0,0,W,H);

  // subtle vignette backdrop already from CSS body gradient; add soft ambient glow
  const amb=ctx.createRadialGradient(cx,cy,R*0.2,cx,cy,R*2.4);
  amb.addColorStop(0,'rgba(196,98,45,0.10)');
  amb.addColorStop(1,'rgba(26,18,8,0)');
  ctx.fillStyle=amb;
  ctx.fillRect(0,0,W,H);

  const col=[
    lerp(from.color[0],to.color[0],eased),
    lerp(from.color[1],to.color[1],eased),
    lerp(from.color[2],to.color[2],eased),
  ];

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rotAngle);

  ctx.beginPath();
  for(let i=0;i<N;i++){
    const p0=from.pts[i], p1=to.pts[i];
    const x=lerp(p0.x,p1.x,eased)*R;
    const y=lerp(p0.y,p1.y,eased)*R;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();

  const grad=ctx.createRadialGradient(-R*0.3,-R*0.3,R*0.05,0,0,R*1.15);
  grad.addColorStop(0,`rgb(${Math.min(255,col[0]+60)},${Math.min(255,col[1]+45)},${Math.min(255,col[2]+30)})`);
  grad.addColorStop(0.55,`rgb(${col[0]},${col[1]},${col[2]})`);
  grad.addColorStop(1,`rgb(${Math.max(0,col[0]-60)},${Math.max(0,col[1]-40)},${Math.max(0,col[2]-25)})`);

  ctx.shadowColor=`rgba(${col[0]},${col[1]},${col[2]},0.55)`;
  ctx.shadowBlur=Math.min(60,R*0.35);
  ctx.fillStyle=grad;
  ctx.fill();
  ctx.shadowBlur=0;

  // inner rim highlight
  ctx.lineWidth=Math.max(1.5,R*0.012);
  ctx.strokeStyle='rgba(240,230,211,0.25)';
  ctx.stroke();

  ctx.restore();
}

function frame(now){
  draw(now);
  if(!reduced){
    if(now-segStart>=segDuration){
      segStart=now;
      segIndex=(segIndex+1)%(shapes.length-1);
    }
    requestAnimationFrame(frame);
  }
}

if(reduced){
  draw(performance.now());
}else{
  requestAnimationFrame(frame);
}
