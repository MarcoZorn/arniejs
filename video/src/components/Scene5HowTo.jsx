import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme.js';
import {fontFamily} from '../loadFont.js';
import {Sfx} from '../Sfx.jsx';

const CMD = 'npx arniejs-cli add bloom-button';
const TYPE_SPEED = 0.85;

const FILES = [
  {
    name: 'index.html',
    code: '<link rel="stylesheet" href="style.css">\n<button class="bloom-btn">\n  Let it bloom\n</button>',
  },
  {
    name: 'style.css',
    code: '.bloom-btn {\n  background: var(--accent-terra);\n  border-radius: 999px;\n}',
  },
  {
    name: 'script.js',
    code: "(function () {\n  // bloom petals on hover\n})();",
  },
];

export const Scene5HowTo = () => {
  const frame = useCurrentFrame();

  const cmdChars = Math.max(0, Math.min(CMD.length, Math.floor(frame / TYPE_SPEED)));
  const cmdDoneFrame = CMD.length * TYPE_SPEED;
  const enterPressed = frame > cmdDoneFrame + 4;

  const typingClickFrames = [];
  for (let step = 4; step < CMD.length; step += 4) {
    typingClickFrames.push(Math.round(step * TYPE_SPEED));
  }

  const successStart = cmdDoneFrame + 8;
  const successLines = [
    '✓ bloom-button copied to ./arniejs/bloom-button/',
    '3 files. No config. Works anywhere.',
  ];

  const filesStart = successStart + 15;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, padding: '70px 90px', display: 'flex', flexDirection: 'row', gap: 50}}>
      {typingClickFrames.map((f) => (
        <Sfx key={f} name="click" from={f} volume={0.22} />
      ))}
      <Sfx name="pop" from={Math.round(successStart)} volume={0.45} />
      <div
        style={{
          flex: 1.1,
          background: '#0c0804',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 32,
          fontFamily: 'monospace',
          fontSize: 25,
          color: COLORS.sage,
          alignSelf: 'flex-start',
        }}
      >
        <div style={{display: 'flex', gap: 8, marginBottom: 22}}>
          <div style={{width: 14, height: 14, borderRadius: 7, background: '#e0645a'}} />
          <div style={{width: 14, height: 14, borderRadius: 7, background: COLORS.sand}} />
          <div style={{width: 14, height: 14, borderRadius: 7, background: COLORS.moss}} />
        </div>
        <div>
          <span style={{color: COLORS.terra}}>$</span> {CMD.slice(0, cmdChars)}
          {!enterPressed && Math.floor(frame / 6) % 2 === 0 && <span style={{color: COLORS.sand}}>▍</span>}
        </div>
        {enterPressed &&
          successLines.map((line, i) => {
            const start = successStart + i * 8;
            const op = interpolate(frame, [start, start + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={line} style={{opacity: op, marginTop: 14, color: i === 0 ? COLORS.sage : COLORS.cream}}>
                {line}
              </div>
            );
          })}
      </div>

      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center'}}>
        {FILES.map((f, i) => {
          const start = filesStart + i * 16;
          const op = interpolate(frame, [start, start + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const tx = interpolate(frame, [start, start + 8], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={f.name}
              style={{
                opacity: op,
                transform: `translateX(${tx}px)`,
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
                <div style={{color: COLORS.sand, fontSize: 20}}>✓</div>
                <div style={{color: COLORS.cream, fontSize: 22, fontWeight: 700}}>{f.name}</div>
              </div>
              <pre
                style={{
                  fontFamily: 'monospace',
                  fontSize: 15,
                  color: COLORS.faint,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {f.code}
              </pre>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
