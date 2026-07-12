(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('kspOpen');
  var closeBtn = document.getElementById('kspClose');
  var overlay = document.getElementById('kspOverlay');
  var panel = document.getElementById('kspPanel');
  if (!openBtn || !closeBtn || !overlay || !panel) return;

  var lastFocused = null;

  function focusableElements() {
    return Array.prototype.slice.call(
      panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) {
      return el.offsetParent !== null;
    });
  }

  function openPanel() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKeydown, true);
    overlay.addEventListener('mousedown', onOverlayClick);
    var delay = reduceMotion ? 0 : 10;
    window.setTimeout(function () {
      panel.focus();
    }, delay);
  }

  function closePanel() {
    overlay.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown, true);
    overlay.removeEventListener('mousedown', onOverlayClick);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    } else {
      openBtn.focus();
    }
  }

  function onOverlayClick(event) {
    if (event.target === overlay) {
      closePanel();
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePanel();
      return;
    }
    if (event.key === 'Tab') {
      var items = focusableElements();
      if (items.length === 0) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  openBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  // Global "?" key opens the panel, unless the user is typing somewhere.
  document.addEventListener('keydown', function (event) {
    if (overlay.hidden === false) return;
    if (event.key !== '?') return;

    var target = event.target;
    var tag = target && target.tagName ? target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || (target && target.isContentEditable)) return;

    event.preventDefault();
    openPanel();
  });
})();
