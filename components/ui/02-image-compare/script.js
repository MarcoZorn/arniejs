(function () {
  const compare = document.getElementById('compare');
  const handle = document.getElementById('handle');
  let dragging = false;
  let hasInteracted = false;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function setPos(pct) {
    pct = clamp(pct, 0, 100);
    compare.style.setProperty('--pos', pct + '%');
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function posFromEvent(clientX) {
    const rect = compare.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function startInteract() {
    if (hasInteracted) return;
    hasInteracted = true;
    // cancel intro animation, lock at current computed value
    const current = getComputedStyle(compare).getPropertyValue('--pos');
    compare.style.animation = 'none';
    if (current) compare.style.setProperty('--pos', current.trim());
  }

  function onDown(e) {
    dragging = true;
    startInteract();
    handle.classList.add('is-active');
    compare.setPointerCapture && compare.setPointerCapture(e.pointerId);
    setPos(posFromEvent(e.clientX));
  }
  function onMove(e) {
    if (!dragging) return;
    setPos(posFromEvent(e.clientX));
  }
  function onUp() {
    dragging = false;
    handle.classList.remove('is-active');
  }

  compare.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  // Keyboard support
  handle.addEventListener('keydown', (e) => {
    const now = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') { startInteract(); setPos(now - step); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { startInteract(); setPos(now + step); e.preventDefault(); }
    else if (e.key === 'Home') { startInteract(); setPos(0); e.preventDefault(); }
    else if (e.key === 'End') { startInteract(); setPos(100); e.preventDefault(); }
  });

  // Intro sweep animation once fonts/layout settle
  requestAnimationFrame(() => {
    if (hasInteracted) return;
    compare.style.animation = 'introSweep 2.4s cubic-bezier(.5,0,.2,1) .4s 1';
  });
  compare.addEventListener('animationend', () => {
    if (!hasInteracted) compare.style.setProperty('--pos', '50%');
    compare.style.animation = 'none';
  });

  // Keep before image locked to container width on resize (handled via CSS 100vw fallback)
  window.addEventListener('resize', () => {
    const before = compare.querySelector('.compare__img--before');
    if (before) before.style.width = compare.getBoundingClientRect().width + 'px';
  });
  window.dispatchEvent(new Event('resize'));
})();
