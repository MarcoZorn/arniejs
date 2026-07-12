(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('ppOpenBtn');
  var overlay = document.getElementById('ppOverlay');
  var modal = document.getElementById('ppModal');
  var closeBtn = document.getElementById('ppClose');
  var cancelBtn = document.getElementById('ppCancel');
  var printBtn = document.getElementById('ppPrint');

  var isOpen = false;
  var lastFocused = null;

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    document.addEventListener('keydown', onKeydown, true);

    if (reduceMotion) {
      closeBtn.focus();
    } else {
      window.setTimeout(function () {
        closeBtn.focus();
      }, 150);
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown, true);

    var finish = function () {
      overlay.hidden = true;
    };
    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 220);
    }

    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = modal.querySelectorAll('button');
      focusable = Array.prototype.slice.call(focusable);
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

  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) close();
  });

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);

  printBtn.addEventListener('click', function () {
    window.print();
  });
})();
