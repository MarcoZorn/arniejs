(function () {
  var counters = document.querySelectorAll('.counter__value');
  if (!counters.length) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateValue(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = easeOutQuart(progress);
      var value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateValue);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        if (el.classList.contains('is-counted')) return;
        el.classList.add('is-counted');
        el.closest('.counter').classList.add('is-visible');
        animateValue(el);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) {
    observer.observe(el);
  });
})();
