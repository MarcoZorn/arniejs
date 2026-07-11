(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    var spinners = document.querySelectorAll('.spinner');
    spinners.forEach(function (el) {
      el.style.animation = 'none';
      el.querySelectorAll('*').forEach(function (child) {
        child.style.animation = 'none';
      });
    });
  }
})();
