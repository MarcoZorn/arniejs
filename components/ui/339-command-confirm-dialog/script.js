(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('ccOpen');
  var backdrop = document.getElementById('ccBackdrop');
  var modal = document.getElementById('ccModal');
  var cancelBtn = document.getElementById('ccCancel');
  var confirmBtn = document.getElementById('ccConfirm');
  var input = document.getElementById('ccInput');
  var phraseEl = document.getElementById('ccPhrase');
  var status = document.getElementById('ccStatus');

  if (reduceMotion) {
    modal.style.transition = 'none';
    backdrop.style.transition = 'none';
  }

  var REQUIRED_PHRASE = phraseEl.textContent.trim();
  var lastFocused = null;
  var statusTimer = null;

  function focusableEls() {
    return Array.prototype.slice.call(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
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

  function resetInput() {
    input.value = '';
    confirmBtn.disabled = true;
  }

  function openModal() {
    lastFocused = document.activeElement;
    resetInput();
    status.textContent = '';
    backdrop.classList.add('visible');
    modal.classList.add('open');
    document.addEventListener('keydown', onKeydown);
    window.setTimeout(function () {
      input.focus();
    }, reduceMotion ? 0 : 80);
  }

  function closeModal() {
    backdrop.classList.remove('visible');
    modal.classList.remove('open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  openBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  input.addEventListener('input', function () {
    confirmBtn.disabled = input.value !== REQUIRED_PHRASE;
  });

  confirmBtn.addEventListener('click', function () {
    if (confirmBtn.disabled) return;
    status.textContent = 'Plot "north-terrace" deleted.';
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      closeModal();
    }, 900);
  });
})();
