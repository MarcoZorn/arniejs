(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var carousel = document.querySelector('.story-carousel');
  if (!carousel) return;

  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.story-slide'));
  var dots = Array.prototype.slice.call(carousel.querySelectorAll('.story-dot'));
  var prevBtn = carousel.querySelector('.story-arrow--prev');
  var nextBtn = carousel.querySelector('.story-arrow--next');

  if (!slides.length) return;

  var current = slides.findIndex(function (s) { return s.classList.contains('is-active'); });
  if (current < 0) current = 0;

  var intervalMs = parseInt(carousel.getAttribute('data-autoplay'), 10) || 5000;
  var timer = null;

  function goTo(index) {
    var next = (index + slides.length) % slides.length;
    if (next === current) return;

    slides[current].classList.remove('is-active');
    dots[current] && dots[current].classList.remove('is-active');
    dots[current] && dots[current].setAttribute('aria-selected', 'false');

    current = next;

    slides[current].classList.add('is-active');
    dots[current] && dots[current].classList.add('is-active');
    dots[current] && dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = window.setInterval(next, intervalMs);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prev();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      next();
      startAutoplay();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      startAutoplay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
})();
