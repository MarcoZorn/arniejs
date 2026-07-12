(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tab = document.getElementById('fwTab');
  var panel = document.getElementById('fwPanel');
  var emojiButtons = Array.prototype.slice.call(panel.querySelectorAll('.fw-emoji'));
  var textarea = document.getElementById('fwComment');
  var submitBtn = document.getElementById('fwSubmit');
  var thanks = document.getElementById('fwThanks');

  var isOpen = false;
  var thanksTimer = null;

  function open() {
    if (isOpen) return;
    isOpen = true;
    panel.hidden = false;
    // force reflow so the transition runs
    void panel.offsetWidth;
    panel.classList.add('is-open');
    tab.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-modal', 'true');
    document.addEventListener('keydown', onKeydown, true);
    document.addEventListener('pointerdown', onOutsidePointer, true);

    var focusTarget = emojiButtons[0] || textarea;
    if (reduceMotion) {
      if (focusTarget) focusTarget.focus();
    } else {
      window.setTimeout(function () {
        if (focusTarget) focusTarget.focus();
      }, 120);
    }
  }

  function close(restoreFocus) {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    tab.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-modal', 'false');
    document.removeEventListener('keydown', onKeydown, true);
    document.removeEventListener('pointerdown', onOutsidePointer, true);

    var finish = function () {
      panel.hidden = true;
    };

    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 320);
    }

    if (restoreFocus !== false) tab.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === 'Tab') {
      trapFocus(e);
    }
  }

  function trapFocus(e) {
    var focusable = panel.querySelectorAll('button, textarea, [href], input, select, [tabindex]:not([tabindex="-1"])');
    focusable = Array.prototype.filter.call(focusable, function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
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

  function onOutsidePointer(e) {
    if (!panel.contains(e.target) && e.target !== tab && !tab.contains(e.target)) {
      close(false);
    }
  }

  tab.addEventListener('click', function () {
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  var selectedRating = null;

  emojiButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectedRating = btn.getAttribute('data-value');
      emojiButtons.forEach(function (b) {
        b.setAttribute('aria-checked', b === btn ? 'true' : 'false');
      });
    });
  });

  submitBtn.addEventListener('click', function () {
    // Genuine submission: show confirmation, reset fields, collapse after a beat.
    thanks.textContent = 'Thanks! Your note has been planted.';
    submitBtn.disabled = true;

    window.clearTimeout(thanksTimer);
    thanksTimer = window.setTimeout(function () {
      thanks.textContent = '';
      submitBtn.disabled = false;
      textarea.value = '';
      selectedRating = null;
      emojiButtons.forEach(function (b) {
        b.setAttribute('aria-checked', 'false');
      });
      close();
    }, reduceMotion ? 400 : 1400);
  });
})();
