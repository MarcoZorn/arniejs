(function () {
  const cursor = document.querySelector('.cursor');
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const label = document.querySelector('.cursor-label');

  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouch || reduced || !cursor) {
    document.body.classList.add('no-custom-cursor');
    return;
  }
  document.body.classList.add('has-cursor');

  // pointer target + lagged ring position
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;      // ring (lags)
  let dx = mx, dy = my;      // dot (fast)

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  let scale = 1, targetScale = 1;

  function tick() {
    dx += (mx - dx) * 0.35;
    dy += (my - dy) * 0.35;
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    scale += (targetScale - scale) * 0.2;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    ring.style.transform =
      `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  document.addEventListener('mousedown', () => { cursor.classList.add('is-down'); targetScale = 0.7; });
  document.addEventListener('mouseup', () => { cursor.classList.remove('is-down'); targetScale = cursor.classList.contains('is-hover') ? 2.1 : 1; });
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

  // magnetic elements
  const magnets = document.querySelectorAll('.magnetic');
  const STRENGTH = 0.4;

  magnets.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      el.style.transform =
        `translate(${relX * STRENGTH}px, ${relY * STRENGTH}px) scale(1.06)`;
    });

    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hover');
      targetScale = 2.1;
      label.textContent = el.dataset.cursor || '';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      cursor.classList.remove('is-hover');
      targetScale = 1;
      label.textContent = '';
    });
  });
})();
