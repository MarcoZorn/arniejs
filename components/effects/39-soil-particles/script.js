// 39 Soil Particles — text rendered as scattering earth/dust grains. Click/tap to explode, particles drift back and reform.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  buildParticles();
}
addEventListener('resize',resize);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);
const TEXT='ARNIE';

const EARTH=['#c4622d','#9b6b3a','#a03820','#d4a85a','#8fa86e','#5a7a3a','#f0e6d3'];

let particles=[];
let lastScatter=-99999;
let now=0;

function buildParticles(){
  const off=document.createElement('canvas');
  const scale=Math.min(2,DPR);
  const fontSize=Math.min(W*0.16,H*0.42);
  off.width=W*scale; off.height=H*scale;
  const octx=off.getContext('2d');
  octx.setTransform(scale,0,0,scale,0,0);
  octx.clearRect(0,0,W,H);
  octx.fillStyle='#fff';
  octx.font=`800 ${fontSize}px Syne, sans-serif`;
  octx.textAlign='center';
  octx.textBaseline='middle';
  octx.fillText(TEXT, W/2, H/2);

  const img=octx.getImageData(0,0,off.width,off.height).data;
  const step=Math.max(2,Math.floor(4*scale));
  const pts=[];
  for(let y=0;y<off.height;y+=step){
    for(let x=0;x<off.width;x+=step){
      const idx=(y*off.width+x)*4+3;
      if(img[idx]>128){
        pts.push({x:x/scale, y:y/scale});
      }
    }
  }
  // shuffle & cap count for perf
  for(let i=pts.length-1;i>0;i--){
    const j=(Math.random()*(i+1))|0;
    [pts[i],pts[j]]=[pts[j],pts[i]];
  }
  const MAX=2600;
  const chosen = pts.length>MAX ? pts.slice(0,MAX) : pts;

  particles = chosen.map(p=>{
    const c=EARTH[(Math.random()*EARTH.length)|0];
    return {
      hx:p.x, hy:p.y, // home
      x:p.x, y:p.y,
      vx:0, vy:0,
      r:rand(0.8,2.2),
      color:c,
      settled:true,
      jitter:rand(0,Math.PI*2)
    };
  });
}

function scatter(cx,cy){
  lastScatter=now;
  for(const p of particles){
    const dx=p.x-cx, dy=p.y-cy;
    const dist=Math.sqrt(dx*dx+dy*dy)+0.001;
    const force=rand(4,11) * (1/Math.max(1,dist*0.01));
    const ang=Math.atan2(dy,dx) + rand(-0.5,0.5);
    p.vx += Math.cos(ang)*force + rand(-2,2);
    p.vy += Math.sin(ang)*force - rand(0,3);
    p.settled=false;
  }
}

function pointerPos(e){
  const rect=cv.getBoundingClientRect();
  const cx = (e.touches? e.touches[0].clientX : e.clientX) - rect.left;
  const cy = (e.touches? e.touches[0].clientY : e.clientY) - rect.top;
  return [cx,cy];
}

cv.addEventListener('pointerdown', e=>{
  const [x,y]=pointerPos(e);
  scatter(x,y);
});

const FRICTION=0.94;
const RETURN_DELAY=1800; // ms after scatter before drifting home
const RETURN_STRENGTH=0.02;

function step(dt){
  now += dt;
  const canReturn = now-lastScatter > RETURN_DELAY;
  for(const p of particles){
    if(!p.settled){
      p.vx*=FRICTION; p.vy*=FRICTION;
      p.vy += 0.03; // gravity settle
      p.x+=p.vx*dt*0.06; p.y+=p.vy*dt*0.06;
      if(canReturn){
        const dx=p.hx-p.x, dy=p.hy-p.y;
        p.vx += dx*RETURN_STRENGTH*dt*0.01;
        p.vy += dy*RETURN_STRENGTH*dt*0.01;
        const dist=Math.hypot(dx,dy);
        if(dist<0.6 && Math.hypot(p.vx,p.vy)<0.3){
          p.x=p.hx; p.y=p.hy; p.vx=0; p.vy=0; p.settled=true;
        }
      }
    } else {
      // gentle idle drift
      p.jitter += dt*0.001;
      p.x = p.hx + Math.sin(p.jitter)*0.3;
      p.y = p.hy + Math.cos(p.jitter*1.3)*0.3;
    }
  }
}

function draw(){
  ctx.fillStyle='rgba(26,18,8,0.32)';
  ctx.fillRect(0,0,W,H);
  for(const p of particles){
    ctx.beginPath();
    ctx.fillStyle=p.color;
    ctx.globalAlpha=0.85;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha=1;
}

let lastT=performance.now();
function frame(t){
  const dt=Math.min(40,t-lastT);
  lastT=t;
  step(dt);
  draw();
  requestAnimationFrame(frame);
}

function drawStatic(){
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);
  for(const p of particles){
    ctx.beginPath();
    ctx.fillStyle=p.color;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }
}

resize();

if(reduced){
  drawStatic();
  cv.addEventListener('pointerdown', ()=>{ drawStatic(); });
} else {
  requestAnimationFrame(frame);
}
