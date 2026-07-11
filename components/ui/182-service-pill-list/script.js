(function () {
  var row = document.querySelector('.pill-row');
  if (!row) return;

  var isDown = false;
  var startX = 0;
  var scrollStart = 0;
  var moved = false;

  row.addEventListener('pointerdown', function (e) {
    isDown = true;
    moved = false;
    row.classList.add('dragging');
    startX = e.clientX;
    scrollStart = row.scrollLeft;
    row.setPointerCapture(e.pointerId);
  });

  row.addEventListener('pointermove', function (e) {
    if (!isDown) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 3) moved = true;
    row.scrollLeft = scrollStart - dx;
  });

  function endDrag(e) {
    isDown = false;
    row.classList.remove('dragging');
  }

  row.addEventListener('pointerup', endDrag);
  row.addEventListener('pointercancel', endDrag);
  row.addEventListener('pointerleave', endDrag);

  row.addEventListener('click', function (e) {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  row.addEventListener('wheel', function (e) {
    if (e.deltaY === 0) return;
    row.scrollLeft += e.deltaY;
  }, { passive: true });
})();
