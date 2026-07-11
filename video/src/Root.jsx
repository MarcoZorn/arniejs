import React from 'react';
import {Composition, Series} from 'remotion';
import {Scene1Logo} from './components/Scene1Logo.jsx';
import {Scene2Problem} from './components/Scene2Problem.jsx';
import {Scene3Reveal} from './components/Scene3Reveal.jsx';
import {Scene4Showcase} from './components/Scene4Showcase.jsx';
import {Scene5HowTo} from './components/Scene5HowTo.jsx';
import {Scene6CTA} from './components/Scene6CTA.jsx';
import {Short30} from './components/Short30.jsx';
import {COLORS} from './theme.js';

export const SCENE_DURATIONS = {
  logo: 45,
  problem: 180,
  reveal: 150,
  showcase: 195,
  howto: 150,
  cta: 180,
};

const ArnieJSIntro = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.logo}>
        <Scene1Logo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.problem}>
        <Scene2Problem />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.reveal}>
        <Scene3Reveal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.showcase}>
        <Scene4Showcase />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.howto}>
        <Scene5HowTo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.cta}>
        <Scene6CTA />
      </Series.Sequence>
    </Series>
  );
};

const TOTAL_INTRO_FRAMES = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ArnieJSIntro"
        component={ArnieJSIntro}
        durationInFrames={TOTAL_INTRO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="ArnieJSShort"
        component={Short30}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};

export {COLORS};
