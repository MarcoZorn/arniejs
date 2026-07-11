(function () {
  var cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var maxTilt = 12;

  cards.forEach(function (card) {
    var rafId = null;
    var pending = null;

    function apply() {
      if (!pending) { rafId = null; return; }
      var rect = card.getBoundingClientRect();
      var px = (pending.x - rect.left) / rect.width;
      var py = (pending.y - rect.top) / rect.height;
      var rotateY = (px - 0.5) * (maxTilt * 2);
      var rotateX = (0.5 - py) * (maxTilt * 2);

      card.style.transform =
        'rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';

      var glare = card.querySelector('.tilt-card__glare');
      if (glare) {
        glare.style.background =
          'radial-gradient(circle at ' + (px * 100).toFixed(1) + '% ' + (py * 100).toFixed(1) + '%, rgba(255, 246, 224, 0.32), transparent 60%)';
      }

      pending = null;
      rafId = null;
    }

    card.addEventListener('mouseenter', function () {
      card.classList.add('is-active');
    });

    card.addEventListener('mousemove', function (e) {
      pending = { x: e.clientX, y: e.clientY };
      if (!rafId) rafId = requestAnimationFrame(apply);
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('is-active');
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
})();
