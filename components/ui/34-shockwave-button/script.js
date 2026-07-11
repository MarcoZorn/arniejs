(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.shock-btn');
  if (!btn) return;

  btn.addEventListener('pointerdown', () => {
    if (reduce) return;

    for (let i = 1; i <= 3; i += 1) {
      const ring = document.createElement('span');
      ring.className = `shock-ring shock-ring--${i}`;
      btn.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove());
    }
  });
})();
