// 23 Soil Automata — Conway's Game of Life rendered in earth tones, click/drag to paint.
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha:false });
const CELL = 14;
let W, H, DPR, cw, ch;
let grid, next, age, fade;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const STEP_MS = reduced ? 400 : 130;
let lastStep = 0;

function alloc(){
  const n=cw*ch;
  grid=new Uint8Array(n); next=new Uint8Array(n);
  age=new Uint16Array(n); fade=new Float32Array(n);
}
function seed(density=0.22){
  for(let i=0;i<grid.length;i++){
    grid[i]=Math.random()<density?1:0;
    age[i]=grid[i]; fade[i]=grid[i];
  }
}
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  canvas.width=W*DPR; canvas.height=H*DPR;
  canvas.style.width=W+'px'; canvas.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  cw=Math.ceil(W/CELL); ch=Math.ceil(H/CELL);
  alloc(); seed();
}
addEventListener('resize',resize);

function idx(x,y){ return ((y+ch)%ch)*cw + ((x+cw)%cw); }

function step(){
  for(let y=0;y<ch;y++){
    for(let x=0;x<cw;x++){
      let n=0;
      n+=grid[idx(x-1,y-1)]+grid[idx(x,y-1)]+grid[idx(x+1,y-1)];
      n+=grid[idx(x-1,y)]+grid[idx(x+1,y)];
      n+=grid[idx(x-1,y+1)]+grid[idx(x,y+1)]+grid[idx(x+1,y+1)];
      const i=y*cw+x;
      const alive=grid[i]?(n===2||n===3):(n===3);
      next[i]=alive?1:0;
      if(alive) age[i]=Math.min(age[i]+1,512); else age[i]=0;
    }
  }
  const t=grid; grid=next; next=t;
}

// earth heatmap: sprout(moss) -> clay -> sand -> rust(elder)
function color(a){
  const k=Math.min(a/60,1);
  let r,g,b;
  if(k<0.33){ const u=k/0.33; r=90+u*70; g=122+u*20; b=58-u*10; }
  else if(k<0.66){ const u=(k-0.33)/0.33; r=160+u*36; g=107-u*17; b=48+u*24; }
  else { const u=(k-0.66)/0.34; r=196-u*36; g=98-u*60; b=45-u*13; }
  return [r|0,g|0,b|0];
}

function render(){
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='lighter';
  const r=CELL*0.42;
  for(let y=0;y<ch;y++){
    for(let x=0;x<cw;x++){
      const i=y*cw+x;
      fade[i]+=((grid[i]?1:0)-fade[i])*0.18;
      const f=fade[i];
      if(f<0.02) continue;
      const [cr,cg,cb]=color(age[i]);
      const px=x*CELL+CELL/2, py=y*CELL+CELL/2;
      ctx.shadowColor=`rgba(${cr},${cg},${cb},0.8)`;
      ctx.shadowBlur=8*f;
      ctx.fillStyle=`rgba(${cr},${cg},${cb},${0.85*f})`;
      ctx.beginPath();
      ctx.arc(px,py,r*(0.5+0.5*f),0,6.2832);
      ctx.fill();
    }
  }
  ctx.shadowBlur=0;
  ctx.globalCompositeOperation='source-over';
}

function loop(t){
  if(t-lastStep>STEP_MS){ step(); lastStep=t; }
  render();
  requestAnimationFrame(loop);
}

let painting=false;
function paintAt(e){
  const x=(e.clientX/CELL)|0, y=(e.clientY/CELL)|0;
  for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
    const i=idx(x+dx,y+dy);
    grid[i]=1; age[i]=Math.max(age[i],1); fade[i]=1;
  }
}
canvas.addEventListener('pointerdown',e=>{painting=true;paintAt(e);});
addEventListener('pointermove',e=>{ if(painting) paintAt(e); });
addEventListener('pointerup',()=>painting=false);
addEventListener('keydown',e=>{ if(e.code==='Space'){ e.preventDefault(); seed(0.24); } });

resize();
requestAnimationFrame(loop);
