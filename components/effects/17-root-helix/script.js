// 17 Root Helix — organic double-helix, moss/clay strands with connecting rungs.
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

let mx=0.5;
addEventListener('pointermove',e=>{mx=e.clientX/W;});

const N=90;
function frame(now){
  const t=reduced?0:now*0.0009;
  ctx.fillStyle='rgba(26,18,8,0.14)';
  ctx.fillRect(0,0,W,H);

  const amp=Math.min(W,H)*0.16*(0.6+mx*0.8);
  const cx=W/2;
  const strandA=[], strandB=[];
  for(let i=0;i<N;i++){
    const f=i/(N-1);
    const y=f*H;
    const phase=f*10+t*2;
    const ax=cx+Math.sin(phase)*amp;
    const bx=cx+Math.sin(phase+Math.PI)*amp;
    const depth=(Math.sin(phase)+1)/2; // 0..1 for pseudo-depth
    strandA.push({x:ax,y,depth});
    strandB.push({x:bx,y,depth:1-depth});
  }

  // rungs
  for(let i=0;i<N;i+=4){
    const a=strandA[i], b=strandB[i];
    ctx.strokeStyle=`rgba(155,107,58,${0.25+0.25*a.depth})`;
    ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }

  function drawStrand(strand,hue){
    for(let i=0;i<strand.length-1;i++){
      const p=strand[i], q=strand[i+1];
      const bright=30+p.depth*35;
      ctx.strokeStyle=`hsla(${hue},45%,${bright}%,${0.5+p.depth*0.5})`;
      ctx.lineWidth=2.5+p.depth*2.5;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
    }
    for(let i=0;i<strand.length;i+=3){
      const p=strand[i];
      ctx.beginPath();
      ctx.fillStyle=`hsla(${hue},50%,${40+p.depth*30}%,0.9)`;
      ctx.arc(p.x,p.y,2+p.depth*2,0,6.2832);ctx.fill();
    }
  }
  drawStrand(strandA,95); // moss
  drawStrand(strandB,30); // clay

  requestAnimationFrame(frame);
}
frame();
