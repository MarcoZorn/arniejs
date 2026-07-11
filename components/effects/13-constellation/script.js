// 13 Constellation — amber stars drift, clay lines connect nearby stars.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  buildStars();
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);

let stars=[];
function buildStars(){
  const n=Math.floor((W*H)/16000);
  stars=Array.from({length:n},()=>({
    x:Math.random()*W, y:Math.random()*H,
    vx:rand(-0.08,0.08), vy:rand(-0.08,0.08),
    r:rand(0.8,2.2), tw:Math.random()*6.28, hue:rand(35,48)
  }));
}
addEventListener('resize',resize);resize();

let mx=-9999,my=-9999;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});
addEventListener('pointerleave',()=>{mx=my=-9999;});

const LINK=130;
function frame(){
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);

  for(const s of stars){
    if(!reduced){
      s.x+=s.vx; s.y+=s.vy; s.tw+=0.02;
      if(s.x<0)s.x=W; if(s.x>W)s.x=0;
      if(s.y<0)s.y=H; if(s.y>H)s.y=0;
    }
  }

  // connections
  ctx.lineWidth=1;
  for(let i=0;i<stars.length;i++){
    const a=stars[i];
    for(let j=i+1;j<stars.length;j++){
      const b=stars[j];
      const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
      if(d<LINK){
        const alpha=(1-d/LINK)*0.35;
        ctx.strokeStyle=`rgba(155,107,58,${alpha})`;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
    const dxm=a.x-mx, dym=a.y-my, dm=Math.hypot(dxm,dym);
    if(dm<160){
      ctx.strokeStyle=`rgba(212,168,90,${(1-dm/160)*0.6})`;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mx,my);ctx.stroke();
    }
  }

  for(const s of stars){
    const flick=reduced?0.85:0.65+Math.sin(s.tw)*0.35;
    ctx.beginPath();
    ctx.fillStyle=`hsla(${s.hue},70%,70%,${flick})`;
    ctx.arc(s.x,s.y,s.r,0,6.2832);ctx.fill();
  }
  requestAnimationFrame(frame);
}
frame();
