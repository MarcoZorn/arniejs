(function () {
  var card = document.querySelector('.rs-card');
  if (!card) return;

  var fills = Array.prototype.slice.call(card.querySelectorAll('.rs-bar-fill'));

  function reveal() {
    fills.forEach(function (fill, i) {
      setTimeout(function () {
        fill.classList.add('is-visible');
      }, i * 90);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(card);
  } else {
    reveal();
  }
})();
