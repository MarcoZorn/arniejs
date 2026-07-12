(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var frame = document.getElementById('baFrame');
  var handle = document.getElementById('baHandle');
  var after = document.getElementById('baAfter');
  if (!frame || !handle || !after) return;

  var dragging = false;
  var position = 50; // percent, 0 = fully before, 100 = fully after

  function setPosition(percent) {
    position = Math.max(0, Math.min(100, percent));
    after.style.clipPath = 'inset(0 0 0 ' + position + '%)';
    handle.style.left = position + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(position)));
  }

  function percentFromClientX(clientX) {
    var rect = frame.getBoundingClientRect();
    var ratio = (clientX - rect.left) / rect.width;
    return ratio * 100;
  }

  function onPointerDown(e) {
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    if (!reduceMotion) {
      frame.classList.add('is-dragging');
    }
    setPosition(percentFromClientX(e.clientX));
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    setPosition(percentFromClientX(e.clientX));
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    frame.classList.remove('is-dragging');
    if (handle.hasPointerCapture && handle.hasPointerCapture(e.pointerId)) {
      handle.releasePointerCapture(e.pointerId);
    }
  }

  handle.addEventListener('pointerdown', onPointerDown);
  handle.addEventListener('pointermove', onPointerMove);
  handle.addEventListener('pointerup', onPointerUp);
  handle.addEventListener('pointercancel', onPointerUp);

  // Allow starting a drag anywhere in the frame too, for a bigger hit target.
  frame.addEventListener('pointerdown', function (e) {
    if (e.target === handle || handle.contains(e.target)) return;
    setPosition(percentFromClientX(e.clientX));
  });

  handle.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 10 : 3;
    if (e.key === 'ArrowLeft') {
      setPosition(position - step);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setPosition(position + step);
      e.preventDefault();
    } else if (e.key === 'Home') {
      setPosition(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      setPosition(100);
      e.preventDefault();
    }
  });

  setPosition(50);
})();
