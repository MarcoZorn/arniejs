(function () {
  var desk = document.querySelector('.desk');
  var win = document.getElementById('win');
  var bar = document.getElementById('winBar');

  if (!desk || !win || !bar) return;

  var dragging = false;
  var offsetX = 0;
  var offsetY = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setPosition(x, y) {
    var deskRect = desk.getBoundingClientRect();
    var winRect = win.getBoundingClientRect();
    var maxX = deskRect.width - winRect.width;
    var maxY = deskRect.height - winRect.height;

    win.style.left = clamp(x, 0, Math.max(maxX, 0)) + 'px';
    win.style.top = clamp(y, 0, Math.max(maxY, 0)) + 'px';
  }

  bar.addEventListener('pointerdown', function (e) {
    dragging = true;
    win.classList.add('win--dragging');
    win.setPointerCapture(e.pointerId);

    var deskRect = desk.getBoundingClientRect();
    var winRect = win.getBoundingClientRect();
    offsetX = e.clientX - winRect.left;
    offsetY = e.clientY - winRect.top;
    void deskRect;
  });

  bar.addEventListener('pointermove', function (e) {
    if (!dragging) return;

    var deskRect = desk.getBoundingClientRect();
    var x = e.clientX - deskRect.left - offsetX;
    var y = e.clientY - deskRect.top - offsetY;
    setPosition(x, y);
  });

  function stopDrag(e) {
    if (!dragging) return;
    dragging = false;
    win.classList.remove('win--dragging');
    if (e && win.hasPointerCapture && win.hasPointerCapture(e.pointerId)) {
      win.releasePointerCapture(e.pointerId);
    }
  }

  bar.addEventListener('pointerup', stopDrag);
  bar.addEventListener('pointercancel', stopDrag);

  win.addEventListener('pointerdown', function () {
    win.style.zIndex = 10;
  });
})();
