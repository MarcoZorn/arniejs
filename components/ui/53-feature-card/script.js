(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = document.querySelectorAll('.feature');

  cards.forEach(function (card) {
    if (reduce) return;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      var y = ((e.clientY - r.top) / r.height - 0.5) * -6;
      card.style.transform = 'translateY(-8px) rotateX(' + y + 'deg) rotateY(' + x + 'deg)';
    });
    card.addEventListener('pointerleave', function () {
      card.style.transform = '';
    });
  });
})();
