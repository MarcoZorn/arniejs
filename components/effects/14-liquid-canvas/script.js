// 14 Liquid Canvas — clay/mud metaballs, mouse-reactive, additive gradients.
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

const palette=[[196,98,45],[155,107,58],[212,168,90],[160,56,32]]; // terra/clay/sand/rust

const mouse={x:W/2,y:H/2,active:false};
addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;});
addEventListener('pointerleave',()=>mouse.active=false);

class Blob{
  constructor(){this.reset(true);}
  reset(init){
    this.x=Math.random()*W;
    this.y=init?Math.random()*H:(Math.random()<.5?-80:H+80);
    this.r=40+Math.random()*70;
    this.vx=(Math.random()-.5)*.4;
    this.vy=(Math.random()-.5)*.4;
    this.col=palette[(Math.random()*palette.length)|0];
    this.phase=Math.random()*6.28;
  }
  step(){
    this.phase+=reduced?0:0.008;
    const rr=this.r+Math.sin(this.phase)*8;
    if(mouse.active && !reduced){
      const dx=mouse.x-this.x, dy=mouse.y-this.y;
      const d=Math.hypot(dx,dy)+.001;
      const f=Math.min(50/d,0.1);
      this.vx+=(dx/d)*f;
      this.vy+=(dy/d)*f;
    }
    this.vx*=0.96; this.vy*=0.96;
    if(!reduced){ this.x+=this.vx; this.y+=this.vy; }
    if(this.x<-120)this.x=W+120; if(this.x>W+120)this.x=-120;
    if(this.y<-120)this.y=H+120; if(this.y>H+120)this.y=-120;
    this.drawR=rr;
  }
  draw(ctx){
    const [r,g,b]=this.col;
    const grd=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.drawR);
    grd.addColorStop(0,`rgba(${r},${g},${b},0.9)`);
    grd.addColorStop(0.7,`rgba(${r},${g},${b},0.75)`);
    grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.arc(this.x,this.y,this.drawR,0,6.2832);ctx.fill();
  }
}

const blobs=Array.from({length:11},()=>new Blob());
const mBlob=new Blob(); mBlob.r=55; mBlob.col=[212,168,90];

function frame(t){
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);
  ctx.filter='blur(14px) contrast(28)';
  ctx.globalCompositeOperation='lighter';
  for(const bl of blobs){bl.step();bl.draw(ctx);}
  if(mouse.active){
    mBlob.x+=(mouse.x-mBlob.x)*0.2;
    mBlob.y+=(mouse.y-mBlob.y)*0.2;
    mBlob.drawR=55+Math.sin(t*0.003)*10;
    mBlob.draw(ctx);
  }
  ctx.filter='none';
  ctx.globalCompositeOperation='source-over';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
