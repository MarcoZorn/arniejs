// 12 Smoke Cursor — warm brown smoke trail follows the pointer, rises and dissipates.
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

let mx=W/2,my=H/2,px=mx,py=my,active=false;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;active=true;});
addEventListener('pointerleave',()=>active=false);
addEventListener('touchmove',e=>{
  const t=e.touches[0]; if(t){mx=t.clientX;my=t.clientY;active=true;}
},{passive:true});

const puffs=[];
const HUES=[18,24,30,36]; // terracotta/clay/sand/rust family

function spawn(x,y,speed){
  const n=reduced?1:Math.min(3,1+speed*0.15);
  for(let i=0;i<n;i++){
    puffs.push({
      x:x+rand(-6,6), y:y+rand(-6,6),
      vx:rand(-0.3,0.3), vy:rand(-0.9,-0.3),
      r:rand(10,22), life:1, decay:rand(0.006,0.012),
      hue:HUES[(Math.random()*HUES.length)|0]
    });
  }
}

function frame(){
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='rgba(26,18,8,0.10)';
  ctx.fillRect(0,0,W,H);

  if(active){
    const dist=Math.hypot(mx-px,my-py);
    spawn(mx,my,dist);
    px=mx;py=my;
  }

  ctx.globalCompositeOperation='lighter';
  for(let i=puffs.length-1;i>=0;i--){
    const p=puffs[i];
    p.x+=p.vx; p.y+=p.vy; p.vy-=0.004; p.vx*=0.99;
    p.r+=reduced?0.05:0.25;
    p.life-=p.decay;
    if(p.life<=0){puffs.splice(i,1);continue;}
    const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
    const l=p.life;
    g.addColorStop(0,`hsla(${p.hue},55%,${28+l*20}%,${l*0.5})`);
    g.addColorStop(1,`hsla(${p.hue},55%,${18+l*10}%,0)`);
    ctx.fillStyle=g;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.2832);ctx.fill();
  }
  requestAnimationFrame(frame);
}
frame();
