(function () {
  var rotator = document.getElementById('rotator');
  if (!rotator) return;

  var slides = rotator.querySelectorAll('.testimonial');
  var dots = rotator.querySelectorAll('.rotator__dot');
  var current = 0;
  var intervalId = null;
  var interval = 4500;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() {
    goTo(current + 1);
  }

  function start() {
    if (reduceMotion) return;
    stop();
    intervalId = window.setInterval(next, interval);
  }

  function stop() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(dot.getAttribute('data-goto'), 10) || 0;
      goTo(idx);
      start();
    });
  });

  rotator.addEventListener('mouseenter', stop);
  rotator.addEventListener('mouseleave', start);
  rotator.addEventListener('focusin', stop);
  rotator.addEventListener('focusout', start);

  start();
})();
