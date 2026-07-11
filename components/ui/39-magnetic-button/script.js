(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.magnet-btn');
  if (!btn || reduce) return;

  const label = btn.querySelector('.magnet-btn__label');
  const radius = 90; // px, how far outside the button the pull still activates
  const strength = 0.4;
  const labelStrength = 0.18;

  function handleMove(e) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const maxDist = Math.max(rect.width, rect.height) / 2 + radius;

    if (dist < maxDist) {
      const pull = 1 - dist / maxDist;
      btn.style.transform = `translate(${dx * strength * pull}px, ${dy * strength * pull}px)`;
      label.style.transform = `translate(${dx * labelStrength * pull}px, ${dy * labelStrength * pull}px)`;
    } else {
      btn.style.transform = '';
      label.style.transform = '';
    }
  }

  function reset() {
    btn.style.transform = '';
    label.style.transform = '';
  }

  window.addEventListener('pointermove', handleMove);
  btn.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
})();
