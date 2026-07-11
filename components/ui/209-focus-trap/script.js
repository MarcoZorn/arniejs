(function () {
  var openBtn = document.getElementById('openModal');
  var overlay = document.getElementById('overlay');
  var modal = document.getElementById('modal');
  var closeBtn = document.getElementById('closeModal');
  var cancelBtn = document.getElementById('cancelModal');
  var confirmBtn = document.getElementById('confirmModal');
  var statusLine = document.getElementById('statusLine');
  if (!openBtn || !overlay || !modal || !closeBtn || !cancelBtn || !confirmBtn) return;

  var FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  var lastFocused = null;

  function getFocusable() {
    return Array.prototype.slice
      .call(modal.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter(function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key !== 'Tab') return;

    var focusable = getFocusable();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    var active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || !modal.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !modal.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Belt-and-braces: if focus somehow escapes the modal (e.g. programmatic
  // focus elsewhere), pull it straight back while the trap is active.
  function handleFocusIn(e) {
    if (overlay.hidden) return;
    if (!modal.contains(e.target)) {
      var focusable = getFocusable();
      (focusable[0] || modal).focus();
    }
  }

  function openModal() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('focusin', handleFocusIn, true);

    var focusable = getFocusable();
    (focusable[0] || modal).focus();

    if (statusLine) {
      statusLine.textContent = 'Modal open. Tab cycles within it; Escape or Cancel closes it.';
    }
  }

  function closeModal() {
    overlay.hidden = true;
    document.removeEventListener('keydown', handleKeydown, true);
    document.removeEventListener('focusin', handleFocusIn, true);

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }

    if (statusLine) {
      statusLine.textContent = 'Modal closed. Focus returned to the triggering button.';
    }
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  confirmBtn.addEventListener('click', closeModal);

  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) closeModal();
  });
})();
