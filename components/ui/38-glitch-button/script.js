(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.glitch-btn');
  if (!btn || reduce) return;

  // Touch devices have no hover; tap triggers a brief glitch burst instead.
  btn.addEventListener('touchstart', () => {
    btn.classList.add('is-glitching');
    window.clearTimeout(btn._glitchTimer);
    btn._glitchTimer = window.setTimeout(() => {
      btn.classList.remove('is-glitching');
    }, 650);
  }, { passive: true });
})();
