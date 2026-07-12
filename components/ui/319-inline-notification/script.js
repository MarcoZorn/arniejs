(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var slot = document.querySelector('[data-slot]');
  var note = document.querySelector('[data-note]');
  var closeBtn = document.querySelector('[data-dismiss]');
  var restoreBtn = document.querySelector('[data-restore]');

  if (!slot || !note || !closeBtn || !restoreBtn) return;

  function collapse() {
    // Pin the current height first so the transition has something to animate from.
    var startHeight = slot.getBoundingClientRect().height;
    slot.style.maxHeight = startHeight + 'px';
    void slot.offsetHeight;

    slot.classList.add('is-collapsed');

    if (reduceMotion) {
      finishCollapse();
      return;
    }

    slot.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'max-height') return;
      slot.removeEventListener('transitionend', handler);
      finishCollapse();
    });
  }

  function finishCollapse() {
    note.hidden = true;
    restoreBtn.hidden = false;
    restoreBtn.focus();
  }

  function expand() {
    note.hidden = false;
    restoreBtn.hidden = true;
    slot.classList.remove('is-collapsed');

    var targetHeight = slot.scrollHeight;
    slot.style.maxHeight = targetHeight + 'px';

    var cleanup = function () {
      slot.style.maxHeight = '';
      slot.removeEventListener('transitionend', onEnd);
    };

    function onEnd(e) {
      if (e.propertyName !== 'max-height') return;
      cleanup();
    }

    if (reduceMotion) {
      cleanup();
      return;
    }

    slot.addEventListener('transitionend', onEnd);
    closeBtn.focus();
  }

  closeBtn.addEventListener('click', collapse);
  restoreBtn.addEventListener('click', expand);
})();
