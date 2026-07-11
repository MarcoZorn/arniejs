(() => {
  const band = document.querySelector('.band');
  if (!band) return;

  const counters = [...band.querySelectorAll('[data-target]')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function format(el, value) {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    return prefix + value.toFixed(decimals) + suffix;
  }

  // easeOutExpo
  const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  function run(el) {
    const target = parseFloat(el.dataset.target);
    if (reduce) { el.textContent = format(el, target); return; }
    const dur = 1600;
    const start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = format(el, target * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(el, target);
    })(performance.now());
  }

  function reset() {
    counters.forEach((el) => { el.textContent = format(el, 0); });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        band.classList.add('is-visible');
        counters.forEach(run);
      } else {
        // re-trigger on re-enter
        band.classList.remove('is-visible');
        reset();
      }
    });
  }, { threshold: 0.4 });

  io.observe(band);
})();
