// 34 Hex Soil — hexagonal grid with wave ripples propagating outward from click (or auto-pulsing from center).
// Hexagons pulse in scale/brightness as the ripple wavefront passes through. Earthy clay/terracotta/sand tones.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  buildGrid();
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SIZE=30; // hex "radius" center-to-corner
let hexes=[];

function buildGrid(){
  hexes=[];
  const w=Math.sqrt(3)*SIZE;
  const h=SIZE*2;
  const vSpacing=h*0.75;
  const rows=Math.ceil(H/vSpacing)+2;
  const cols=Math.ceil(W/w)+2;
  for(let r=-1;r<rows;r++){
    for(let c=-1;c<cols;c++){
      const x=c*w + (r%2!==0 ? w/2 : 0);
      const y=r*vSpacing;
      hexes.push({x,y,base:Math.random()});
    }
  }
}
addEventListener('resize',resize);
resize();

const WAVE_SPEED=0.34;      // px per ms
const WAVE_WIDTH=140;       // wavefront thickness
const WAVE_LIFE=2600;       // ms until ripple fully fades

let ripples=[];
let lastClick=-99999;

function spawnRipple(x,y,t){
  ripples.push({x,y,t0:t});
  if(ripples.length>6) ripples.shift();
}

cv.addEventListener('pointerdown',e=>{
  const rect=cv.getBoundingClientRect();
  spawnRipple(e.clientX-rect.left, e.clientY-rect.top, performance.now());
  lastClick=performance.now();
});

const PALETTE_LOW=[90,60,34];    // dark soil clay
const PALETTE_HIGH=[240,230,211];// cream highlight
const PALETTE_MID=[196,98,45];   // terracotta

function hexPath(cx,cy,r){
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const ang=(Math.PI/180)*(60*i-90);
    const x=cx+r*Math.cos(ang);
    const y=cy+r*Math.sin(ang);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
}

function draw(now){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.fillStyle='#1a1208';
  ctx.fillRect(0,0,W,H);

  // auto-pulse from center if idle
  if(!reduced && now-lastClick>4200){
    spawnRipple(W/2,H/2,now);
    lastClick=now;
  }

  ripples=ripples.filter(rp=> now-rp.t0 < WAVE_LIFE);

  for(const hx of hexes){
    let energy=0;
    for(const rp of ripples){
      const age=now-rp.t0;
      const waveR=age*WAVE_SPEED;
      const d=Math.hypot(hx.x-rp.x,hx.y-rp.y);
      const diff=Math.abs(d-waveR);
      if(diff<WAVE_WIDTH){
        const front=1-diff/WAVE_WIDTH;
        const fade=1-age/WAVE_LIFE;
        energy=Math.max(energy, front*front*fade);
      }
    }
    if(reduced){
      // static gentle brightness variation, no animation
      energy=hx.base*0.25;
    }

    const t=Math.min(1,energy);
    const scale=1 + t*0.35;
    let r,g,b;
    if(t<0.5){
      const k=t*2;
      r=PALETTE_LOW[0]+(PALETTE_MID[0]-PALETTE_LOW[0])*k;
      g=PALETTE_LOW[1]+(PALETTE_MID[1]-PALETTE_LOW[1])*k;
      b=PALETTE_LOW[2]+(PALETTE_MID[2]-PALETTE_LOW[2])*k;
    }else{
      const k=(t-0.5)*2;
      r=PALETTE_MID[0]+(PALETTE_HIGH[0]-PALETTE_MID[0])*k;
      g=PALETTE_MID[1]+(PALETTE_HIGH[1]-PALETTE_MID[1])*k;
      b=PALETTE_MID[2]+(PALETTE_HIGH[2]-PALETTE_MID[2])*k;
    }

    hexPath(hx.x,hx.y,SIZE*0.92*scale);
    ctx.fillStyle=`rgb(${r|0},${g|0},${b|0})`;
    ctx.fill();
    ctx.strokeStyle=`rgba(26,18,8,${0.5+t*0.3})`;
    ctx.lineWidth=1.5;
    ctx.stroke();

    if(t>0.05){
      ctx.shadowColor=`rgba(${r|0},${g|0},${b|0},${t*0.6})`;
      ctx.shadowBlur=t*18;
      ctx.stroke();
      ctx.shadowBlur=0;
    }
  }
}

function frame(now){
  draw(now);
  requestAnimationFrame(frame);
}

if(reduced){
  draw(performance.now());
}else{
  requestAnimationFrame(frame);
}
