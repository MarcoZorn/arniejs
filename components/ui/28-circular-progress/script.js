(function () {
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateNum(el, to, dur) {
    if (reduce) { el.textContent = to; return; }
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * to);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function run(ring) {
    const value = Math.max(0, Math.min(100, +ring.dataset.value || 0));
    const bar = ring.querySelector('.ring__bar');
    const num = ring.querySelector('.ring__num');
    bar.style.strokeDasharray = CIRC;
    bar.style.strokeDashoffset = CIRC;
    // force reflow then animate
    void bar.getBoundingClientRect();
    const offset = CIRC * (1 - value / 100);
    if (reduce) bar.style.transition = 'none';
    requestAnimationFrame(() => { bar.style.strokeDashoffset = offset; });
    animateNum(num, value, 1400);
  }

  const rings = Array.from(document.querySelectorAll('.ring'));

  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    rings.forEach((r) => io.observe(r));
  } else {
    rings.forEach(run);
  }
})();
