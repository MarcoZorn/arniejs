(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.bloom-btn');
  if (!btn || reduce) return;

  // Touch support: toggle bloom state on tap since there's no hover on touch devices.
  btn.addEventListener('touchstart', () => {
    btn.classList.toggle('is-bloomed');
  }, { passive: true });

  if (btn.classList.contains('is-bloomed')) {
    btn.style.color = '#241a0e';
  }
})();
