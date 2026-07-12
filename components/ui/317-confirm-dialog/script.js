(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var trigger = document.querySelector('[data-open]');
  var overlay = document.querySelector('[data-overlay]');
  var dialog = overlay ? overlay.querySelector('.confirmdlg-dialog') : null;
  var cancelBtn = overlay ? overlay.querySelector('[data-cancel]') : null;
  var confirmBtn = overlay ? overlay.querySelector('[data-confirm]') : null;

  if (!trigger || !overlay || !dialog) return;

  var lastFocused = null;

  function getFocusable() {
    return Array.prototype.slice.call(
      dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
  }

  function openDialog() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    // force reflow so the transition triggers
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    document.addEventListener('keydown', onKeydown, true);
    overlay.addEventListener('mousedown', onOverlayMousedown);

    var focusTarget = dialog;
    dialog.focus();

    if (reduceMotion) {
      return;
    }
  }

  function closeDialog() {
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown, true);
    overlay.removeEventListener('mousedown', onOverlayMousedown);

    var finish = function () {
      overlay.hidden = true;
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    };

    if (reduceMotion) {
      finish();
      return;
    }

    window.setTimeout(finish, 200);
  }

  function onOverlayMousedown(e) {
    if (e.target === overlay) {
      closeDialog();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  trigger.addEventListener('click', openDialog);
  if (cancelBtn) cancelBtn.addEventListener('click', closeDialog);
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      // real action would fire here; for the demo we just close and
      // return focus, same as a successful destructive confirm.
      closeDialog();
    });
  }
})();
