(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.morph-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (reduce) return;
    btn.classList.add('is-locked');
    window.clearTimeout(btn._morphTimer);
    btn._morphTimer = window.setTimeout(() => {
      btn.classList.remove('is-locked');
    }, 1600);
  });
})();
