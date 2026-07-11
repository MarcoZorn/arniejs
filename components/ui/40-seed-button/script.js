(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.seed-btn');
  if (!btn) return;

  const seedColors = ['#d4a85a', '#9b6b3a', '#8fa86e', '#c4622d'];

  function burst(x, y) {
    const count = 10;
    for (let i = 0; i < count; i += 1) {
      const seed = document.createElement('span');
      seed.className = 'seed';

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const dist = 30 + Math.random() * 40;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 10; // slight upward launch before gravity pulls down

      seed.style.setProperty('--sx', `${x}px`);
      seed.style.setProperty('--sy', `${y}px`);
      seed.style.setProperty('--dx', `${dx}px`);
      seed.style.setProperty('--dy', `${dy}px`);
      seed.style.setProperty('--dur', `${0.7 + Math.random() * 0.5}s`);
      seed.style.background = seedColors[i % seedColors.length];

      btn.appendChild(seed);
      seed.addEventListener('animationend', () => seed.remove());
    }
  }

  btn.addEventListener('pointerdown', (e) => {
    if (reduce) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    burst(x, y);
  });
})();
