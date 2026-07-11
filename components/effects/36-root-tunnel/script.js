// 36 Root Tunnel — warm brown/amber starfield-warp. Particles + rings race from
// the vanishing point outward toward the viewer, accelerating with proximity.
// Trail via low-alpha fillRect clear; mouse steers the vanishing point.
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

const rand=(a,b)=>a+Math.random()*(b-a);
const pick=arr=>arr[(Math.random()*arr.length)|0];
const palette=['#c4622d','#9b6b3a','#d4a85a','#a03820','#f0e6d3','#5a7a3a'];

let target={x:CX,y:CY}, vp={x:CX,y:CY};
addEventListener('pointermove',e=>{ target.x=e.clientX; target.y=e.clientY; });
addEventListener('pointerleave',()=>{ target.x=innerWidth/2; target.y=innerHeight/2; });

const FOV=280;
const STAR_COUNT=260;
const stars=[];
function makeStar(freshZ){
  return {
    x: rand(-1,1)*W*0.9,
    y: rand(-1,1)*H*0.9,
    z: freshZ ? rand(FOV*0.5,FOV) : rand(1,FOV),
    pz: 0,
    hue: pick(palette),
    r: rand(1,2.6)
  };
}
for(let i=0;i<STAR_COUNT;i++) stars.push(makeStar(false));

// rings that expand and fade, evoking tunnel walls
const rings=[];
function spawnRing(){
  rings.push({ z: FOV, hue: pick(palette), life:1 });
}
let ringTimer=0;

function frame(ts){
  // trail fade — warmer, slightly transparent to keep amber glow trails
  ctx.fillStyle='rgba(26,18,8,0.28)';
  ctx.fillRect(0,0,W,H);

  vp.x += (target.x - vp.x)*0.06;
  vp.y += (target.y - vp.y)*0.06;

  ctx.save();
  ctx.translate(vp.x, vp.y);
  ctx.globalCompositeOperation='lighter';

  const speed = reduced?0:2.6;

  // stars
  for(const s of stars){
    s.pz=s.z;
    s.z -= speed;
    if(s.z<1){
      Object.assign(s, makeStar(true));
      s.pz=s.z;
    }
    const sx=(s.x/s.z)*FOV;
    const sy=(s.y/s.z)*FOV;
    const px=(s.x/s.pz)*FOV;
    const py=(s.y/s.pz)*FOV;

    const size=Math.max(0.4,(1-s.z/FOV)*s.r*4);
    const alpha=Math.min(1,(1-s.z/FOV)*1.4);

    ctx.strokeStyle=s.hue;
    ctx.globalAlpha=alpha;
    ctx.lineWidth=size;
    ctx.beginPath();
    ctx.moveTo(px,py);
    ctx.lineTo(sx,sy);
    ctx.stroke();

    ctx.globalAlpha=Math.min(1,alpha*1.3);
    ctx.fillStyle=s.hue;
    ctx.beginPath();
    ctx.arc(sx,sy,size*0.6,0,Math.PI*2);
    ctx.fill();
  }

  // rings
  ringTimer -= 1;
  if(ringTimer<=0 && !reduced){
    spawnRing();
    ringTimer=26;
  }
  for(let i=rings.length-1;i>=0;i--){
    const r=rings[i];
    r.z -= speed*1.1;
    r.life = r.z/FOV;
    if(r.z<4){ rings.splice(i,1); continue; }
    const radius=(1/r.z)*FOV*40;
    ctx.globalAlpha=Math.max(0,Math.min(0.5,1-r.life));
    ctx.strokeStyle=r.hue;
    ctx.lineWidth=Math.max(0.6,(1-r.life)*4);
    ctx.beginPath();
    ctx.arc(0,0,radius,0,Math.PI*2);
    ctx.stroke();
  }

  ctx.globalAlpha=1;
  ctx.restore();

  if(!reduced) requestAnimationFrame(frame);
}

if(reduced){
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);
  frame(0);
} else {
  frame();
}
