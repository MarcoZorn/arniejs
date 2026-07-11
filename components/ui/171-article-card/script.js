(function () {
  var cards = document.querySelectorAll('.article-card');

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var title = card.querySelector('.article-card__title');
      if (title) {
        card.setAttribute('aria-label', 'Opening: ' + title.textContent);
      }
    });
  });
})();
