(function () {
  var desk = document.getElementById('desk');
  var icon = document.getElementById('icon');
  var overlay = document.getElementById('modalOverlay');
  var closeBtn = document.getElementById('modalClose');

  if (!desk || !icon || !overlay) return;

  var dragging = false;
  var moved = false;
  var offsetX = 0;
  var offsetY = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setPosition(x, y) {
    var deskRect = desk.getBoundingClientRect();
    var iconRect = icon.getBoundingClientRect();
    var maxX = deskRect.width - iconRect.width;
    var maxY = deskRect.height - iconRect.height;

    icon.style.left = clamp(x, 0, Math.max(maxX, 0)) + 'px';
    icon.style.top = clamp(y, 0, Math.max(maxY, 0)) + 'px';
  }

  icon.addEventListener('pointerdown', function (e) {
    dragging = true;
    moved = false;
    icon.classList.add('icon--dragging');
    icon.setPointerCapture(e.pointerId);

    var iconRect = icon.getBoundingClientRect();
    offsetX = e.clientX - iconRect.left;
    offsetY = e.clientY - iconRect.top;
  });

  icon.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    moved = true;

    var deskRect = desk.getBoundingClientRect();
    var x = e.clientX - deskRect.left - offsetX;
    var y = e.clientY - deskRect.top - offsetY;
    setPosition(x, y);
  });

  function stopDrag(e) {
    if (!dragging) return;
    dragging = false;
    icon.classList.remove('icon--dragging');
    if (e && icon.hasPointerCapture && icon.hasPointerCapture(e.pointerId)) {
      icon.releasePointerCapture(e.pointerId);
    }
  }

  icon.addEventListener('pointerup', stopDrag);
  icon.addEventListener('pointercancel', stopDrag);

  function openModal() {
    overlay.hidden = false;
    closeBtn.focus();
  }

  function closeModal() {
    overlay.hidden = true;
    icon.focus();
  }

  icon.addEventListener('dblclick', function () {
    if (moved) return;
    openModal();
  });

  icon.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });
})();
