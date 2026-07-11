// 07 Fireworks — auto-launch rockets, click to launch. 'lighter' glow, trail-fade background.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener('resize',resize);resize();

const G=0.045, rockets=[], sparks=[];
const rand=(a,b)=>a+Math.random()*(b-a);

function Rocket(tx,ty){
  this.x=tx+rand(-40,40); this.y=H;
  this.tx=tx; this.ty=ty;
  const dx=tx-this.x, dy=ty-this.y, d=Math.hypot(dx,dy);
  const sp=rand(9,12);
  this.vx=dx/d*sp; this.vy=dy/d*sp;
  this.hue=rand(0,360);
  this.trail=[];
}
Rocket.prototype.step=function(){
  this.trail.push([this.x,this.y]); if(this.trail.length>7)this.trail.shift();
  this.x+=this.vx; this.y+=this.vy; this.vy+=G;
  return this.vy>=-0.6 || this.y<=this.ty; // burst near apex/target
};

function burst(x,y,hue){
  const n=Math.floor(rand(60,120)), spd=rand(3,6);
  const multi=Math.random()<0.4;
  for(let i=0;i<n;i++){
    const a=Math.random()*6.2832, s=spd*Math.sqrt(Math.random());
    const h=multi?rand(0,360):hue+rand(-18,18);
    sparks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,
      life:1, decay:rand(0.006,0.016), hue:h, trail:[]});
  }
}

addEventListener('pointerdown',e=>rockets.push(new Rocket(e.clientX,e.clientY)));

let acc=0;
function frame(){
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='rgba(5,6,10,0.22)';
  ctx.fillRect(0,0,W,H);

  ctx.globalCompositeOperation='lighter';

  // auto-launch
  if(--acc<=0){ acc=rand(28,70); rockets.push(new Rocket(rand(W*0.15,W*0.85),rand(H*0.12,H*0.5))); }

  for(let i=rockets.length-1;i>=0;i--){
    const r=rockets[i];
    if(r.step()){ burst(r.x,r.y,r.hue); rockets.splice(i,1); continue; }
    for(let t=0;t<r.trail.length;t++){
      const p=r.trail[t], a=t/r.trail.length;
      ctx.beginPath();ctx.arc(p[0],p[1],1.6*a+0.4,0,6.2832);
      ctx.fillStyle=`hsla(${r.hue},90%,72%,${a*0.7})`;ctx.fill();
    }
    ctx.beginPath();ctx.arc(r.x,r.y,2.4,0,6.2832);
    ctx.fillStyle=`hsla(${r.hue},90%,85%,1)`;ctx.fill();
  }

  for(let i=sparks.length-1;i>=0;i--){
    const s=sparks[i];
    s.trail.push([s.x,s.y]); if(s.trail.length>5)s.trail.shift();
    s.x+=s.vx; s.y+=s.vy; s.vy+=G; s.vx*=0.985; s.vy*=0.985;
    s.life-=s.decay;
    if(s.life<=0){sparks.splice(i,1);continue;}
    const l=s.life;
    for(let t=0;t<s.trail.length;t++){
      const p=s.trail[t], a=(t/s.trail.length)*l;
      ctx.beginPath();ctx.arc(p[0],p[1],1.4*l+0.3,0,6.2832);
      ctx.fillStyle=`hsla(${s.hue},100%,${55+l*20}%,${a*0.5})`;ctx.fill();
    }
    ctx.beginPath();ctx.arc(s.x,s.y,1.7*l+0.4,0,6.2832);
    ctx.fillStyle=`hsla(${s.hue},100%,${60+l*25}%,${l})`;ctx.fill();
  }
  requestAnimationFrame(frame);
}
frame();
