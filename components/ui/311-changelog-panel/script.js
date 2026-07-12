(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var trigger = document.getElementById('clpTrigger');
  var panel = document.getElementById('clpPanel');
  var backdrop = document.getElementById('clpBackdrop');
  var closeBtn = document.getElementById('clpClose');
  var dot = document.getElementById('clpDot');
  if (!trigger || !panel || !backdrop || !closeBtn) return;

  var lastFocused = null;

  function getFocusable() {
    return Array.prototype.slice.call(
      panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled; });
  }

  function openPanel() {
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    panel.hidden = false;
    // force reflow so the transition runs
    void panel.offsetWidth;
    backdrop.classList.add('is-visible');
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    if (dot) dot.hidden = true;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown, true);
  }

  function closePanel() {
    backdrop.classList.remove('is-visible');
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown, true);

    var finish = function () {
      panel.hidden = true;
      backdrop.hidden = true;
    };

    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 300);
    }

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    } else {
      trigger.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
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

  trigger.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);
})();
