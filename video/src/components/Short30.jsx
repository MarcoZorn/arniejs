import React from 'react';
import {AbsoluteFill, Img, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme.js';
import {fontFamily} from '../loadFont.js';
import {Sfx} from '../Sfx.jsx';

const NAME = 'ArnieJS';

export const SHORT_SEG = {
  logo: 30,
  grid: 90,
  terminal: 150,
  cta: 180,
};

function SegLogo() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 11}, durationInFrames: 8});
  const opacity = interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  const nameOpacity = interpolate(frame, [8, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', fontFamily}}>
      <Sfx name="pluck" from={0} volume={0.6} />
      <div style={{opacity, transform: `scale(${scale})`}}>
        <Img src={staticFile('assets/arnie.svg')} style={{width: 220, height: 220}} />
      </div>
      <div style={{marginTop: 26, fontSize: 76, fontWeight: 800, color: COLORS.cream, opacity: nameOpacity}}>
        {NAME} 🌱
      </div>
    </AbsoluteFill>
  );
}

const GRID_IMAGES = [
  {img: 'ui-bloom-button.jpg', name: 'Bloom Button'},
  {img: 'ui-blob-cursor.jpg', name: 'Blob Cursor'},
  {img: 'ui-product-card.jpg', name: 'Product Card'},
  {img: 'effects-sand-simulation.jpg', name: 'Sand Simulation'},
];

function SegGrid() {
  const frame = useCurrentFrame();
  const perItem = 22;
  const idx = Math.min(GRID_IMAGES.length - 1, Math.floor(frame / perItem));
  const itemLocal = frame - idx * perItem;
  const item = GRID_IMAGES[idx];

  const opacity = interpolate(itemLocal, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  const scale = interpolate(itemLocal, [0, 5], [1.08, 1], {extrapolateRight: 'clamp'});
  const textOpacity = interpolate(itemLocal, [5, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, alignItems: 'center', justifyContent: 'center'}}>
      {GRID_IMAGES.map((_, i) => (
        <Sfx key={i} name="click" from={i * perItem} volume={0.4} />
      ))}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          width: 860,
          borderRadius: 24,
          overflow: 'hidden',
          border: `2px solid ${COLORS.borderLight}`,
          boxShadow: '0 30px 80px -30px rgba(196,98,45,0.5)',
        }}
      >
        <Img src={staticFile(`assets/thumbnails/${item.img}`)} style={{width: '100%', display: 'block'}} />
      </div>
      <div
        style={{
          marginTop: 40,
          textAlign: 'center',
          fontSize: 56,
          fontWeight: 800,
          color: COLORS.cream,
          opacity: textOpacity,
        }}
      >
        {item.name}
      </div>
    </AbsoluteFill>
  );
}

const CMD = 'npx arniejs-cli add bloom-button';

function SegTerminal() {
  const frame = useCurrentFrame();
  const typeSpeed = 0.6;
  const chars = Math.max(0, Math.min(CMD.length, Math.floor(frame / typeSpeed)));
  const doneFrame = CMD.length * typeSpeed;
  const enterPressed = frame > doneFrame + 4;
  const successOpacity = interpolate(frame, [doneFrame + 6, doneFrame + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const browserStart = doneFrame + 30;
  const browserOpacity = interpolate(frame, [browserStart, browserStart + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bloomScale = interpolate(frame, [browserStart + 10, browserStart + 30], [0.9, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const typingClickFrames = [];
  for (let step = 4; step < CMD.length; step += 4) {
    typingClickFrames.push(Math.round(step * typeSpeed));
  }

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, alignItems: 'center', justifyContent: 'center', padding: 60}}>
      {typingClickFrames.map((f) => (
        <Sfx key={f} name="click" from={f} volume={0.22} />
      ))}
      <Sfx name="pop" from={Math.round(doneFrame) + 6} volume={0.4} />
      {browserOpacity < 1 && (
        <div
          style={{
            width: '100%',
            background: '#0c0804',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 18,
            padding: 34,
            fontFamily: 'monospace',
            fontSize: 30,
            color: COLORS.sage,
          }}
        >
          <div>
            <span style={{color: COLORS.terra}}>$</span> {CMD.slice(0, chars)}
            {!enterPressed && Math.floor(frame / 6) % 2 === 0 && <span style={{color: COLORS.sand}}>▍</span>}
          </div>
          {enterPressed && (
            <div style={{opacity: successOpacity, marginTop: 20, color: COLORS.cream}}>
              ✓ bloom-button copied. 3 files. No config.
            </div>
          )}
        </div>
      )}
      {browserOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            opacity: browserOpacity,
            transform: `scale(${bloomScale})`,
            padding: '26px 50px',
            borderRadius: 999,
            background: COLORS.terra,
            color: '#fff',
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          🌸 Let it bloom
        </div>
      )}
    </AbsoluteFill>
  );
}

function SegCTA() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 12}, durationInFrames: 10});
  const opacity = interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  const textOpacity = interpolate(frame, [14, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const starStart = 32;
  const starOpacity = interpolate(frame, [starStart, starStart + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin(Math.max(0, frame - starStart) / 9) * 0.05;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, alignItems: 'center', justifyContent: 'center'}}>
      <Sfx name="star" from={starStart} volume={0.55} />
      <div style={{opacity, transform: `scale(${scale})`}}>
        <Img src={staticFile('assets/arnie.svg')} style={{width: 200, height: 200}} />
      </div>
      <div style={{marginTop: 26, fontSize: 42, fontWeight: 700, color: COLORS.sand, opacity: textOpacity, textAlign: 'center'}}>
        marcozorn.github.io/arniejs
      </div>
      <div
        style={{
          marginTop: 30,
          padding: '18px 34px',
          borderRadius: 999,
          background: COLORS.terra,
          color: '#fff',
          fontSize: 32,
          fontWeight: 700,
          opacity: starOpacity,
          transform: `scale(${pulse})`,
        }}
      >
        ⭐ Star the garden
      </div>
    </AbsoluteFill>
  );
}

export const Short30 = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SHORT_SEG.logo}>
        <SegLogo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SHORT_SEG.grid}>
        <SegGrid />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SHORT_SEG.terminal}>
        <SegTerminal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SHORT_SEG.cta}>
        <SegCTA />
      </Series.Sequence>
    </Series>
  );
};
