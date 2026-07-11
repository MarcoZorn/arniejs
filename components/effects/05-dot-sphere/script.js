// 05 Dot Sphere — auto-rotates, drag to spin. Front dots brighter/larger. Cyan/violet glow.
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let W, H, DPR, R;
function resize(){
  DPR = Math.min(window.devicePixelRatio||1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W*DPR; cv.height = H*DPR;
  cv.style.width = W+'px'; cv.style.height = H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  R = Math.min(W,H)*0.34;
}
addEventListener('resize', resize); resize();

// Fibonacci sphere points
function makeSphere(n){
  const pts = [], gold = Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<n;i++){
    const y = 1 - (i/(n-1))*2;
    const r = Math.sqrt(1-y*y), t = gold*i;
    pts.push([Math.cos(t)*r, y, Math.sin(t)*r]);
  }
  return pts;
}
const outer = makeSphere(900);
const inner = makeSphere(220);

let rx=0.4, ry=0;
let drag=false, lx=0, ly=0, vx=0.0025, vy=0;

cv.addEventListener('pointerdown', e=>{drag=true;lx=e.clientX;ly=e.clientY;document.body.classList.add('drag');cv.setPointerCapture(e.pointerId);});
addEventListener('pointerup', ()=>{drag=false;document.body.classList.remove('drag');});
addEventListener('pointermove', e=>{
  if(!drag) return;
  const dx=e.clientX-lx, dy=e.clientY-ly; lx=e.clientX; ly=e.clientY;
  vy = dx*0.005; vx = dy*0.005;
});

function project(p, sinx,cosx,siny,cosy){
  let x = p[0]*cosy - p[2]*siny;
  let z = p[0]*siny + p[2]*cosy;
  let y = p[1]*cosx - z*sinx;
  z = p[1]*sinx + z*cosx;
  return [x,y,z];
}

function drawSet(pts, sinx,cosx,siny,cosy, hueA, hueB, baseSize){
  const cx=W/2, cy=H/2;
  const arr=[];
  for(const p of pts) arr.push(project(p, sinx,cosx,siny,cosy));
  arr.sort((a,b)=>a[2]-b[2]); // back to front
  for(const q of arr){
    const depth = (q[2]+1)/2;            // 0 back .. 1 front
    const persp = 1/(2.2 - q[2]);        // subtle perspective
    const sx = cx + q[0]*R*persp*2.2;
    const sy = cy + q[1]*R*persp*2.2;
    const sz = baseSize*(0.35 + depth*1.25)*persp*1.6;
    const hue = hueA + (hueB-hueA)*depth;
    const a = 0.12 + depth*0.88;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(sz,0.4), 0, 6.2832);
    ctx.fillStyle = `hsla(${hue},95%,${55+depth*15}%,${a})`;
    ctx.fill();
  }
}

function frame(){
  if(!drag){ vy += (0.0028-vy)*0.02; vx *= 0.96; }
  ry += vy; rx += vx; rx = Math.max(-1.4,Math.min(1.4,rx));
  const sinx=Math.sin(rx),cosx=Math.cos(rx),siny=Math.sin(ry),cosy=Math.cos(ry);

  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='rgba(5,6,10,1)';
  ctx.fillRect(0,0,W,H);

  // glow halo
  const g=ctx.createRadialGradient(W/2,H/2,R*0.2,W/2,H/2,R*2.4);
  g.addColorStop(0,'rgba(60,90,180,0.18)');
  g.addColorStop(1,'rgba(5,6,10,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  ctx.globalCompositeOperation='lighter';
  drawSet(inner, sinx,cosx,siny,cosy, 275, 300, 1.1); // violet inner
  drawSet(outer, sinx,cosx,siny,cosy, 190, 265, 1.7); // cyan->violet outer
  requestAnimationFrame(frame);
}
frame();
