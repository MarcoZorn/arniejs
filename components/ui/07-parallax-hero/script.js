(function () {
  const hero = document.getElementById('hero');
  const stage = document.getElementById('stage');
  const layers = Array.from(stage.querySelectorAll('[data-depth]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Current + target values, smoothed each frame.
  let tx = 0, ty = 0, cx = 0, cy = 0;
  let raf = null;

  function apply() {
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;

    // Tilt the whole stage toward the cursor.
    stage.style.transform =
      `rotateX(${(-cy * 6).toFixed(3)}deg) rotateY(${(cx * 8).toFixed(3)}deg)`;

    layers.forEach((el) => {
      const depth = parseFloat(el.getAttribute('data-depth')) || 0;
      const dx = cx * depth;
      const dy = cy * depth;
      const base = el.classList.contains('hero-content') ? 'translate(0,-50%) ' : '';
      el.style.transform = `${base}translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, ${depth}px)`;
    });

    if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
      raf = requestAnimationFrame(apply);
    } else {
      raf = null;
    }
  }

  function schedule() { if (raf === null) raf = requestAnimationFrame(apply); }

  function onMove(e) {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    schedule();
  }

  function reset() { tx = 0; ty = 0; schedule(); }

  // Gentle auto-float fallback for touch / no fine pointer / reduced motion off.
  let floatRaf = null;
  function autoFloat(t) {
    tx = Math.sin(t / 2600) * 0.5;
    ty = Math.cos(t / 3200) * 0.4;
    schedule();
    floatRaf = requestAnimationFrame(autoFloat);
  }

  function enableAuto() {
    if (reduce.matches) return;
    floatRaf = requestAnimationFrame(autoFloat);
  }
  function disableAuto() {
    if (floatRaf) { cancelAnimationFrame(floatRaf); floatRaf = null; }
  }

  function setup() {
    hero.removeEventListener('mousemove', onMove);
    hero.removeEventListener('mouseleave', reset);
    disableAuto();
    stage.style.transform = '';
    layers.forEach((el) => {
      const base = el.classList.contains('hero-content') ? 'translate(0,-50%)' : '';
      el.style.transform = base;
    });
    if (reduce.matches) return;

    if (finePointer.matches) {
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', reset);
    } else {
      enableAuto();
    }
  }

  setup();
  finePointer.addEventListener('change', setup);
  reduce.addEventListener('change', setup);
})();
