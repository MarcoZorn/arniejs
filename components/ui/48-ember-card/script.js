(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const card = document.querySelector('.ember');
  if (!card || reduce) return;

  // hovering intensifies the glow and briefly speeds the breathing pulse
  card.addEventListener('pointerenter', () => {
    card.style.animationDuration = '1.6s';
  });
  card.addEventListener('pointerleave', () => {
    card.style.animationDuration = '3.6s';
  });
})();
