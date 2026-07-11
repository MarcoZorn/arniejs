(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var compare = document.getElementById('compare');
  var handle = document.getElementById('compareHandle');
  var after = document.querySelector('.compare-after');

  if (!compare || !handle || !after) return;

  var dragging = false;

  function setPosition(percent) {
    var clamped = Math.min(100, Math.max(0, percent));
    after.style.clipPath = 'inset(0 0 0 ' + clamped + '%)';
    handle.style.left = clamped + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
  }

  function percentFromEvent(clientX) {
    var rect = compare.getBoundingClientRect();
    var x = clientX - rect.left;
    return (x / rect.width) * 100;
  }

  function onPointerMove(event) {
    if (!dragging) return;
    setPosition(percentFromEvent(event.clientX));
  }

  function stopDragging() {
    if (!dragging) return;
    dragging = false;
    compare.classList.remove('is-dragging');
  }

  handle.addEventListener('pointerdown', function (event) {
    dragging = true;
    compare.classList.add('is-dragging');
    handle.setPointerCapture(event.pointerId);
  });

  compare.addEventListener('pointerdown', function (event) {
    if (event.target === handle || handle.contains(event.target)) return;
    dragging = true;
    setPosition(percentFromEvent(event.clientX));
  });

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);

  handle.addEventListener('keydown', function (event) {
    var current = parseFloat(handle.style.left) || 50;
    var step = event.shiftKey ? 10 : 3;

    if (event.key === 'ArrowLeft') {
      setPosition(current - step);
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      setPosition(current + step);
      event.preventDefault();
    } else if (event.key === 'Home') {
      setPosition(0);
      event.preventDefault();
    } else if (event.key === 'End') {
      setPosition(100);
      event.preventDefault();
    }
  });

  // Initialize at 50%.
  setPosition(50);

  if (!prefersReducedMotion) {
    handle.style.transition = 'none';
  }
})();
