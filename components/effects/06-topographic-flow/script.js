// 06 Topographic Flow — marching-squares contour lines from value noise. Mouse warps field.
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener('resize',resize);resize();

// --- tiny value noise (3D: x,y,time) ---
function hash(x,y,z){
  let n=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;
  return n-Math.floor(n);
}
function smooth(t){return t*t*(3-2*t);}
function vnoise(x,y,z){
  const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z);
  const xf=x-xi,yf=y-yi,zf=z-zi;
  const u=smooth(xf),v=smooth(yf),w=smooth(zf);
  function lerp(a,b,t){return a+(b-a)*t;}
  const c=(dx,dy,dz)=>hash(xi+dx,yi+dy,zi+dz);
  const x00=lerp(c(0,0,0),c(1,0,0),u), x10=lerp(c(0,1,0),c(1,1,0),u);
  const x01=lerp(c(0,0,1),c(1,0,1),u), x11=lerp(c(0,1,1),c(1,1,1),u);
  return lerp(lerp(x00,x10,v),lerp(x01,x11,v),w);
}
function fbm(x,y,z){
  let a=0,amp=0.5,f=1;
  for(let i=0;i<3;i++){a+=vnoise(x*f,y*f,z)*amp;f*=2;amp*=0.5;}
  return a;
}

let mx=-999,my=-999;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});
addEventListener('pointerleave',()=>{mx=my=-999;});

const CELL=14;              // grid cell size in px
const SCALE=0.0032;         // noise spatial scale
let field=[], cols=0, rows=0;
function buildGrid(){cols=Math.ceil(W/CELL)+1;rows=Math.ceil(H/CELL)+1;field=new Float32Array(cols*rows);}
buildGrid();
addEventListener('resize',buildGrid);

function sample(gx,gy,t){
  const px=gx*CELL, py=gy*CELL;
  let warp=0;
  if(mx>-900){
    const dx=px-mx, dy=py-my, d2=dx*dx+dy*dy;
    warp=Math.exp(-d2/26000)*1.3;      // gaussian bump under cursor
  }
  return fbm(px*SCALE, py*SCALE, t) + warp;
}

// interpolate crossing point between two grid values
function ipt(x1,y1,v1,x2,y2,v2,iso){
  const t=(iso-v1)/(v2-v1);
  return [x1+(x2-x1)*t, y1+(y2-y1)*t];
}

const LEVELS=14;
function frame(now){
  const t=now*0.00013;
  ctx.fillStyle='#1a1208';ctx.fillRect(0,0,W,H);

  for(let gy=0;gy<rows;gy++)
    for(let gx=0;gx<cols;gx++)
      field[gy*cols+gx]=sample(gx,gy,t);

  for(let li=0;li<LEVELS;li++){
    const iso=0.16+li*(0.68/LEVELS);
    const hue=170+li*7;
    const bright=li/LEVELS;
    ctx.strokeStyle=`hsla(${hue},70%,${45+bright*30}%,${0.18+bright*0.5})`;
    ctx.lineWidth=iso>0.5?0.9:0.6;
    ctx.beginPath();
    for(let gy=0;gy<rows-1;gy++){
      for(let gx=0;gx<cols-1;gx++){
        const x=gx*CELL,y=gy*CELL;
        const tl=field[gy*cols+gx], tr=field[gy*cols+gx+1];
        const br=field[(gy+1)*cols+gx+1], bl=field[(gy+1)*cols+gx];
        let idx=0;
        if(tl>iso)idx|=8; if(tr>iso)idx|=4; if(br>iso)idx|=2; if(bl>iso)idx|=1;
        if(idx===0||idx===15)continue;
        const T=()=>ipt(x,y,tl,x+CELL,y,tr,iso);
        const Rr=()=>ipt(x+CELL,y,tr,x+CELL,y+CELL,br,iso);
        const B=()=>ipt(x,y+CELL,bl,x+CELL,y+CELL,br,iso);
        const L=()=>ipt(x,y,tl,x,y+CELL,bl,iso);
        let seg=[];
        switch(idx){
          case 1:case 14:seg=[L(),B()];break;
          case 2:case 13:seg=[B(),Rr()];break;
          case 3:case 12:seg=[L(),Rr()];break;
          case 4:case 11:seg=[T(),Rr()];break;
          case 6:case 9:seg=[T(),B()];break;
          case 7:case 8:seg=[L(),T()];break;
          case 5:seg=[L(),T(),B(),Rr()];break;
          case 10:seg=[L(),B(),T(),Rr()];break;
        }
        for(let s=0;s<seg.length;s+=2){
          ctx.moveTo(seg[s][0],seg[s][1]);
          ctx.lineTo(seg[s+1][0],seg[s+1][1]);
        }
      }
    }
    ctx.stroke();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
