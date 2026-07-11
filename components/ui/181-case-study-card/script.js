(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = document.querySelectorAll('.case-card');

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
    });

    if (prefersReducedMotion) return;

    card.addEventListener('pointermove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-10px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
    });

    card.addEventListener('pointerleave', function () {
      card.style.transform = '';
    });
  });
})();
