// 35 Seed Scope — warm mirrored kaleidoscope. One wedge of evolving shapes/particles
// is drawn then rotated + mirrored around the center N times via canvas transforms.
// Mouse position/velocity feeds the wedge content (spawn rate, drift, hue).
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR,CX,CY;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  CX=W/2;CY=H/2;
}
addEventListener('resize',resize);resize();

const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SEGMENTS=10; // wedges around the circle
const segAngle=(Math.PI*2)/SEGMENTS;
const RADIUS=Math.hypot(innerWidth,innerHeight)*0.6;

const palette=['#c4622d','#5a7a3a','#8fa86e','#9b6b3a','#d4a85a','#a03820','#f0e6d3'];
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=arr=>arr[(Math.random()*arr.length)|0];

let mouse={x:innerWidth/2,y:innerHeight/2,px:innerWidth/2,py:innerHeight/2,vx:0,vy:0,active:false};
addEventListener('pointermove',e=>{
  mouse.px=mouse.x;mouse.py=mouse.y;
  mouse.x=e.clientX;mouse.y=e.clientY;
  mouse.vx=mouse.x-mouse.px;mouse.vy=mouse.y-mouse.py;
  mouse.active=true;
});
addEventListener('pointerdown',()=>{ burst(); });

// seeds live in wedge-local polar space: r in [0,RADIUS], a in [0,segAngle]
const seeds=[];
const MAX_SEEDS=140;

function spawnSeed(a,r,opts={}){
  seeds.push({
    a, r,
    va: rand(-0.006,0.006),
    vr: rand(0.15,0.6),
    size: rand(2,7),
    hue: pick(palette),
    life: 1,
    decay: rand(0.0025,0.008),
    wobble: rand(0,Math.PI*2),
    wspeed: rand(0.01,0.05),
    ...opts
  });
}

function burst(){
  for(let i=0;i<18;i++){
    spawnSeed(rand(0,segAngle), rand(20,80), {vr:rand(0.8,2.2), size:rand(3,9)});
  }
}

for(let i=0;i<40;i++) spawnSeed(rand(0,segAngle), rand(0,RADIUS));

let t=0;

function updateSeeds(dt){
  const mAngle=Math.atan2(mouse.y-CY, mouse.x-CX);
  const mDist=Math.hypot(mouse.x-CX,mouse.y-CY);
  const mSpeed=Math.hypot(mouse.vx,mouse.vy);

  // occasionally spawn based on mouse movement, mapped into wedge-local space
  if(mSpeed>1.2 && seeds.length<MAX_SEEDS && Math.random()<0.6){
    let localAngle=((mAngle%segAngle)+segAngle)%segAngle;
    spawnSeed(localAngle, Math.min(mDist,RADIUS), {
      vr: rand(0.4,1.4)+mSpeed*0.02,
      size: rand(3,8)
    });
  }

  for(let i=seeds.length-1;i>=0;i--){
    const s=seeds[i];
    s.a+=s.va*dt;
    s.r+=s.vr*dt;
    s.wobble+=s.wspeed*dt;
    s.life-=s.decay*dt;
    // gentle pull/push from mouse distance influences radial speed
    s.vr += Math.sin(t*0.001+s.wobble)*0.002*dt;
    if(s.life<=0 || s.r>RADIUS+40){
      seeds.splice(i,1);
    }
  }
  while(seeds.length<40) spawnSeed(rand(0,segAngle),0,{vr:rand(0.2,0.7)});
}

function drawWedgeContent(){
  // clip to the wedge triangle shape for a crisp segment edge
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.arc(0,0,RADIUS,0,segAngle);
  ctx.closePath();
  ctx.clip();

  for(const s of seeds){
    const x=Math.cos(s.a)*s.r;
    const y=Math.sin(s.a)*s.r;
    const wob=Math.sin(s.wobble)*3;
    const alpha=Math.max(0,Math.min(1,s.life));
    ctx.globalAlpha=alpha*0.85;
    ctx.fillStyle=s.hue;
    ctx.beginPath();
    ctx.arc(x+wob, y, s.size*(0.6+alpha*0.6), 0, Math.PI*2);
    ctx.fill();

    // connecting sliver toward center for extra pattern richness
    ctx.globalAlpha=alpha*0.18;
    ctx.strokeStyle=s.hue;
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(x,y);
    ctx.stroke();
  }
  ctx.globalAlpha=1;
  ctx.restore();
}

function frame(ts){
  t=ts||0;

  // trail fade
  ctx.fillStyle='rgba(26,18,8,0.16)';
  ctx.fillRect(0,0,W,H);

  updateSeeds(reduced?0:1.4);

  ctx.save();
  ctx.translate(CX,CY);
  ctx.globalCompositeOperation='lighter';

  for(let i=0;i<SEGMENTS;i++){
    ctx.save();
    ctx.rotate(i*segAngle);
    drawWedgeContent();
    ctx.restore();

    // mirrored reflection of the same wedge for true kaleidoscope symmetry
    ctx.save();
    ctx.rotate(i*segAngle);
    ctx.scale(1,-1);
    drawWedgeContent();
    ctx.restore();
  }

  ctx.restore();

  if(!reduced) requestAnimationFrame(frame);
}

if(reduced){
  // single static-ish frame, no continuous animation
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);
  frame(0);
} else {
  frame();
}
