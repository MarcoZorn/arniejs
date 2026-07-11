(function () {
  const MAX_TILT = 12; // degrees
  const cards = document.querySelectorAll('[data-tilt]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach(function (card) {
    const inner = card.querySelector('.tcard-inner');
    const glare = card.querySelector('.tcard-glare');
    const layers = card.querySelectorAll('[data-depth]');
    let raf = null;

    function apply(e) {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      const rx = (0.5 - py) * MAX_TILT * 2;
      const ry = (px - 0.5) * MAX_TILT * 2;

      inner.style.transition = 'box-shadow 0.5s ease';
      inner.style.transform =
        'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';

      glare.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      glare.style.setProperty('--gy', (py * 100).toFixed(1) + '%');

      layers.forEach(function (layer) {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
        const tx = (px - 0.5) * depth * 0.6;
        const ty = (py - 0.5) * depth * 0.6;
        layer.style.transform =
          'translate3d(' + tx.toFixed(2) + 'px, ' + ty.toFixed(2) + 'px, ' + depth + 'px)';
      });
    }

    function onMove(e) {
      if (reduce) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { apply(e); });
    }

    function onLeave() {
      if (raf) cancelAnimationFrame(raf);
      inner.style.transition =
        'transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease';
      inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
      layers.forEach(function (layer) {
        layer.style.transform = 'translate3d(0,0,0)';
      });
    }

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
})();
