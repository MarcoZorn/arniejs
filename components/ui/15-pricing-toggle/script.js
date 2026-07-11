(() => {
  const root = document.querySelector('.stage');
  if (!root) return;

  const sw = root.querySelector('.switch');
  const labels = root.querySelectorAll('.toggle__label');
  const save = root.querySelector('.save');
  const nums = [...root.querySelectorAll('.price__num')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let yearly = true; // start on yearly to show the savings

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  // animated count between two integers
  function countTo(el, from, to) {
    if (reduce || from === to) { el.textContent = to; return; }
    const dur = 420;
    const start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(from + (to - from) * easeOut(p));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  function apply() {
    sw.setAttribute('aria-checked', String(yearly));
    labels.forEach((l) => l.classList.toggle('is-active',
      l.dataset.label === (yearly ? 'yearly' : 'monthly')));
    save.classList.toggle('is-hidden', !yearly);

    nums.forEach((el) => {
      const from = parseInt(el.textContent, 10) || 0;
      const to = parseInt(yearly ? el.dataset.yearly : el.dataset.monthly, 10);
      // brief crossfade lift, then count
      el.classList.add('is-swapping');
      setTimeout(() => {
        countTo(el, from, to);
        el.classList.remove('is-swapping');
      }, reduce ? 0 : 140);
    });
  }

  function toggle() { yearly = !yearly; apply(); }

  sw.addEventListener('click', toggle);
  sw.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  apply();
})();
