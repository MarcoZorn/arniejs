(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.split-btn');
  if (!btn || reduce) return;

  // Touch devices have no hover; tap toggles the split/reveal state instead.
  let toggled = false;
  btn.addEventListener('touchstart', () => {
    toggled = !toggled;
    btn.classList.toggle('is-split', toggled);
  }, { passive: true });
})();
