// 38 Solar Roots — amber orbiting particles around a glowing center. Elliptical
// orbits at varying radii/speeds, low-alpha fillRect trails, 'lighter' glow.
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
const palette=['#c4622d','#d4a85a','#9b6b3a','#a03820','#f0e6d3','#8fa86e'];

let mouse={x:innerWidth/2,y:innerHeight/2};
addEventListener('pointermove',e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });

const PARTICLE_COUNT=70;
const particles=[];
for(let i=0;i<PARTICLE_COUNT;i++){
  const rx=rand(40,Math.min(innerWidth,innerHeight)*0.46);
  particles.push({
    rx,
    ry: rx*rand(0.4,1),
    angle: rand(0,Math.PI*2),
    speed: rand(0.002,0.012) * (Math.random()<0.5?1:-1),
    tilt: rand(0,Math.PI),
    size: rand(1.2,3.6),
    hue: pick(palette),
    wobble: rand(0,Math.PI*2)
  });
}

function frame(){
  // low-alpha fill for motion trails
  ctx.fillStyle='rgba(26,18,8,0.12)';
  ctx.fillRect(0,0,W,H);

  const dx=(mouse.x-CX)*0.0006;
  const dy=(mouse.y-CY)*0.0006;

  ctx.save();
  ctx.translate(CX,CY);
  ctx.globalCompositeOperation='lighter';

  // glowing core
  const pulse=0.7+Math.sin(Date.now()*0.002)*0.15;
  const grad=ctx.createRadialGradient(0,0,0,0,0,60*pulse);
  grad.addColorStop(0,'rgba(240,230,211,0.9)');
  grad.addColorStop(0.4,'rgba(212,168,90,0.5)');
  grad.addColorStop(1,'rgba(212,168,90,0)');
  ctx.fillStyle=grad;
  ctx.beginPath();
  ctx.arc(0,0,60*pulse,0,Math.PI*2);
  ctx.fill();

  for(const p of particles){
    if(!reduced) p.angle += p.speed;
    p.wobble += 0.02;

    const ex=Math.cos(p.angle)*p.rx;
    const ey=Math.sin(p.angle)*p.ry;

    // apply tilt rotation to give varied elliptical orientations
    const cosT=Math.cos(p.tilt), sinT=Math.sin(p.tilt);
    const x=ex*cosT - ey*sinT + dx*p.rx;
    const y=ex*sinT + ey*cosT + dy*p.ry;

    const depth=(Math.sin(p.angle+p.tilt)+1)/2; // faux depth for size/alpha
    const size=p.size*(0.6+depth*0.8);
    const alpha=0.4+depth*0.6;

    ctx.globalAlpha=alpha;
    ctx.fillStyle=p.hue;
    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fill();

    ctx.globalAlpha=alpha*0.3;
    ctx.beginPath();
    ctx.arc(x,y,size*2.4,0,Math.PI*2);
    ctx.fill();
  }

  ctx.globalAlpha=1;
  ctx.restore();

  if(!reduced) requestAnimationFrame(frame);
}

if(reduced){
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);
  frame();
} else {
  frame();
}
