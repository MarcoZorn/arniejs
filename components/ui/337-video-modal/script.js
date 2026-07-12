(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('vmOpen');
  var backdrop = document.getElementById('vmBackdrop');
  var modal = document.getElementById('vmModal');
  var closeBtn = document.getElementById('vmClose');
  var video = document.getElementById('vmVideo');

  if (reduceMotion) {
    modal.style.transition = 'none';
    backdrop.style.transition = 'none';
  }

  var lastFocused = null;

  function focusableEls() {
    return Array.prototype.slice.call(
      modal.querySelectorAll('button, [href], input, select, textarea, video, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var items = focusableEls();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    trapFocus(e);
  }

  function openModal() {
    lastFocused = document.activeElement;
    backdrop.classList.add('visible');
    modal.classList.add('open');
    document.addEventListener('keydown', onKeydown);
    window.setTimeout(function () {
      closeBtn.focus();
    }, reduceMotion ? 0 : 60);
  }

  function closeModal() {
    backdrop.classList.remove('visible');
    modal.classList.remove('open');
    document.removeEventListener('keydown', onKeydown);

    // Always stop playback so audio/video doesn't keep running in the background.
    if (video) {
      video.pause();
    }

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
})();
