(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var viewport = document.querySelector('.grove-timeline__viewport');
  var track = document.querySelector('.grove-timeline__track');
  var progressFill = document.querySelector('.grove-timeline__progress-fill');
  var navButtons = document.querySelectorAll('.grove-timeline__nav');

  if (!viewport || !track) {
    return;
  }

  function updateProgress() {
    var maxScroll = viewport.scrollWidth - viewport.clientWidth;
    var ratio = maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0;
    if (progressFill) {
      progressFill.style.width = (Math.max(0, Math.min(1, ratio)) * 100).toFixed(2) + '%';
    }
  }

  function scrollByStep(direction) {
    var step = Math.min(320, viewport.clientWidth * 0.7);
    viewport.scrollBy({
      left: step * direction,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = parseInt(btn.getAttribute('data-dir'), 10) || 1;
      scrollByStep(dir);
    });
  });

  viewport.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  // Drag-to-scroll via pointer events (covers mouse, touch, pen).
  var isDragging = false;
  var startX = 0;
  var startScrollLeft = 0;
  var pointerId = null;
  var moved = false;

  viewport.addEventListener('pointerdown', function (e) {
    isDragging = true;
    moved = false;
    pointerId = e.pointerId;
    startX = e.clientX;
    startScrollLeft = viewport.scrollLeft;
    viewport.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', function (e) {
    if (!isDragging || e.pointerId !== pointerId) {
      return;
    }
    var delta = e.clientX - startX;
    if (Math.abs(delta) > 3) {
      moved = true;
    }
    viewport.scrollLeft = startScrollLeft - delta;
  });

  function endDrag(e) {
    if (!isDragging || (pointerId !== null && e.pointerId !== undefined && e.pointerId !== pointerId)) {
      return;
    }
    isDragging = false;
    pointerId = null;
    viewport.classList.remove('is-dragging');
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', endDrag);

  // Prevent click-through on cards after a drag gesture.
  viewport.addEventListener('click', function (e) {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);

  // Keyboard support: left/right arrows scroll when the viewport is focused.
  viewport.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByStep(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByStep(-1);
    }
  });

  updateProgress();
})();
