(function () {
  var split = document.getElementById('split');
  var divider = document.getElementById('divider');
  var paneLeft = document.getElementById('paneLeft');
  var ratioLabel = document.getElementById('ratioLabel');

  var dragging = false;
  var minPct = 15;
  var maxPct = 85;

  function setRatio(pct) {
    pct = Math.min(maxPct, Math.max(minPct, pct));
    paneLeft.style.flex = '0 0 ' + pct + '%';
    ratioLabel.textContent = Math.round(pct) + '% / ' + Math.round(100 - pct) + '%';
    divider.setAttribute('aria-valuenow', Math.round(pct));
  }

  divider.setAttribute('aria-valuemin', minPct);
  divider.setAttribute('aria-valuemax', maxPct);
  setRatio(50);

  function pctFromClientX(clientX) {
    var rect = split.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  divider.addEventListener('pointerdown', function (e) {
    dragging = true;
    divider.classList.add('is-dragging');
    divider.setPointerCapture(e.pointerId);
  });

  divider.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    setRatio(pctFromClientX(e.clientX));
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove('is-dragging');
    if (e && e.pointerId !== undefined) {
      try { divider.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
    }
  }

  divider.addEventListener('pointerup', endDrag);
  divider.addEventListener('pointercancel', endDrag);

  divider.addEventListener('keydown', function (e) {
    var current = parseFloat(paneLeft.style.flex.replace('0 0 ', '')) || 50;
    if (e.key === 'ArrowLeft') {
      setRatio(current - 2);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setRatio(current + 2);
      e.preventDefault();
    } else if (e.key === 'Home') {
      setRatio(minPct);
      e.preventDefault();
    } else if (e.key === 'End') {
      setRatio(maxPct);
      e.preventDefault();
    }
  });
})();
