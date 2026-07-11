(function () {
  var header = document.getElementById('stickyHeader');
  if (!header) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var threshold = 40;
  var ticking = false;

  function update() {
    var scrolled = window.scrollY > threshold;
    header.classList.toggle('compact', scrolled);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = reduceMotion ? (update(), true) : requestAnimationFrame(update);
      if (reduceMotion) ticking = false;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();
