(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var trigger = document.getElementById('bsnTrigger');
  var backdrop = document.getElementById('bsnBackdrop');
  var sheet = document.getElementById('bsnSheet');
  var handleArea = document.getElementById('bsnHandleArea');
  var closeBtn = document.getElementById('bsnClose');
  if (!trigger || !backdrop || !sheet || !handleArea || !closeBtn) return;

  var isOpen = false;
  var dragging = false;
  var startY = 0;
  var currentTranslate = 0;
  var sheetHeight = 0;

  function openSheet() {
    isOpen = true;
    backdrop.hidden = false;
    sheet.hidden = false;
    // Force reflow so the transition from translateY(100%) actually runs.
    void sheet.offsetHeight;
    backdrop.classList.add('is-visible');
    sheet.classList.add('is-open');
    sheet.style.transform = '';
    trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKeydown);
    sheet.focus();
  }

  function closeSheet() {
    isOpen = false;
    backdrop.classList.remove('is-visible');
    sheet.classList.remove('is-open');
    sheet.style.transform = '';
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    trigger.focus();

    var finish = function () {
      if (!isOpen) {
        backdrop.hidden = true;
        sheet.hidden = true;
      }
    };

    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 300);
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      closeSheet();
    }
  }

  trigger.addEventListener('click', openSheet);
  closeBtn.addEventListener('click', closeSheet);
  backdrop.addEventListener('click', closeSheet);

  function onPointerDown(event) {
    dragging = true;
    startY = event.clientY;
    currentTranslate = 0;
    sheetHeight = sheet.getBoundingClientRect().height;
    sheet.classList.add('is-dragging');
    handleArea.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!dragging) return;
    var delta = event.clientY - startY;
    if (delta < 0) delta = 0;
    currentTranslate = delta;
    sheet.style.transform = 'translateY(' + delta + 'px)';
  }

  function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    sheet.classList.remove('is-dragging');
    if (handleArea.releasePointerCapture) {
      try { handleArea.releasePointerCapture(event.pointerId); } catch (e) {}
    }

    var threshold = sheetHeight * 0.3 || 120;
    if (currentTranslate > threshold) {
      closeSheet();
    } else {
      sheet.style.transform = '';
    }
    currentTranslate = 0;
  }

  handleArea.addEventListener('pointerdown', onPointerDown);
  handleArea.addEventListener('pointermove', onPointerMove);
  handleArea.addEventListener('pointerup', onPointerUp);
  handleArea.addEventListener('pointercancel', onPointerUp);
})();
