(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('openSheet');
  var backdrop = document.getElementById('sheetBackdrop');
  var sheet = document.getElementById('sheet');
  var handle = document.getElementById('sheetHandle');
  var closeBtn = document.getElementById('sheetClose');

  var dragging = false;
  var startY = 0;
  var currentY = 0;
  var sheetHeight = 0;

  function openSheet() {
    backdrop.classList.add('visible');
    sheet.classList.add('open');
    document.addEventListener('keydown', onKeydown);
  }

  function closeSheet() {
    backdrop.classList.remove('visible');
    sheet.classList.remove('open');
    sheet.style.transform = '';
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeSheet();
  }

  openBtn.addEventListener('click', openSheet);
  closeBtn.addEventListener('click', closeSheet);
  backdrop.addEventListener('click', closeSheet);

  function pointerDown(e) {
    dragging = true;
    sheet.classList.add('dragging');
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    sheetHeight = sheet.offsetHeight;
    document.addEventListener('mousemove', pointerMove);
    document.addEventListener('touchmove', pointerMove, { passive: false });
    document.addEventListener('mouseup', pointerUp);
    document.addEventListener('touchend', pointerUp);
  }

  function pointerMove(e) {
    if (!dragging) return;
    var y = (e.touches ? e.touches[0].clientY : e.clientY);
    currentY = Math.max(0, y - startY);
    if (e.cancelable) e.preventDefault();
    sheet.style.transform = 'translateY(' + currentY + 'px)';
  }

  function pointerUp() {
    if (!dragging) return;
    dragging = false;
    sheet.classList.remove('dragging');
    document.removeEventListener('mousemove', pointerMove);
    document.removeEventListener('touchmove', pointerMove);
    document.removeEventListener('mouseup', pointerUp);
    document.removeEventListener('touchend', pointerUp);

    if (currentY > sheetHeight * 0.25) {
      closeSheet();
    } else {
      sheet.style.transform = '';
    }
    currentY = 0;
  }

  handle.addEventListener('mousedown', pointerDown);
  handle.addEventListener('touchstart', pointerDown, { passive: true });

  if (reduceMotion) {
    sheet.style.transition = 'none';
    backdrop.style.transition = 'none';
  }
})();
