// 21 Spiral Roots — root-system spiral growth pattern, self-drawing branches.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  buildRoots();
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);

let roots=[];
function makeBranch(cx,cy,startAngle,startLen,depth,hue){
  return {cx,cy,angle:startAngle,len:startLen,depth,
    turns:rand(1.6,3.2), grow:0, hue,
    growSpd:rand(0.006,0.014)*(reduced?4:1)};
}
function buildRoots(){
  roots=[];
  const cx=W/2, cy=H/2;
  const n=6;
  for(let i=0;i<n;i++){
    const a=(i/n)*6.2832;
    roots.push(makeBranch(cx,cy,a,Math.min(W,H)*0.42,0,20+i*8));
  }
}
addEventListener('resize',resize);
let mx=0.5,my=0.5;
addEventListener('pointermove',e=>{mx=e.clientX/W;my=e.clientY/H;});
buildRoots();

function frame(){
  ctx.fillStyle='rgba(26,18,8,0.05)';
  ctx.fillRect(0,0,W,H);

  const cx=W/2+(mx-0.5)*40, cy=H/2+(my-0.5)*40;

  for(const r of roots){
    if(r.grow<1) r.grow+=r.growSpd;
    const steps=60;
    ctx.beginPath();
    for(let s=0;s<=steps;s++){
      const f=(s/steps)*Math.min(r.grow,1);
      if(f<=0) continue;
      const spiralA=r.angle+f*r.turns*6.2832*0.35;
      const rad=f*r.len;
      const px=cx+Math.cos(spiralA)*rad;
      const py=cy+Math.sin(spiralA)*rad;
      if(s===0||f===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.strokeStyle=`hsla(${r.hue},45%,45%,0.7)`;
    ctx.lineWidth=2.2-r.depth*0.4;
    ctx.stroke();

    if(r.grow>=1 && r.depth<2 && Math.random()<0.003){
      const f=rand(0.4,0.85);
      const spiralA=r.angle+f*r.turns*6.2832*0.35;
      const rad=f*r.len;
      const bx=cx+Math.cos(spiralA)*rad, by=cy+Math.sin(spiralA)*rad;
      roots.push(makeBranch(bx,by,spiralA+rand(-1,1),r.len*0.5,r.depth+1,r.hue+rand(-8,8)));
    }
  }
  if(roots.length>140) roots.splice(0,roots.length-140);

  requestAnimationFrame(frame);
}
frame();
