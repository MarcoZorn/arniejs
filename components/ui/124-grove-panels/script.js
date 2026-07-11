(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var panels = document.getElementById('panels');
  var left = document.getElementById('panelLeft');
  var handle = document.getElementById('panelHandle');

  if (!panels || !left || !handle) return;

  var dragging = false;
  var MIN_PERCENT = 15;
  var MAX_PERCENT = 85;

  function isStacked() {
    return window.matchMedia('(max-width: 640px)').matches;
  }

  function setSplit(percent) {
    var clamped = Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, percent));
    left.style.flexBasis = clamped + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
    handle.setAttribute('aria-valuemin', String(MIN_PERCENT));
    handle.setAttribute('aria-valuemax', String(MAX_PERCENT));
  }

  function percentFromEvent(event) {
    var rect = panels.getBoundingClientRect();
    if (isStacked()) {
      var y = event.clientY - rect.top;
      return (y / rect.height) * 100;
    }
    var x = event.clientX - rect.left;
    return (x / rect.width) * 100;
  }

  handle.addEventListener('pointerdown', function (event) {
    dragging = true;
    handle.classList.add('is-active');
    handle.setPointerCapture(event.pointerId);
    if (!prefersReducedMotion) {
      panels.style.userSelect = 'none';
    }
  });

  window.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    setSplit(percentFromEvent(event));
  });

  function stopDragging() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('is-active');
    panels.style.userSelect = '';
  }

  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);

  handle.addEventListener('keydown', function (event) {
    var current = parseFloat(left.style.flexBasis) || 45;
    var step = event.shiftKey ? 10 : 4;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      setSplit(current - step);
      event.preventDefault();
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      setSplit(current + step);
      event.preventDefault();
    } else if (event.key === 'Home') {
      setSplit(MIN_PERCENT);
      event.preventDefault();
    } else if (event.key === 'End') {
      setSplit(MAX_PERCENT);
      event.preventDefault();
    }
  });

  setSplit(45);
})();
