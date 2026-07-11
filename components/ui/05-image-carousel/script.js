(function () {
  const deck = document.getElementById('deck');
  const slides = Array.from(deck.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  const stage = document.getElementById('stage');
  const N = slides.length;

  let index = 0;
  let dragging = false;
  let startX = 0;
  let dragDX = 0;
  let moved = false;

  // Build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
    return b;
  });

  // Shortest signed distance from active index on a ring of N slides
  function offset(i) {
    let d = i - index;
    d -= Math.round(d / N) * N;
    return d;
  }

  function render(dragShift) {
    dragShift = dragShift || 0;
    slides.forEach((slide, i) => {
      const off = offset(i) + dragShift;
      const abs = Math.abs(off);
      const sign = off < 0 ? -1 : 1;
      const tx = off * 58;                       // % horizontal spread
      const tz = -Math.min(abs, 3.2) * 160;      // push back
      const ry = Math.max(-1, Math.min(1, off)) * -42; // rotate side cards
      const scale = Math.max(0.62, 1 - abs * 0.12);
      const opacity = abs > 3.4 ? 0 : Math.max(0.12, 1 - abs * 0.26);
      const zi = 100 - Math.round(abs * 10);
      slide.style.transform =
        `translate(-50%,-50%) translateX(${tx}%) translateZ(${tz}px) rotateY(${ry * (sign ? 1 : 1)}deg) scale(${scale})`;
      slide.style.opacity = opacity;
      slide.style.zIndex = zi;
      slide.classList.toggle('is-active', i === index && !dragShift);
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function go(i) {
    index = ((i % N) + N) % N;
    render();
  }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  document.getElementById('next').addEventListener('click', next);
  document.getElementById('prev').addEventListener('click', prev);

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); }
    else if (e.key === 'ArrowLeft') { prev(); }
  });

  // Click a side slide to focus it
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (!moved && i !== index) go(i);
    });
  });

  // Pointer drag / swipe
  const SLIDE_W = () => Math.max(160, stage.clientWidth * 0.32);

  function onDown(e) {
    dragging = true;
    moved = false;
    startX = e.clientX;
    dragDX = 0;
    deck.style.transition = 'none';
    stopAuto();
    deck.setPointerCapture && deck.setPointerCapture(e.pointerId);
  }
  function onMove(e) {
    if (!dragging) return;
    dragDX = e.clientX - startX;
    if (Math.abs(dragDX) > 6) moved = true;
    render(-dragDX / SLIDE_W());
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    const shift = Math.round(-dragDX / SLIDE_W());
    if (shift !== 0) go(index + shift);
    else render();
    startAuto();
  }

  deck.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  // Autoplay, paused on hover
  let timer = null;
  function startAuto() {
    stopAuto();
    timer = setInterval(next, 3800);
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  stage.addEventListener('pointerenter', stopAuto);
  stage.addEventListener('pointerleave', startAuto);

  render();
  startAuto();
})();
