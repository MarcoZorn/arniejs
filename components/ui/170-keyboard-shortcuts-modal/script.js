(function () {
  var openBtn = document.getElementById('openModal');
  var closeBtn = document.getElementById('closeModal');
  var overlay = document.getElementById('modalOverlay');
  var modal = document.getElementById('modal');

  if (!openBtn || !closeBtn || !overlay || !modal) return;

  var lastFocused = null;

  function getFocusable() {
    return modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
  }

  function openModal() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
    });
    document.addEventListener('keydown', onKeydown);
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown);

    var finish = function () {
      overlay.hidden = true;
      if (lastFocused) lastFocused.focus();
    };

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      finish();
      return;
    }
    setTimeout(finish, 220);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
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

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '?' && overlay.hidden) {
      openModal();
    }
  });
})();
