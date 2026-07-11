import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme.js';
import {fontFamily} from '../loadFont.js';
import {Sfx} from '../Sfx.jsx';

const DEPS = [
  'react', 'react-dom', 'next', 'webpack', 'babel-core', 'eslint', 'postcss',
  'tailwindcss', 'framer-motion', 'lodash', 'axios', 'redux', 'redux-thunk',
  'styled-components', 'classnames', 'moment', 'uuid', 'prop-types', 'core-js',
  'regenerator-runtime', 'autoprefixer', 'jest', 'testing-library', 'typescript',
  'ts-node', 'nodemon', 'concurrently', 'cross-env', 'dotenv', 'express',
  'body-parser', 'cors', 'helmet', 'morgan', 'mongoose', 'sequelize', 'pg',
  'jsonwebtoken', 'bcrypt', 'multer', 'sharp', 'stripe', 'nodemailer',
  'socket.io', 'graphql', 'apollo-server', 'prisma', 'zod', 'yup',
];

function Flash({show}) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.terra,
        opacity: show,
        pointerEvents: 'none',
      }}
    />
  );
}

function CutA({localFrame}) {
  const headerOpacity = interpolate(localFrame, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  const visibleDeps = Math.min(DEPS.length, Math.floor(localFrame * 1.3));
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, padding: 80}}>
      <div style={{fontSize: 30, color: COLORS.cream, opacity: headerOpacity, marginBottom: 24, fontWeight: 700}}>
        The usual approach.
      </div>
      <div
        style={{
          background: '#0c0804',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: 28,
          height: 640,
          overflow: 'hidden',
          fontFamily: 'monospace',
          fontSize: 20,
          color: '#9ad19a',
        }}
      >
        <div style={{color: COLORS.faint, marginBottom: 10}}>package.json</div>
        <div style={{color: COLORS.cream}}>{'{'}</div>
        <div style={{color: COLORS.cream, paddingLeft: 20}}>&quot;dependencies&quot;: {'{'}</div>
        {DEPS.slice(0, visibleDeps).map((d, i) => (
          <div key={d} style={{paddingLeft: 40, color: '#9ad19a'}}>
            &quot;{d}&quot;: &quot;^{(1 + (i % 9))}.{i % 20}.{i % 7}&quot;,
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

const CUT_B_LINES = [
  '$ npm install',
  'npm WARN deprecated core-js@2.6.12',
  'npm WARN deprecated request@2.88.2',
  'added 340 packages in 12.4s',
  '',
  '$ npm run build',
];
const CUT_B_ERROR_FRAME = 28;

function CutB({localFrame}) {
  const visibleLines = Math.min(CUT_B_LINES.length, Math.floor(localFrame / 3));
  const errorShown = localFrame > CUT_B_ERROR_FRAME;
  const shakeX =
    errorShown && localFrame < CUT_B_ERROR_FRAME + 8 ? (Math.floor(localFrame / 2) % 2 === 0 ? -3 : 3) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, padding: 80, justifyContent: 'center'}}>
      <div
        style={{
          background: '#0c0804',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: 28,
          fontFamily: 'monospace',
          fontSize: 22,
          color: '#9ad19a',
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {CUT_B_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{color: line.startsWith('npm WARN') ? COLORS.sand : '#9ad19a', minHeight: 30}}>
            {line}
          </div>
        ))}
        {errorShown && (
          <div style={{color: '#ff6b6b', marginTop: 10, fontWeight: 700}}>
            npm ERR! peer dependency conflict
            <br />
            npm ERR! Fix the upstream dependency conflict, or retry
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

function CutC({localFrame}) {
  const opacity = interpolate(localFrame, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  const textOpacity = interpolate(localFrame, [12, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const SiteMock = ({label}) => (
    <div
      style={{
        width: 460,
        height: 460,
        background: '#0e0e12',
        border: '1px solid #262633',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{width: 120, height: 14, background: '#3a3a4a', borderRadius: 4}} />
      <div style={{width: '100%', height: 100, background: '#1a1a24', borderRadius: 10}} />
      <div style={{width: '80%', height: 12, background: '#2a2a38', borderRadius: 4}} />
      <div style={{width: '60%', height: 12, background: '#2a2a38', borderRadius: 4}} />
      <div
        style={{
          marginTop: 'auto',
          width: 140,
          height: 44,
          background: '#3b82f6',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
        }}
      >
        Get Started
      </div>
      <div style={{fontSize: 12, color: '#5a5a6a', marginTop: 8}}>{label}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', gap: 50, opacity}}>
        <SiteMock label="startup-x.com" />
        <SiteMock label="acme-app.io" />
      </div>
      <div style={{marginTop: 40, fontSize: 30, color: COLORS.cream, opacity: textOpacity, fontWeight: 700, textAlign: 'center'}}>
        Every AI generates the same frontend.
      </div>
    </AbsoluteFill>
  );
}

export const Scene2Problem = () => {
  const frame = useCurrentFrame();
  const CUT = 60;

  let cut = 0;
  let localFrame = frame;
  if (frame < CUT) {
    cut = 0;
    localFrame = frame;
  } else if (frame < CUT * 2) {
    cut = 1;
    localFrame = frame - CUT;
  } else {
    cut = 2;
    localFrame = frame - CUT * 2;
  }

  const flashNear = (boundary) => {
    const d = Math.abs(frame - boundary);
    return d < 5 ? interpolate(d, [0, 5], [0.65, 0]) : 0;
  };

  return (
    <AbsoluteFill>
      {cut === 0 && <CutA localFrame={localFrame} />}
      {cut === 1 && <CutB localFrame={localFrame} />}
      {cut === 2 && <CutC localFrame={localFrame} />}
      <Flash show={Math.max(flashNear(CUT), flashNear(CUT * 2))} />
      <Sfx name="whoosh" from={CUT - 2} volume={0.5} />
      <Sfx name="whoosh" from={CUT * 2 - 2} volume={0.5} />
      <Sfx name="error" from={CUT + CUT_B_ERROR_FRAME} volume={0.6} />
    </AbsoluteFill>
  );
};
