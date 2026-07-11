(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = document.querySelectorAll('.weather-card');

  if (reduce) {
    cards.forEach(function (card) {
      card.classList.add('is-static');
    });
  }
})();
