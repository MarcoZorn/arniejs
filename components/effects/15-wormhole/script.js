// 15 Wormhole — warm tunnel rings rushing toward a vanishing point at screen center.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR,cx,cy;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  cx=W/2;cy=H/2;
}
addEventListener('resize',resize);resize();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);

let tx=cx,ty=cy;
addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;});
addEventListener('pointerleave',()=>{tx=cx;ty=cy;});

const RING_COUNT=42;
const SEGMENTS=48;
const rings=[];
for(let i=0;i<RING_COUNT;i++){
  rings.push({
    z:i/RING_COUNT,
    wobA:rand(0,6.28), wobB:rand(0,6.28),
    hue:rand(16,42)
  });
}

let vx=cx,vy=cy;
function frame(){
  ctx.fillStyle='rgba(26,18,8,0.35)';
  ctx.fillRect(0,0,W,H);

  vx+=(tx-vx)*0.03; vy+=(ty-vy)*0.03;
  const speed=reduced?0.0009:0.003;

  for(const r of rings){
    r.z-=speed;
    if(r.z<=0) r.z+=1;
    const depth=r.z;
    const scale=1/depth;
    const maxR=Math.max(W,H)*0.75;
    const rad=maxR*(1-depth)*(1-depth)+6;
    const alpha=Math.min(1,(1-depth)*1.4)*0.9;
    ctx.beginPath();
    for(let s=0;s<=SEGMENTS;s++){
      const a=(s/SEGMENTS)*6.2832;
      const wob=Math.sin(a*3+r.wobA)*rad*0.03+Math.cos(a*2+r.wobB)*rad*0.02;
      const px=vx+Math.cos(a)*(rad+wob);
      const py=vy+Math.sin(a)*(rad+wob);
      if(s===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.strokeStyle=`hsla(${r.hue},65%,${30+alpha*35}%,${alpha})`;
    ctx.lineWidth=1.5+alpha*2.5;
    ctx.stroke();
  }

  // glow at vanishing point
  const g=ctx.createRadialGradient(vx,vy,0,vx,vy,40);
  g.addColorStop(0,'rgba(240,230,211,0.5)');
  g.addColorStop(1,'rgba(240,230,211,0)');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(vx,vy,40,0,6.2832);ctx.fill();

  requestAnimationFrame(frame);
}
frame();
