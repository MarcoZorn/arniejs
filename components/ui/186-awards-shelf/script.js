(function () {
  var awards = document.querySelectorAll('.award');
  if (!awards.length) return;

  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = '0ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  awards.forEach(function (award) {
    observer.observe(award);
  });
})();
