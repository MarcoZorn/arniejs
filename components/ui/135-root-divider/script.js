(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dividers = Array.prototype.slice.call(document.querySelectorAll('[data-divider]'));

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    dividers.forEach(function (divider) {
      divider.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.4 }
  );

  dividers.forEach(function (divider) {
    observer.observe(divider);
  });
})();
