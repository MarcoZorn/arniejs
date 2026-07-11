(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const values = document.querySelectorAll('.stat__value');

  function formatNumber(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function countUp(el) {
    const target = Number(el.dataset.countTo || 0);
    const suffix = el.dataset.suffix || '';

    if (reduce) {
      el.textContent = formatNumber(target) + suffix;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = formatNumber(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const seen = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !seen.has(entry.target)) {
        seen.add(entry.target);
        countUp(entry.target);
      }
    });
  }, { threshold: 0.4 });

  values.forEach((el) => observer.observe(el));
})();
