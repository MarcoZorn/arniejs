// 37 Root Network — neural-network-style node graph in moss/clay tones.
// Nodes drift gently, connect to nearby neighbors, and animated pulses travel
// along the connection lines periodically. Mouse gently repels nearby nodes.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  initNodes();
}
addEventListener('resize',resize);

const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const rand=(a,b)=>a+Math.random()*(b-a);
const pick=arr=>arr[(Math.random()*arr.length)|0];
const nodePalette=['#5a7a3a','#8fa86e','#9b6b3a','#d4a85a'];
const lineColor='rgba(155,107,58,0.35)';
const pulsePalette=['#f0e6d3','#d4a85a','#c4622d'];

let mouse={x:-9999,y:-9999,active:false};
addEventListener('pointermove',e=>{ mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true; });
addEventListener('pointerleave',()=>{ mouse.active=false; });

let nodes=[];
const LINK_DIST=150;
const MAX_LINKS_PER_NODE=5;

function initNodes(){
  const count=Math.max(40, Math.min(90, Math.floor((W*H)/18000)));
  nodes=[];
  for(let i=0;i<count;i++){
    nodes.push({
      x: rand(0,W), y: rand(0,H),
      vx: rand(-0.15,0.15), vy: rand(-0.15,0.15),
      r: rand(2,4),
      hue: pick(nodePalette),
      phase: rand(0,Math.PI*2)
    });
  }
}
resize();

const pulses=[];
let pulseTimer=0;

function nearestLinks(){
  // build simple neighbor lists each frame (small N, fine for a visual effect)
  const links=[];
  for(let i=0;i<nodes.length;i++){
    const a=nodes[i];
    const cand=[];
    for(let j=0;j<nodes.length;j++){
      if(i===j) continue;
      const b=nodes[j];
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<LINK_DIST) cand.push({j,d});
    }
    cand.sort((p,q)=>p.d-q.d);
    for(const c of cand.slice(0,MAX_LINKS_PER_NODE)){
      if(i<c.j) links.push({a:i,b:c.j,d:c.d});
    }
  }
  return links;
}

function spawnPulse(links){
  if(!links.length) return;
  const l=pick(links);
  pulses.push({ a:l.a, b:l.b, t:0, speed: rand(0.012,0.024), hue: pick(pulsePalette) });
}

function frame(){
  ctx.clearRect(0,0,W,H);

  // update node positions
  for(const n of nodes){
    n.phase+=0.01;
    n.x += n.vx + Math.sin(n.phase)*0.02;
    n.y += n.vy + Math.cos(n.phase*0.8)*0.02;

    if(mouse.active){
      const dx=n.x-mouse.x, dy=n.y-mouse.y;
      const d=Math.hypot(dx,dy);
      if(d<110 && d>0.01){
        const f=(110-d)/110*0.6;
        n.x += (dx/d)*f;
        n.y += (dy/d)*f;
      }
    }

    if(n.x<0||n.x>W) n.vx*=-1;
    if(n.y<0||n.y>H) n.vy*=-1;
    n.x=Math.max(0,Math.min(W,n.x));
    n.y=Math.max(0,Math.min(H,n.y));
  }

  const links=nearestLinks();

  // draw links
  ctx.lineWidth=1;
  ctx.strokeStyle=lineColor;
  for(const l of links){
    const a=nodes[l.a], b=nodes[l.b];
    const alpha=Math.max(0,1-l.d/LINK_DIST);
    ctx.globalAlpha=alpha*0.5;
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();
  }
  ctx.globalAlpha=1;

  // spawn pulses periodically
  if(!reduced){
    pulseTimer-=1;
    if(pulseTimer<=0){
      spawnPulse(links);
      pulseTimer=18+Math.random()*24;
    }
  }

  // update + draw pulses
  ctx.globalCompositeOperation='lighter';
  for(let i=pulses.length-1;i>=0;i--){
    const p=pulses[i];
    p.t+=p.speed*(reduced?0:1);
    if(p.t>=1){ pulses.splice(i,1); continue; }
    const a=nodes[p.a], b=nodes[p.b];
    if(!a||!b) { pulses.splice(i,1); continue; }
    const x=a.x+(b.x-a.x)*p.t;
    const y=a.y+(b.y-a.y)*p.t;
    const fade=Math.sin(p.t*Math.PI);
    ctx.globalAlpha=fade;
    ctx.fillStyle=p.hue;
    ctx.beginPath();
    ctx.arc(x,y,3.2,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha=fade*0.35;
    ctx.beginPath();
    ctx.arc(x,y,7,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation='source-over';

  // draw nodes
  for(const n of nodes){
    const glow=0.6+Math.sin(n.phase*2)*0.2;
    ctx.globalAlpha=glow;
    ctx.fillStyle=n.hue;
    ctx.beginPath();
    ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha=1;

  if(!reduced) requestAnimationFrame(frame);
}

if(reduced){
  frame();
} else {
  frame();
}
