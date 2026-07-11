// 41 Ink Earth — click to drop ink blobs that diffuse/swirl through warm clay-colored liquid and fade.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener('resize',resize);resize();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);

const INK_COLORS=['#a03820','#c4622d','#5a7a3a','#9b6b3a','#8fa86e'];

// Each "drop" is a cluster of soft particles that spread outward with curl-noise-ish swirl and slowly fade.
let drops=[];
let t=0;

function curl(x,y,time){
  // cheap pseudo curl-noise via layered sine fields, gives swirly drift without deps
  const s=0.004;
  const a = Math.sin(x*s + time*0.6) + Math.cos(y*s*1.3 - time*0.4);
  const b = Math.cos(x*s*1.4 - time*0.5) + Math.sin(y*s - time*0.7);
  return [a,b];
}

function spawnDrop(cx,cy){
  const color = INK_COLORS[(Math.random()*INK_COLORS.length)|0];
  const n = 90;
  const grains=[];
  for(let i=0;i<n;i++){
    const ang=rand(0,Math.PI*2);
    const rad=rand(0,6);
    grains.push({
      x:cx+Math.cos(ang)*rad, y:cy+Math.sin(ang)*rad,
      vx:Math.cos(ang)*rand(0.1,0.5), vy:Math.sin(ang)*rand(0.1,0.5),
      r:rand(6,16),
      life:1,
      seed:rand(0,1000)
    });
  }
  drops.push({grains, color, age:0, maxAge:rand(9000,14000)});
}

function pointerPos(e){
  const rect=cv.getBoundingClientRect();
  return [e.clientX-rect.left, e.clientY-rect.top];
}

cv.addEventListener('pointerdown', e=>{
  const [x,y]=pointerPos(e);
  spawnDrop(x,y);
  if(drops.length>14) drops.shift();
  if(reduced) drawStatic();
});

function step(dt){
  t += dt*0.001;
  for(const drop of drops){
    drop.age += dt;
    const progress = drop.age/drop.maxAge;
    drop.fade = Math.max(0, 1-progress);
    for(const g of drop.grains){
      const [cx,cy]=curl(g.x,g.y, t + g.seed*0.01);
      g.vx += cx*0.02;
      g.vy += cy*0.02;
      g.vx *= 0.985; g.vy *= 0.985;
      g.x += g.vx*dt*0.05;
      g.y += g.vy*dt*0.05;
      g.r += dt*0.0025; // slowly grows as it diffuses
    }
  }
  drops = drops.filter(d=>d.age < d.maxAge);
}

function draw(){
  // slow trail-fade so background reads as thick clay liquid
  ctx.fillStyle='rgba(26,18,8,0.06)';
  ctx.fillRect(0,0,W,H);

  ctx.globalCompositeOperation='lighten';
  for(const drop of drops){
    ctx.globalAlpha = 0.10 * drop.fade;
    for(const g of drop.grains){
      const grad=ctx.createRadialGradient(g.x,g.y,0,g.x,g.y,g.r);
      grad.addColorStop(0, drop.color);
      grad.addColorStop(1, drop.color+'00');
      ctx.beginPath();
      ctx.fillStyle=grad;
      ctx.arc(g.x,g.y,g.r,0,Math.PI*2);
      ctx.fill();
    }
  }
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation='source-over';
}

function paintBase(){
  const grad=ctx.createRadialGradient(W/2,H*0.4,0,W/2,H*0.4,Math.max(W,H)*0.8);
  grad.addColorStop(0,'#33200d');
  grad.addColorStop(1,'#1a1208');
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,W,H);
}

let lastT=performance.now();
function frame(now){
  const dt=Math.min(40, now-lastT);
  lastT=now;
  step(dt);
  draw();
  requestAnimationFrame(frame);
}

function drawStatic(){
  paintBase();
  ctx.globalCompositeOperation='lighten';
  for(const drop of drops){
    ctx.globalAlpha=0.5;
    for(const g of drop.grains){
      const grad=ctx.createRadialGradient(g.x,g.y,0,g.x,g.y,g.r);
      grad.addColorStop(0, drop.color);
      grad.addColorStop(1, drop.color+'00');
      ctx.beginPath();
      ctx.fillStyle=grad;
      ctx.arc(g.x,g.y,g.r,0,Math.PI*2);
      ctx.fill();
    }
  }
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation='source-over';
}

paintBase();

if(reduced){
  drawStatic();
} else {
  requestAnimationFrame(frame);
}
