import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

// Frame lengths (at 30fps) padded slightly beyond each wav's real duration
// so trimmed playback never gets cut short by a too-tight Sequence window.
export const SFX_FRAMES = {
  pluck: 20,
  whoosh: 12,
  error: 10,
  click: 4,
  pop: 6,
  chime: 34,
  star: 8,
};

// One-shot sound effect. `from` is the frame (relative to the enclosing
// Sequence/composition) at which playback should start.
export const Sfx = ({name, from, volume = 0.5}) => {
  if (from < 0) return null;
  return (
    <Sequence from={from} durationInFrames={SFX_FRAMES[name]} layout="none">
      <Audio src={staticFile(`audio/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};
