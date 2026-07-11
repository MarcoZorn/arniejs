// 25 Lissajous — sand-toned lissajous curves with slowly sweeping frequency ratios.
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

let mx=0.5,my=0.5;
addEventListener('pointermove',e=>{mx=e.clientX/W; my=e.clientY/H;});

const CURVES=4;
const POINTS=900;

function frame(now){
  const t=reduced?0:now*0.00005;
  ctx.fillStyle='rgba(26,18,8,0.08)';
  ctx.fillRect(0,0,W,H);

  const R=Math.min(W,H)*0.36;
  for(let c=0;c<CURVES;c++){
    const a=3+c+Math.sin(t*0.7+c)*1.2 + (mx-0.5)*2;
    const b=2+c*1.3+Math.cos(t*0.5+c)*1.1 + (my-0.5)*2;
    const delta=t*2+c*1.1;
    const hue=32+c*6;
    ctx.beginPath();
    for(let i=0;i<=POINTS;i++){
      const th=(i/POINTS)*6.2832;
      const x=cx+Math.sin(a*th+delta)*R;
      const y=cy+Math.sin(b*th)*R;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=`hsla(${hue},60%,${55+c*4}%,${0.5-c*0.08})`;
    ctx.lineWidth=1.4;
    ctx.stroke();
  }
  requestAnimationFrame(frame);
}
frame();
