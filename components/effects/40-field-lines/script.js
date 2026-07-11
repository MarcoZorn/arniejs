// 40 Field Lines — draggable warm-toned poles, magnetic-style field line streamlines redraw live.
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

const POS_COLOR='#c4622d'; // terracotta - positive
const NEG_COLOR='#5a7a3a'; // moss - negative
const LINE_COLORS=['#d4a85a','#c4622d','#a03820','#9b6b3a','#8fa86e'];

let poles = [
  {x:0,y:0, q:1, r:16},
  {x:0,y:0, q:-1, r:16},
  {x:0,y:0, q:1, r:16},
];

function layout(){
  poles[0].x=W*0.32; poles[0].y=H*0.45;
  poles[1].x=W*0.68; poles[1].y=H*0.45;
  poles[2].x=W*0.5;  poles[2].y=H*0.68;
}
layout();
addEventListener('resize', layout);

function fieldAt(x,y){
  let fx=0, fy=0;
  for(const p of poles){
    const dx=x-p.x, dy=y-p.y;
    let d2=dx*dx+dy*dy;
    if(d2<25) d2=25;
    const d=Math.sqrt(d2);
    const k=p.q/d2;
    fx += k*dx/d;
    fy += k*dy/d;
  }
  return [fx,fy];
}

function traceLine(sx,sy,dir){
  const pts=[[sx,sy]];
  let x=sx,y=sy;
  const step=6;
  const maxSteps=400;
  for(let i=0;i<maxSteps;i++){
    const [fx,fy]=fieldAt(x,y);
    const mag=Math.hypot(fx,fy)||0.0001;
    let vx=(fx/mag)*step*dir;
    let vy=(fy/mag)*step*dir;
    x+=vx; y+=vy;
    pts.push([x,y]);
    if(x<-50||x>W+50||y<-50||y>H+50) break;
    // stop if very close to any pole (sink) — but keep small margin
    let stuck=false;
    for(const p of poles){
      if(Math.hypot(x-p.x,y-p.y) < p.r*0.9){ stuck=true; break; }
    }
    if(stuck) break;
  }
  return pts;
}

function buildFieldLines(){
  const lines=[];
  const positives = poles.filter(p=>p.q>0);
  const N=14;
  for(const p of positives){
    for(let i=0;i<N;i++){
      const ang = (i/N)*Math.PI*2;
      const sx = p.x + Math.cos(ang)*(p.r+2);
      const sy = p.y + Math.sin(ang)*(p.r+2);
      lines.push(traceLine(sx,sy,1));
    }
  }
  return lines;
}

let dragging=null, dragOffX=0, dragOffY=0;

function poleAt(x,y){
  for(let i=poles.length-1;i>=0;i--){
    const p=poles[i];
    if(Math.hypot(x-p.x,y-p.y) < p.r+10) return p;
  }
  return null;
}

function pointerPos(e){
  const rect=cv.getBoundingClientRect();
  return [e.clientX-rect.left, e.clientY-rect.top];
}

cv.addEventListener('pointerdown', e=>{
  const [x,y]=pointerPos(e);
  const p=poleAt(x,y);
  if(p){
    dragging=p;
    dragOffX=p.x-x; dragOffY=p.y-y;
    cv.setPointerCapture(e.pointerId);
  }
});
cv.addEventListener('pointermove', e=>{
  if(!dragging) return;
  const [x,y]=pointerPos(e);
  dragging.x = Math.max(30,Math.min(W-30, x+dragOffX));
  dragging.y = Math.max(30,Math.min(H-30, y+dragOffY));
  if(reduced) render();
});
addEventListener('pointerup', ()=>{ dragging=null; });

// double click / long tap to flip polarity
cv.addEventListener('dblclick', e=>{
  const [x,y]=pointerPos(e);
  const p=poleAt(x,y);
  if(p) p.q *= -1;
  if(reduced) render();
});

function drawPole(p){
  const color = p.q>0 ? POS_COLOR : NEG_COLOR;
  const grad=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2.2);
  grad.addColorStop(0, color+'cc');
  grad.addColorStop(1, color+'00');
  ctx.beginPath();
  ctx.fillStyle=grad;
  ctx.arc(p.x,p.y,p.r*2.2,0,Math.PI*2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle=color;
  ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
  ctx.fill();
  ctx.strokeStyle='#f0e6d3';
  ctx.lineWidth=2;
  ctx.stroke();

  ctx.fillStyle='#f0e6d3';
  ctx.font='700 16px Syne, sans-serif';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(p.q>0?'+':'−', p.x, p.y+1);
}

let hue=0;
function render(){
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);

  const lines=buildFieldLines();
  ctx.lineWidth=1.3;
  ctx.lineCap='round';
  for(let i=0;i<lines.length;i++){
    const pts=lines[i];
    if(pts.length<2) continue;
    const color=LINE_COLORS[i%LINE_COLORS.length];
    ctx.beginPath();
    ctx.moveTo(pts[0][0],pts[0][1]);
    for(let j=1;j<pts.length;j++) ctx.lineTo(pts[j][0],pts[j][1]);
    ctx.strokeStyle=color;
    ctx.globalAlpha=0.55;
    ctx.stroke();
  }
  ctx.globalAlpha=1;

  for(const p of poles) drawPole(p);
}

function frame(){
  render();
  requestAnimationFrame(frame);
}

if(reduced){
  render();
} else {
  frame();
}
