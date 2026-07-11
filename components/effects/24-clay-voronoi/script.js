// 24 Clay Voronoi — animated voronoi diagram with warm drifting seed points.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR,imgData,buf,buf32;
function resize(){
  DPR=1; // pixel-cost heavy, keep at 1x
  W=Math.floor(innerWidth/2); H=Math.floor(innerHeight/2);
  cv.width=innerWidth; cv.height=innerHeight;
  cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px';
  ctx.imageSmoothingEnabled=false;
  imgData=ctx.createImageData(W,H);
  buf32=new Uint32Array(imgData.data.buffer);
}
addEventListener('resize',resize);resize();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);

const PALETTE=[
  [196,98,45],[155,107,58],[212,168,90],[160,56,32],[90,122,58],[143,168,110]
];

const N=14;
const seeds=Array.from({length:N},(_,i)=>({
  x:Math.random()*W, y:Math.random()*H,
  vx:rand(-0.25,0.25), vy:rand(-0.25,0.25),
  col:PALETTE[i%PALETTE.length]
}));

let mx=-9999,my=-9999,active=false;
addEventListener('pointermove',e=>{mx=e.clientX/2;my=e.clientY/2;active=true;});
addEventListener('pointerleave',()=>active=false);

function packColor(r,g,b,a){
  return (a<<24)|(b<<16)|(g<<8)|r;
}

function frame(){
  for(const s of seeds){
    if(!reduced){
      s.x+=s.vx; s.y+=s.vy;
      if(s.x<0||s.x>W) s.vx*=-1;
      if(s.y<0||s.y>H) s.vy*=-1;
    }
  }
  const all=active?seeds.concat([{x:mx,y:my,col:[240,230,211]}]):seeds;

  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      let best=1e12, bi=0;
      for(let i=0;i<all.length;i++){
        const dx=all[i].x-x, dy=all[i].y-y;
        const d=dx*dx+dy*dy;
        if(d<best){best=d;bi=i;}
      }
      const [r,g,b]=all[bi].col;
      buf32[y*W+x]=packColor(r,g,b,255);
    }
  }
  imgData.data.set(new Uint8ClampedArray(buf32.buffer));
  ctx.putImageData(imgData,0,0);
  ctx.drawImage(cv,0,0,W,H,0,0,cv.width,cv.height);

  requestAnimationFrame(frame);
}
frame();
