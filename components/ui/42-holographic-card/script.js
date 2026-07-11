(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const card = document.getElementById('holoCard');
  const shine = card.querySelector('.holo__shine');
  const glare = card.querySelector('.holo__glare');
  if (!card || reduce) return;

  const maxTilt = 14;

  function onMove(e) {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    const rotX = (0.5 - y) * maxTilt;
    const rotY = (x - 0.5) * maxTilt;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    shine.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
    glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(240,230,211,.55), transparent 60%)`;
  }

  function onLeave() {
    card.style.transform = '';
  }

  card.addEventListener('pointermove', onMove);
  card.addEventListener('pointerleave', onLeave);

  card.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    onMove({ clientX: t.clientX, clientY: t.clientY });
  }, { passive: true });
  card.addEventListener('touchend', onLeave);
})();
