(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.quote-card');
  if (!card) return;

  var slides = Array.prototype.slice.call(card.querySelectorAll('.quote-slide'));
  var dots = Array.prototype.slice.call(card.querySelectorAll('.quote-dot'));
  var nextBtn = card.querySelector('.quote-next');

  var current = 0;

  function goTo(index) {
    if (index === current) return;
    index = ((index % slides.length) + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    current = index;
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = parseInt(dot.getAttribute('data-goto'), 10);
      goTo(target);
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goTo(current + 1);
    });
  }
})();
