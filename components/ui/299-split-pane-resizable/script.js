(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pane = document.getElementById('splitPane');
  var left = document.getElementById('splitLeft');
  var divider = document.getElementById('splitDivider');
  if (!pane || !left || !divider) return;

  var MIN_PERCENT = 15;
  var MAX_PERCENT = 85;
  var STEP = 4;
  var dragging = false;
  var startX = 0;
  var startPercent = 50;

  function setPercent(percent) {
    percent = Math.max(MIN_PERCENT, Math.min(MAX_PERCENT, percent));
    left.style.flex = '0 0 ' + percent + '%';
    divider.setAttribute('aria-valuenow', String(Math.round(percent)));
    return percent;
  }

  var currentPercent = 50;
  currentPercent = setPercent(currentPercent);

  function percentFromClientX(clientX) {
    var rect = pane.getBoundingClientRect();
    var dividerWidth = divider.getBoundingClientRect().width;
    var usableWidth = rect.width - dividerWidth;
    var x = clientX - rect.left;
    return (x / usableWidth) * 100;
  }

  function onPointerDown(event) {
    dragging = true;
    startX = event.clientX;
    startPercent = currentPercent;
    pane.classList.add('is-dragging');
    divider.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!dragging) return;
    var percent = percentFromClientX(event.clientX);
    currentPercent = setPercent(percent);
  }

  function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    pane.classList.remove('is-dragging');
    if (divider.releasePointerCapture) {
      try { divider.releasePointerCapture(event.pointerId); } catch (e) {}
    }
  }

  divider.addEventListener('pointerdown', onPointerDown);
  divider.addEventListener('pointermove', onPointerMove);
  divider.addEventListener('pointerup', onPointerUp);
  divider.addEventListener('pointercancel', onPointerUp);

  divider.addEventListener('keydown', function (event) {
    var handled = true;
    if (event.key === 'ArrowLeft') {
      currentPercent = setPercent(currentPercent - STEP);
    } else if (event.key === 'ArrowRight') {
      currentPercent = setPercent(currentPercent + STEP);
    } else if (event.key === 'Home') {
      currentPercent = setPercent(MIN_PERCENT);
    } else if (event.key === 'End') {
      currentPercent = setPercent(MAX_PERCENT);
    } else {
      handled = false;
    }
    if (handled) event.preventDefault();
  });
})();
