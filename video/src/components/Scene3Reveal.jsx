import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme.js';
import {fontFamily} from '../loadFont.js';
import {Sfx} from '../Sfx.jsx';

const LINES = [
  {text: 'ArnieJS. 240+ components.', color: COLORS.cream, size: 46, weight: 800},
  {text: 'Zero dependencies.', color: COLORS.sand, size: 34, weight: 700},
  {text: 'Zero npm install. Just copy 3 files.', color: COLORS.sage, size: 34, weight: 700},
];

export const Scene3Reveal = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slideProgress = spring({frame, fps, config: {damping: 16}, durationInFrames: 24});
  const imgTranslateX = interpolate(slideProgress, [0, 1], [400, 0]);
  const imgOpacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  const mascotStart = 95;
  const mascotOpacity = interpolate(frame, [mascotStart, mascotStart + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mascotBounce = spring({frame: frame - mascotStart, fps, config: {damping: 8}, durationInFrames: 14});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, alignItems: 'center', justifyContent: 'center'}}>
      <Sfx name="whoosh" from={0} volume={0.5} />
      <Sfx name="pop" from={mascotStart} volume={0.5} />
      <div
        style={{
          position: 'relative',
          width: 1500,
          borderRadius: 20,
          overflow: 'hidden',
          border: `2px solid ${COLORS.borderLight}`,
          boxShadow: '0 40px 100px -40px rgba(196,98,45,0.5)',
          transform: `translateX(${imgTranslateX}px)`,
          opacity: imgOpacity,
        }}
      >
        <Img src={staticFile('assets/gallery-screenshot.jpg')} style={{width: '100%', display: 'block'}} />
      </div>

      <div style={{marginTop: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
        {LINES.map((l, i) => {
          const start = 26 + i * 18;
          const op = interpolate(frame, [start, start + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const ty = interpolate(frame, [start, start + 10], [-20, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={l.text}
              style={{
                opacity: op,
                transform: `translateY(${ty}px)`,
                fontSize: l.size,
                fontWeight: l.weight,
                color: l.color,
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 60,
          right: 90,
          opacity: mascotOpacity,
          transform: `scale(${mascotBounce}) rotate(-6deg)`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Img src={staticFile('assets/arnie.svg')} style={{width: 90, height: 90}} />
        <div style={{fontSize: 44}}>👍</div>
      </div>
    </AbsoluteFill>
  );
};
