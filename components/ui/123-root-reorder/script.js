(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.getElementById('rootList');
  var hint = document.getElementById('hint');
  if (!list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll('.root-item'));

  var draggingItem = null;
  var startY = 0;
  var startTop = 0;
  var placeholderIndex = -1;

  function getItems() {
    return Array.prototype.slice.call(list.querySelectorAll('.root-item'));
  }

  function onPointerDown(event, item) {
    // Only start drag from the handle.
    var handleEl = event.target.closest('.drag-handle');
    if (!handleEl) return;

    draggingItem = item;
    startY = event.clientY;
    var rect = item.getBoundingClientRect();
    startTop = rect.top;

    item.setPointerCapture(event.pointerId);
    item.classList.add('is-dragging');

    if (!prefersReducedMotion) {
      item.style.position = 'relative';
      item.style.zIndex = '5';
    }

    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!draggingItem) return;

    var deltaY = event.clientY - startY;
    if (!prefersReducedMotion) {
      draggingItem.style.transform = 'translateY(' + deltaY + 'px)';
    }

    var currentItems = getItems();
    var draggingRect = draggingItem.getBoundingClientRect();
    var draggingCenter = draggingRect.top + draggingRect.height / 2;

    for (var i = 0; i < currentItems.length; i++) {
      var other = currentItems[i];
      if (other === draggingItem) continue;

      var rect = other.getBoundingClientRect();
      var center = rect.top + rect.height / 2;

      if (draggingCenter < center && draggingItem.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_PRECEDING) {
        list.insertBefore(draggingItem, other);
        resetTransformAfterReflow(draggingItem, deltaY);
        startY = event.clientY;
        break;
      } else if (draggingCenter > center && draggingItem.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING) {
        list.insertBefore(draggingItem, other.nextSibling);
        resetTransformAfterReflow(draggingItem, deltaY);
        startY = event.clientY;
        break;
      }
    }
  }

  function resetTransformAfterReflow(item) {
    if (prefersReducedMotion) return;
    item.style.transform = 'translateY(0px)';
  }

  function onPointerUp(event) {
    if (!draggingItem) return;

    draggingItem.classList.remove('is-dragging');
    draggingItem.style.transform = '';
    draggingItem.style.position = '';
    draggingItem.style.zIndex = '';

    try {
      draggingItem.releasePointerCapture(event.pointerId);
    } catch (e) {
      // ignore
    }

    draggingItem = null;
    updateMeta();

    if (hint) {
      hint.textContent = 'Order saved automatically as you drag.';
    }
  }

  function updateMeta() {
    getItems().forEach(function (item, index) {
      var meta = item.querySelector('.root-meta');
      if (meta) meta.textContent = 'Row ' + (index + 1);
    });
  }

  items.forEach(function (item) {
    item.addEventListener('pointerdown', function (event) {
      onPointerDown(event, item);
    });
  });

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
})();
