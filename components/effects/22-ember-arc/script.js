// 22 Ember Arc — warm ember lightning arcs jumping between pointer and random points.
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
const rand=(a,b)=>a+Math.random()*(b-a);

let mx=W/2,my=H/2;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});

const anchors=Array.from({length:6},()=>({x:Math.random()*W,y:Math.random()*H}));
addEventListener('resize',()=>{ for(const a of anchors){a.x=Math.random()*W;a.y=Math.random()*H;} });

function jaggedPath(x1,y1,x2,y2,segments,jitter){
  const pts=[[x1,y1]];
  for(let i=1;i<segments;i++){
    const f=i/segments;
    const bx=x1+(x2-x1)*f, by=y1+(y2-y1)*f;
    const nx=-(y2-y1), ny=(x2-x1);
    const nl=Math.hypot(nx,ny)||1;
    const off=rand(-jitter,jitter)*(1-Math.abs(f-0.5)*1.6);
    pts.push([bx+nx/nl*off, by+ny/nl*off]);
  }
  pts.push([x2,y2]);
  return pts;
}

function drawArc(x1,y1,x2,y2,hue,alpha,width){
  const pts=jaggedPath(x1,y1,x2,y2,10,18);
  ctx.beginPath();
  ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]);
  ctx.strokeStyle=`hsla(${hue},90%,60%,${alpha})`;
  ctx.lineWidth=width;
  ctx.shadowColor=`hsla(${hue},95%,55%,0.9)`;
  ctx.shadowBlur=14;
  ctx.stroke();
  ctx.shadowBlur=0;
}

let acc=0;
function frame(){
  ctx.fillStyle='rgba(26,18,8,0.22)';
  ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='lighter';

  if(!reduced){
    for(const a of anchors){
      a.x+=Math.sin(Date.now()*0.0003+a.y*0.01)*0.3;
      a.y+=Math.cos(Date.now()*0.0002+a.x*0.01)*0.3;
    }
  }

  // arcs between anchors
  for(let i=0;i<anchors.length;i++){
    const a=anchors[i], b=anchors[(i+1)%anchors.length];
    const hue=14+Math.random()*20; // ember: rust to sand
    if(Math.random()<(reduced?0.4:0.9)) drawArc(a.x,a.y,b.x,b.y,hue,rand(0.15,0.4),1.2);
  }

  // pointer arc bolts
  if(--acc<=0){
    acc=reduced?30:rand(6,16);
    const target=anchors[(Math.random()*anchors.length)|0];
    drawArc(mx,my,target.x,target.y,rand(14,30),rand(0.5,0.9),rand(1.5,3));
  }

  for(const a of anchors){
    ctx.beginPath();
    ctx.fillStyle='rgba(212,168,90,0.9)';
    ctx.arc(a.x,a.y,2.5,0,6.2832);ctx.fill();
  }
  ctx.beginPath();
  ctx.fillStyle='rgba(240,230,211,0.9)';
  ctx.arc(mx,my,3,0,6.2832);ctx.fill();

  ctx.globalCompositeOperation='source-over';
  requestAnimationFrame(frame);
}
frame();
