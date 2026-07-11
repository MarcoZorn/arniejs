(function () {
  var steps = document.querySelectorAll('.step');
  if (!steps.length) return;

  if (!('IntersectionObserver' in window)) {
    steps.forEach(function (s) { s.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  steps.forEach(function (step) {
    observer.observe(step);
  });
})();
