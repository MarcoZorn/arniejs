// 18 Gravity Seeds — seeds fall under gravity and are attracted toward the pointer.
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

let grav={x:-9999,y:-9999,active:false};
addEventListener('pointermove',e=>{grav.x=e.clientX;grav.y=e.clientY;grav.active=true;});
addEventListener('pointerleave',()=>grav.active=false);
addEventListener('pointerdown',()=>grav.strong=true);
addEventListener('pointerup',()=>grav.strong=false);

const HUES=[24,30,90,42]; // terra, clay, moss, sand
const seeds=Array.from({length:reduced?90:220},()=>({
  x:Math.random()*W, y:Math.random()*H-H,
  vx:0, vy:rand(0.5,1.5), r:rand(1.6,3.4),
  hue:HUES[(Math.random()*HUES.length)|0]
}));

function frame(){
  ctx.fillStyle='rgba(26,18,8,0.16)';
  ctx.fillRect(0,0,W,H);

  for(const s of seeds){
    s.vy+=0.045; // downward gravity
    if(grav.active){
      const dx=grav.x-s.x, dy=grav.y-s.y, d=Math.hypot(dx,dy)+0.001;
      const f=(grav.strong?900:260)/(d*d)*d; // normalized-ish pull
      const pull=Math.min(grav.strong?0.9:0.35, f*0.02);
      s.vx+=(dx/d)*pull;
      s.vy+=(dy/d)*pull;
    }
    s.vx*=0.985; s.vy*=0.99;
    s.x+=s.vx; s.y+=s.vy;
    if(s.y>H+10){ s.y=-10; s.x=Math.random()*W; s.vx=0; s.vy=rand(0.5,1.5); }
    if(s.x<-10) s.x=W+10;
    if(s.x>W+10) s.x=-10;

    ctx.beginPath();
    ctx.fillStyle=`hsla(${s.hue},55%,55%,0.85)`;
    ctx.ellipse(s.x,s.y,s.r,s.r*1.6,Math.atan2(s.vy,s.vx),0,6.2832);
    ctx.fill();
  }

  if(grav.active){
    ctx.beginPath();
    ctx.strokeStyle='rgba(212,168,90,0.35)';
    ctx.lineWidth=1.5;
    ctx.arc(grav.x,grav.y,grav.strong?46:26,0,6.2832);
    ctx.stroke();
  }
  requestAnimationFrame(frame);
}
frame();
