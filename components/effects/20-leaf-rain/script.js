// 20 Leaf Rain — autumn leaves fall, rotating and swaying, earthy palette.
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

const HUES=[18,24,34,42,95]; // rust,terra,clay,sand,moss
let wind=0, targetWind=0;
addEventListener('pointermove',e=>{targetWind=(e.clientX/W-0.5)*2.2;});

function makeLeaf(init){
  return {
    x:Math.random()*W, y:init?Math.random()*H:-20,
    r:rand(6,13), rot:rand(0,6.28), rotSpd:rand(-0.03,0.03),
    sway:rand(0,6.28), swaySpd:rand(0.01,0.03),
    vy:rand(0.4,1.1), hue:HUES[(Math.random()*HUES.length)|0]
  };
}
const leaves=Array.from({length:reduced?40:110},()=>makeLeaf(true));

function drawLeaf(l){
  ctx.save();
  ctx.translate(l.x,l.y);
  ctx.rotate(l.rot);
  ctx.beginPath();
  ctx.moveTo(0,-l.r);
  ctx.bezierCurveTo(l.r*0.9,-l.r*0.4, l.r*0.9,l.r*0.6, 0,l.r);
  ctx.bezierCurveTo(-l.r*0.9,l.r*0.6, -l.r*0.9,-l.r*0.4, 0,-l.r);
  ctx.fillStyle=`hsla(${l.hue},55%,45%,0.85)`;
  ctx.fill();
  ctx.strokeStyle=`hsla(${l.hue},40%,25%,0.6)`;
  ctx.lineWidth=0.8;
  ctx.beginPath();ctx.moveTo(0,-l.r);ctx.lineTo(0,l.r);ctx.stroke();
  ctx.restore();
}

function frame(){
  ctx.fillStyle='rgba(26,18,8,0.16)';
  ctx.fillRect(0,0,W,H);

  wind+=(targetWind-wind)*0.02;

  for(const l of leaves){
    if(!reduced){
      l.sway+=l.swaySpd;
      l.x+=Math.sin(l.sway)*1.1+wind*0.6;
      l.y+=l.vy;
      l.rot+=l.rotSpd+wind*0.01;
    }
    if(l.y>H+20){ Object.assign(l, makeLeaf(false)); }
    if(l.x<-20) l.x=W+20; if(l.x>W+20) l.x=-20;
    drawLeaf(l);
  }
  requestAnimationFrame(frame);
}
frame();
