(function () {
  const timeline = document.querySelector('.timeline');
  const items = Array.from(document.querySelectorAll('.item'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    items.forEach((i) => i.classList.add('reveal'));
    timeline.style.setProperty('--progress', '1');
    return;
  }

  // Staggered reveal of each item
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const i = items.indexOf(entry.target);
        entry.target.style.transitionDelay = (i % 2 === 0 ? 0 : 90) + 'ms';
        entry.target.classList.add('reveal');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -12% 0px' });

  items.forEach((item) => io.observe(item));

  // Progress line fills relative to scroll through the timeline
  let ticking = false;
  function updateProgress() {
    ticking = false;
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.5;                 // fill point = viewport middle
    const total = rect.height;
    const filled = Math.min(Math.max(start - rect.top, 0), total);
    timeline.style.setProperty('--progress', (filled / total).toFixed(4));
  }
  function onScroll() {
    if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateProgress();
})();
