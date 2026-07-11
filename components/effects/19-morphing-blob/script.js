// 19 Morphing Blob — organic clay blob shape morphing smoothly, breathing at screen center.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener('resize',resize);resize();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);

const POINTS=10;
const offsets=Array.from({length:POINTS},()=>({
  amp:rand(0.12,0.28), freq:rand(0.6,1.6), phase:rand(0,6.28)
}));

let mx=0.5,my=0.5;
addEventListener('pointermove',e=>{mx=e.clientX/W; my=e.clientY/H;});

function frame(now){
  const t=reduced?0:now*0.0007;
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);

  const cx=W/2+(mx-0.5)*W*0.08;
  const cy=H/2+(my-0.5)*H*0.08;
  const baseR=Math.min(W,H)*0.22;

  const pts=[];
  for(let i=0;i<POINTS;i++){
    const a=(i/POINTS)*6.2832;
    const o=offsets[i];
    const r=baseR*(1+Math.sin(t*o.freq+o.phase)*o.amp);
    pts.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]);
  }

  ctx.beginPath();
  for(let i=0;i<POINTS;i++){
    const p0=pts[i], p1=pts[(i+1)%POINTS];
    const mxp=(p0[0]+p1[0])/2, myp=(p0[1]+p1[1])/2;
    if(i===0) ctx.moveTo(mxp,myp);
    ctx.quadraticCurveTo(p1[0],p1[1], (p1[0]+pts[(i+2)%POINTS][0])/2, (p1[1]+pts[(i+2)%POINTS][1])/2);
  }
  ctx.closePath();

  const grd=ctx.createRadialGradient(cx-baseR*0.3,cy-baseR*0.3,baseR*0.1,cx,cy,baseR*1.3);
  grd.addColorStop(0,'#d4a85a');
  grd.addColorStop(0.45,'#c4622d');
  grd.addColorStop(0.8,'#9b6b3a');
  grd.addColorStop(1,'#5a3e20');
  ctx.fillStyle=grd;
  ctx.shadowColor='rgba(196,98,45,0.5)';
  ctx.shadowBlur=50;
  ctx.fill();
  ctx.shadowBlur=0;

  ctx.strokeStyle='rgba(240,230,211,0.15)';
  ctx.lineWidth=1.5;
  ctx.stroke();

  requestAnimationFrame(frame);
}
frame();
