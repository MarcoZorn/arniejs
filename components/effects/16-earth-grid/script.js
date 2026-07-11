// 16 Earth Grid — topographic TRON-style perspective grid, brown/amber, wave distortion.
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

let mx=-9999,my=-9999;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});
addEventListener('pointerleave',()=>{mx=my=-9999;});

const CELL=42;
function waveY(x,y,t){
  const base=Math.sin(x*0.02+t)*10+Math.cos(y*0.018-t*0.8)*10;
  let bump=0;
  if(mx>-900){
    const dx=x-mx, dy=y-my, d=Math.hypot(dx,dy);
    bump=Math.exp(-d*d/26000)*40*Math.sin(t*3-d*0.05);
  }
  return base+bump;
}

function frame(now){
  const t=reduced?0:now*0.0006;
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);

  const horizon=H*0.42;
  ctx.lineWidth=1;

  // horizontal lines with perspective + vertical wave offset
  const rows=18;
  for(let i=0;i<rows;i++){
    const f=i/rows;
    const y=horizon+f*f*(H-horizon);
    const alpha=0.15+f*0.55;
    ctx.strokeStyle=`rgba(196,98,45,${alpha})`;
    ctx.beginPath();
    for(let x=0;x<=W;x+=CELL){
      const wy=y+waveY(x,y,t)*f;
      if(x===0) ctx.moveTo(x,wy); else ctx.lineTo(x,wy);
    }
    ctx.stroke();
  }

  // vertical converging lines
  const cols=24;
  for(let i=0;i<=cols;i++){
    const nx=(i/cols-0.5)*2;
    ctx.strokeStyle='rgba(212,168,90,0.28)';
    ctx.beginPath();
    for(let r=0;r<=rows;r++){
      const f=r/rows;
      const y=horizon+f*f*(H-horizon);
      const spread=(W*0.55)*f+ (1-f)*4;
      const x=W/2+nx*spread;
      const wy=y+waveY(x,y,t)*f;
      if(r===0) ctx.moveTo(x,wy); else ctx.lineTo(x,wy);
    }
    ctx.stroke();
  }

  // horizon glow
  const g=ctx.createLinearGradient(0,horizon-60,0,horizon+20);
  g.addColorStop(0,'rgba(212,168,90,0.18)');
  g.addColorStop(1,'rgba(212,168,90,0)');
  ctx.fillStyle=g;
  ctx.fillRect(0,horizon-60,W,80);

  requestAnimationFrame(frame);
}
frame();
