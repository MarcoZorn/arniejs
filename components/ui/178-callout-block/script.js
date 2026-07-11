(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var callouts = document.querySelectorAll('.callout');

  if (!callouts.length) return;

  if (prefersReducedMotion) {
    callouts.forEach(function (callout) {
      callout.style.animation = 'none';
      callout.style.opacity = '1';
      callout.style.transform = 'none';
    });
    return;
  }

  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.2 });

  callouts.forEach(function (callout) {
    observer.observe(callout);
  });
})();
