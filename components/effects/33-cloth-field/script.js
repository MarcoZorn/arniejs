// 33 Cloth Field — verlet-integrated mass-spring cloth grid, pinned top row, gravity, mouse-draggable.
// Earthy clay/terracotta shaded polygons with sand grid lines.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  buildCloth();
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLS=26, ROWS=18;
const GRAVITY=0.32;
const DAMPING=0.985;
const ITER=4;
let spacing, originX, originY;
let points=[], constraints=[];

function buildCloth(){
  points=[]; constraints=[];
  const margin=Math.min(W,H)*0.08;
  spacing=Math.min((W-margin*2)/(COLS-1), (H-margin*2)/(ROWS-1)*1.15);
  const totalW=spacing*(COLS-1), totalH=spacing*(ROWS-1);
  originX=(W-totalW)/2;
  originY=Math.max(margin*0.6, (H-totalH)/2 - H*0.08);

  for(let j=0;j<ROWS;j++){
    for(let i=0;i<COLS;i++){
      const x=originX+i*spacing;
      const y=originY+j*spacing;
      points.push({
        x,y,ox:x,oy:y,
        pinned: j===0,
        px0:x, // home x for pinned rows
      });
    }
  }
  const idx=(i,j)=>j*COLS+i;
  for(let j=0;j<ROWS;j++){
    for(let i=0;i<COLS;i++){
      if(i<COLS-1) constraints.push({a:idx(i,j),b:idx(i+1,j),len:spacing});
      if(j<ROWS-1) constraints.push({a:idx(i,j),b:idx(i,j+1),len:spacing});
    }
  }
}
addEventListener('resize',resize);
resize();

// --- pointer dragging ---
let dragging=false, grabIdx=-1, px=0, py=0;
const GRAB_RADIUS=90;

function toLocal(e){
  const rect=cv.getBoundingClientRect();
  return {x:(e.clientX-rect.left), y:(e.clientY-rect.top)};
}

function findNearest(x,y){
  let best=-1, bestD=Infinity;
  for(let k=0;k<points.length;k++){
    const p=points[k];
    const d=(p.x-x)**2+(p.y-y)**2;
    if(d<bestD){bestD=d;best=k;}
  }
  return {idx:best, dist:Math.sqrt(bestD)};
}

cv.addEventListener('pointerdown',e=>{
  const {x,y}=toLocal(e);
  const {idx,dist}=findNearest(x,y);
  if(dist<GRAB_RADIUS*1.6){
    dragging=true; grabIdx=idx; px=x; py=y;
    cv.setPointerCapture(e.pointerId);
  }
});
cv.addEventListener('pointermove',e=>{
  const {x,y}=toLocal(e);
  if(dragging && grabIdx>=0){
    const dx=x-px, dy=y-py;
    for(const p of points){
      if(p.pinned) continue;
      const d=Math.hypot(p.x-px,p.y-py);
      if(d<GRAB_RADIUS){
        const f=1-d/GRAB_RADIUS;
        p.x+=dx*f; p.y+=dy*f;
      }
    }
    px=x; py=y;
  }
});
function release(){ dragging=false; grabIdx=-1; }
cv.addEventListener('pointerup',release);
cv.addEventListener('pointercancel',release);
cv.addEventListener('pointerleave',release);

function simulate(){
  for(const p of points){
    if(p.pinned) continue;
    const vx=(p.x-p.ox)*DAMPING;
    const vy=(p.y-p.oy)*DAMPING;
    p.ox=p.x; p.oy=p.y;
    p.x+=vx;
    p.y+=vy+GRAVITY;
  }
  for(let it=0;it<ITER;it++){
    for(const c of constraints){
      const a=points[c.a], b=points[c.b];
      let dx=b.x-a.x, dy=b.y-a.y;
      let dist=Math.hypot(dx,dy)||0.0001;
      const diff=(dist-c.len)/dist;
      const ax = a.pinned?0:0.5, bx=b.pinned?0:0.5;
      const moveX=dx*diff, moveY=dy*diff;
      if(!a.pinned){ a.x+=moveX*ax; a.y+=moveY*ax; }
      if(!b.pinned){ b.x-=moveX*bx; b.y-=moveY*bx; }
    }
    // keep pinned row fixed at its home position
    for(let i=0;i<COLS;i++){
      const p=points[i];
      p.x=p.ox=p.px0!==undefined?p.px0:p.x;
      p.y=originY;
    }
  }
}

function shadeFor(nx,ny){
  // pseudo-lighting from top-left using local slope approximation
  const light=Math.max(0.15, Math.min(1, 0.55 + nx*0.4 - ny*0.15));
  return light;
}

function draw(){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.clearRect(0,0,W,H);

  const idx=(i,j)=>j*COLS+i;
  // shaded polygons
  for(let j=0;j<ROWS-1;j++){
    for(let i=0;i<COLS-1;i++){
      const p0=points[idx(i,j)], p1=points[idx(i+1,j)], p2=points[idx(i+1,j+1)], p3=points[idx(i,j+1)];
      // approximate normal-ish shading via edge cross product
      const e1x=p1.x-p0.x, e1y=p1.y-p0.y;
      const e2x=p3.x-p0.x, e2y=p3.y-p0.y;
      const cross=e1x*e2y-e1y*e2x;
      const stretch=Math.hypot(e1x,e1y)/spacing;
      const light=Math.max(0.2,Math.min(1, 0.6 + (cross/(spacing*spacing))*0.4 - (stretch-1)*0.6));

      const cA=[155,107,58];   // clay
      const cB=[212,168,90];   // sand
      const t=light;
      const r=cA[0]+(cB[0]-cA[0])*t;
      const g=cA[1]+(cB[1]-cA[1])*t;
      const b=cA[2]+(cB[2]-cA[2])*t;

      ctx.beginPath();
      ctx.moveTo(p0.x,p0.y);
      ctx.lineTo(p1.x,p1.y);
      ctx.lineTo(p2.x,p2.y);
      ctx.lineTo(p3.x,p3.y);
      ctx.closePath();
      ctx.fillStyle=`rgb(${r|0},${g|0},${b|0})`;
      ctx.fill();
    }
  }

  // grid lines — terracotta/rust threads
  ctx.strokeStyle='rgba(196,98,45,0.35)';
  ctx.lineWidth=1;
  for(let j=0;j<ROWS;j++){
    ctx.beginPath();
    for(let i=0;i<COLS;i++){
      const p=points[idx(i,j)];
      if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
    }
    ctx.stroke();
  }
  for(let i=0;i<COLS;i++){
    ctx.beginPath();
    for(let j=0;j<ROWS;j++){
      const p=points[idx(i,j)];
      if(j===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
    }
    ctx.stroke();
  }

  // pin markers
  ctx.fillStyle='rgba(240,230,211,0.55)';
  for(let i=0;i<COLS;i++){
    const p=points[idx(i,0)];
    ctx.beginPath();
    ctx.arc(p.x,p.y,3,0,Math.PI*2);
    ctx.fill();
  }
}

function frame(){
  simulate();
  draw();
  requestAnimationFrame(frame);
}

if(reduced){
  draw();
}else{
  requestAnimationFrame(frame);
}
