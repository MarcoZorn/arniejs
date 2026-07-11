(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const track = document.getElementById('track');
  const fill = document.getElementById('fill');
  const thumbMin = document.getElementById('thumbMin');
  const thumbMax = document.getElementById('thumbMax');
  const minValEl = document.getElementById('minVal');
  const maxValEl = document.getElementById('maxVal');

  const MIN = 0, MAX = 100, STEP = 1, GAP = 1;
  let minV = 20, maxV = 80;

  function pctOf(v) { return ((v - MIN) / (MAX - MIN)) * 100; }

  function render() {
    const minPct = pctOf(minV);
    const maxPct = pctOf(maxV);
    thumbMin.style.left = minPct + '%';
    thumbMax.style.left = maxPct + '%';
    fill.style.left = minPct + '%';
    fill.style.right = (100 - maxPct) + '%';
    minValEl.textContent = Math.round(minV);
    maxValEl.textContent = Math.round(maxV);
    thumbMin.setAttribute('aria-valuenow', Math.round(minV));
    thumbMax.setAttribute('aria-valuenow', Math.round(maxV));
  }

  function clientXToValue(clientX) {
    const rect = track.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.min(1, Math.max(0, pct));
    return MIN + pct * (MAX - MIN);
  }

  function makeDraggable(thumb, isMin) {
    let dragging = false;

    function onMove(clientX) {
      let v = clientXToValue(clientX);
      v = Math.round(v / STEP) * STEP;
      if (isMin) {
        v = Math.min(v, maxV - GAP);
        v = Math.max(MIN, v);
        minV = v;
      } else {
        v = Math.max(v, minV + GAP);
        v = Math.min(MAX, v);
        maxV = v;
      }
      render();
    }

    thumb.addEventListener('pointerdown', (e) => {
      dragging = true;
      thumb.setPointerCapture(e.pointerId);
      thumb.focus();
      onMove(e.clientX);
      e.preventDefault();
    });
    thumb.addEventListener('pointermove', (e) => {
      if (dragging) onMove(e.clientX);
    });
    thumb.addEventListener('pointerup', (e) => {
      dragging = false;
      thumb.releasePointerCapture(e.pointerId);
    });

    thumb.addEventListener('keydown', (e) => {
      const big = e.shiftKey ? 10 : 1;
      let delta = 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = big;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -big;
      else if (e.key === 'Home') { isMin ? (minV = MIN) : (maxV = MIN); render(); e.preventDefault(); return; }
      else if (e.key === 'End') { isMin ? (minV = MAX) : (maxV = MAX); render(); e.preventDefault(); return; }
      else return;
      e.preventDefault();
      if (isMin) {
        minV = Math.min(Math.max(MIN, minV + delta), maxV - GAP);
      } else {
        maxV = Math.max(Math.min(MAX, maxV + delta), minV + GAP);
      }
      render();
    });
  }

  makeDraggable(thumbMin, true);
  makeDraggable(thumbMax, false);

  // Click on track jumps nearest thumb
  track.addEventListener('pointerdown', (e) => {
    if (e.target === thumbMin || e.target === thumbMax) return;
    const v = clientXToValue(e.clientX);
    const distMin = Math.abs(v - minV);
    const distMax = Math.abs(v - maxV);
    if (distMin <= distMax) {
      minV = Math.min(v, maxV - GAP);
    } else {
      maxV = Math.max(v, minV + GAP);
    }
    render();
  });

  render();
})();
