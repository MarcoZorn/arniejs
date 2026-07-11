import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme.js';
import {fontFamily} from '../loadFont.js';
import {Sfx} from '../Sfx.jsx';

const NAME = 'ArnieJS';

export const Scene1Logo = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const mascotScale = spring({
    frame,
    fps,
    config: {damping: 12, mass: 0.4},
    from: 0.5,
    to: 1,
    durationInFrames: 9,
  });
  const mascotOpacity = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});

  const typeStart = 5;
  const typeSpeed = 0.9; // frames per character
  const visibleChars = Math.max(0, Math.min(NAME.length, Math.floor((frame - typeStart) / typeSpeed)));
  const typeEndFrame = typeStart + NAME.length * typeSpeed;
  const cursorOn = frame < typeEndFrame + 8 && Math.floor(frame / 4) % 2 === 0;

  const typingDone = frame > typeEndFrame;
  const sproutOpacity = interpolate(frame, [typeEndFrame, typeEndFrame + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sproutScale = spring({
    frame: frame - typeEndFrame,
    fps,
    config: {damping: 9},
    durationInFrames: 6,
  });

  const taglineStart = typeEndFrame + 7;
  const taglineOpacity = interpolate(frame, [taglineStart, taglineStart + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', fontFamily}}>
      <Sfx name="pluck" from={0} volume={0.7} />
      <Sfx name="pop" from={Math.round(typeEndFrame)} volume={0.5} />

      <div
        style={{
          opacity: mascotOpacity,
          transform: `scale(${mascotScale})`,
        }}
      >
        <Img src={staticFile('assets/arnie.svg')} style={{width: 180, height: 180}} />
      </div>

      <div style={{height: 24}} />

      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: COLORS.cream,
            letterSpacing: -1,
          }}
        >
          {NAME.slice(0, visibleChars)}
          <span style={{opacity: cursorOn ? 1 : 0, color: COLORS.terra}}>|</span>
        </div>
        {typingDone && (
          <div style={{fontSize: 64, opacity: sproutOpacity, transform: `scale(${sproutScale})`}}>🌱</div>
        )}
      </div>

      <div
        style={{
          marginTop: 18,
          fontSize: 30,
          color: COLORS.sand,
          opacity: taglineOpacity,
          fontWeight: 600,
        }}
      >
        Grown from scratch.
      </div>
    </AbsoluteFill>
  );
};
