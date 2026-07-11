import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme.js';
import {fontFamily} from '../loadFont.js';
import {Sfx} from '../Sfx.jsx';

const ITEMS = [
  {img: 'ui-tilt-cards.jpg', name: 'Tilt Cards', cat: 'Cards'},
  {img: 'ui-bloom-button.jpg', name: 'Bloom Button', cat: 'Buttons'},
  {img: 'ui-holographic-card.jpg', name: 'Holographic Card', cat: 'Cards'},
  {img: 'effects-sand-simulation.jpg', name: 'Sand Simulation', cat: 'Effects'},
];

const POSITIONS = [
  {top: 0, left: 0},
  {top: 0, left: 1},
  {top: 1, left: 0},
  {top: 1, left: 1},
];

function GridCell({item, pos, localFrame, cellIndex}) {
  const fillStart = cellIndex * 8;
  const holdEnd = 100;
  const emptyStart = holdEnd + cellIndex * 6;

  const fillOpacity = interpolate(localFrame, [fillStart, fillStart + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const emptyOpacity = interpolate(localFrame, [emptyStart, emptyStart + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fillOpacity, emptyOpacity);

  const slideX = interpolate(localFrame, [fillStart, fillStart + 8], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cellW = 620;
  const cellH = 400;
  const gap = 30;
  const gridW = cellW * 2 + gap;
  const gridH = cellH * 2 + gap;
  const originX = 1920 / 2 - gridW / 2;
  const originY = 1080 / 2 - gridH / 2;

  const x = originX + pos.left * (cellW + gap);
  const y = originY + pos.top * (cellH + gap);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: cellW,
        height: cellH,
        opacity,
        transform: `translateX(${slideX}px)`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: cellH - 60,
          borderRadius: 14,
          overflow: 'hidden',
          border: `1px solid ${COLORS.borderLight}`,
        }}
      >
        <Img src={staticFile(`assets/thumbnails/${item.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{color: COLORS.cream, fontSize: 26, fontWeight: 700, fontFamily}}>{item.name}</div>
        <div
          style={{
            fontSize: 14,
            color: COLORS.sand,
            background: COLORS.bgSubtle,
            padding: '4px 12px',
            borderRadius: 999,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {item.cat}
        </div>
      </div>
    </div>
  );
}

export const Scene4Showcase = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily}}>
      {ITEMS.map((_, i) => (
        <Sfx key={i} name="click" from={i * 8} volume={0.4} />
      ))}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 22,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: COLORS.faint,
          opacity: headerOpacity,
        }}
      >
        A few things growing in the garden
      </div>
      {ITEMS.map((item, i) => (
        <GridCell key={item.img} item={item} pos={POSITIONS[i]} localFrame={frame} cellIndex={i} />
      ))}
    </AbsoluteFill>
  );
};
