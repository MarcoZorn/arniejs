import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme.js';
import {fontFamily} from '../loadFont.js';
import {Sfx} from '../Sfx.jsx';

export const Scene6CTA = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const mascotScale = spring({frame, fps, config: {damping: 12}, durationInFrames: 12});
  const mascotOpacity = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});

  const sproutGrow = interpolate(frame, [4, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const line1Opacity = interpolate(frame, [20, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line2Opacity = interpolate(frame, [32, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const urlOpacity = interpolate(frame, [44, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const starStart = 60;
  const starOpacity = interpolate(frame, [starStart, starStart + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin(Math.max(0, frame - starStart) / 9) * 0.04;

  const quoteStart = 80;
  const quoteOpacity = interpolate(frame, [quoteStart, quoteStart + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, alignItems: 'center', justifyContent: 'center'}}>
      <Sfx name="pop" from={6} volume={0.45} />
      <Sfx name="star" from={starStart} volume={0.55} />
      <Sfx name="chime" from={quoteStart} volume={0.5} />
      <div style={{position: 'relative', opacity: mascotOpacity, transform: `scale(${mascotScale})`}}>
        <Img src={staticFile('assets/arnie.svg')} style={{
          width: 220,
          height: 220,
          translate: "0px 20px"
        }} />
        <div
          style={{
            position: 'absolute',
            bottom: -10,
            right: -10,
            fontSize: 56,
            transform: `scale(${sproutGrow}) translateY(${(1 - sproutGrow) * 20}px)`,
            transformOrigin: 'bottom',
          }}
        >
          🌱
        </div>
      </div>
      <div style={{marginTop: 34, textAlign: 'center'}}>
        <div style={{fontSize: 52, fontWeight: 800, color: COLORS.cream, opacity: line1Opacity}}>Stop installing.</div>
        <div style={{fontSize: 52, fontWeight: 800, color: COLORS.moss, opacity: line2Opacity, marginTop: 6}}>
          Start growing.
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 32,
            color: COLORS.sand,
            opacity: urlOpacity,
            textDecoration: 'underline',
            textUnderlineOffset: 8,
          }}
        >
          github.com/MarcoZorn/arniejs
        </div>

        <div
          style={{
            marginTop: 34,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 30px',
            borderRadius: 999,
            background: COLORS.terra,
            color: '#fff',
            fontSize: 26,
            fontWeight: 700,
            opacity: starOpacity,
            transform: `scale(${pulse})`,
          }}
        >
          ⭐ Star the garden
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: COLORS.faint,
            fontStyle: 'italic',
            opacity: quoteOpacity,
          }}
        >
          &ldquo;A good gardener never needs shortcuts.&rdquo;
        </div>
      </div>
    </AbsoluteFill>
  );
};
