(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const card = document.querySelector('.parchment');
  if (!card || reduce) return;

  // subtle parallax on the ink stains as the pointer moves, like light catching aged paper
  const stains = card.querySelectorAll('.parchment__stain');
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    stains.forEach((s, i) => {
      const factor = i === 0 ? 10 : -14;
      s.style.transform = `translate(${px * factor}px, ${py * factor}px)`;
    });
  });
  card.addEventListener('pointerleave', () => {
    stains.forEach((s) => { s.style.transform = ''; });
  });
})();
