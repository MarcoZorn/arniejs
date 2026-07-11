// 26 Sand Simulation — falling-sand pixel toy, earthy grain colors, click/drag to pour.
const cv=document.getElementById('c'), ctx=cv.getContext('2d', { alpha:false });
let W,H,DPR,cols,rows,grid;
const PX=4;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);

const GRAINS=[
  [196,98,45],[155,107,58],[212,168,90],[160,56,32]
];

function resize(){
  DPR=1;
  W=innerWidth;H=innerHeight;
  cv.width=W;cv.height=H;
  cv.style.width=W+'px';cv.style.height=H+'px';
  cols=Math.ceil(W/PX); rows=Math.ceil(H/PX);
  grid=new Int16Array(cols*rows).fill(-1);
}
addEventListener('resize',resize);resize();

function idx(x,y){return y*cols+x;}

let pouring=false, px=0, py=0;
function toCell(e){ return [Math.floor(e.clientX/PX), Math.floor(e.clientY/PX)]; }
addEventListener('pointerdown',e=>{pouring=true;[px,py]=toCell(e);});
addEventListener('pointermove',e=>{[px,py]=toCell(e);});
addEventListener('pointerup',()=>pouring=false);
addEventListener('pointerleave',()=>pouring=false);

function pour(){
  if(!pouring) return;
  const n=reduced?2:5;
  for(let i=0;i<n;i++){
    const x=px+((Math.random()*5)|0)-2, y=py+((Math.random()*3)|0);
    if(x>=0&&x<cols&&y>=0&&y<rows && grid[idx(x,y)]===-1){
      grid[idx(x,y)]=(Math.random()*GRAINS.length)|0;
    }
  }
}

function step(){
  for(let y=rows-2;y>=0;y--){
    for(let x=0;x<cols;x++){
      const i=idx(x,y);
      if(grid[i]===-1) continue;
      const below=idx(x,y+1);
      if(grid[below]===-1){
        grid[below]=grid[i]; grid[i]=-1; continue;
      }
      const dir=Math.random()<0.5?-1:1;
      const bx1=x+dir, bx2=x-dir;
      if(bx1>=0&&bx1<cols&&grid[idx(bx1,y+1)]===-1){
        grid[idx(bx1,y+1)]=grid[i]; grid[i]=-1; continue;
      }
      if(bx2>=0&&bx2<cols&&grid[idx(bx2,y+1)]===-1){
        grid[idx(bx2,y+1)]=grid[i]; grid[i]=-1; continue;
      }
    }
  }
}

function render(){
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const g=grid[idx(x,y)];
      if(g===-1) continue;
      const [r,gg,b]=GRAINS[g];
      ctx.fillStyle=`rgb(${r},${gg},${b})`;
      ctx.fillRect(x*PX,y*PX,PX,PX);
    }
  }
}

let acc=0;
function frame(){
  pour();
  if(!reduced || (++acc%3===0)) step();
  render();
  requestAnimationFrame(frame);
}
frame();
