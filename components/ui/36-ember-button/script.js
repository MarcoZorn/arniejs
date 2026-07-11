(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.ember-btn');
  if (!btn || reduce) return;

  // A click stokes the fire: briefly flare the glow before it settles back.
  btn.addEventListener('click', () => {
    btn.classList.add('is-stoked');
    window.clearTimeout(btn._stokeTimer);
    btn._stokeTimer = window.setTimeout(() => {
      btn.classList.remove('is-stoked');
    }, 900);
  });
})();
