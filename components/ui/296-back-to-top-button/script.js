(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var button = document.getElementById('bttButton');
  if (!button) return;

  var SHOW_AFTER = 320;
  var ticking = false;

  function updateVisibility() {
    var scrolled = window.scrollY || document.documentElement.scrollTop;
    button.classList.toggle('is-visible', scrolled > SHOW_AFTER);
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateVisibility);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateVisibility();

  button.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
    button.blur();
  });
})();
