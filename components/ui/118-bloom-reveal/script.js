(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-bloom]'));
  if (!cards.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    cards.forEach(function (card) { card.classList.add('in-view'); });
    return;
  }

  cards.forEach(function (card, i) {
    card.style.transitionDelay = (i % 3) * 0.08 + 's';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  cards.forEach(function (card) { observer.observe(card); });
})();
