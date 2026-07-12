(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('drawerOpen');
  var backdrop = document.getElementById('drawerBackdrop');
  var panel = document.getElementById('drawerPanel');
  var closeX = document.getElementById('drawerX');
  var cancelBtn = document.getElementById('drawerCancel');
  var form = document.getElementById('drawerForm');
  var success = document.getElementById('drawerSuccess');

  if (!openBtn || !backdrop || !panel) return;

  var lastFocused = null;
  var isOpen = false;
  var successTimer = null;

  function getFocusable() {
    return Array.prototype.slice.call(
      panel.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
    );
  }

  function trapTab(e) {
    if (e.key !== 'Tab') return;
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

  function openDrawer() {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;

    backdrop.hidden = false;
    panel.classList.add('is-open');
    void panel.offsetWidth;
    backdrop.classList.add('is-open');

    window.setTimeout(function () {
      panel.focus();
    }, reduceMotion ? 0 : 60);

    document.addEventListener('keydown', onKeydown);
  }

  function closeDrawer() {
    if (!isOpen) return;
    isOpen = false;

    backdrop.classList.remove('is-open');
    panel.classList.remove('is-open');

    var finish = function () {
      backdrop.hidden = true;
    };
    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 280);
    }

    document.removeEventListener('keydown', onKeydown);

    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDrawer();
      return;
    }
    trapTab(e);
  }

  openBtn.addEventListener('click', openDrawer);
  closeX.addEventListener('click', closeDrawer);
  cancelBtn.addEventListener('click', closeDrawer);

  backdrop.addEventListener('mousedown', function (e) {
    if (e.target === backdrop) closeDrawer();
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (success) {
        success.textContent = 'Bed saved. Your plot is growing.';
        window.clearTimeout(successTimer);
      }
      window.setTimeout(function () {
        closeDrawer();
        if (success) {
          successTimer = window.setTimeout(function () {
            success.textContent = '';
          }, 400);
          form.reset();
        }
      }, reduceMotion ? 150 : 500);
    });
  }
})();
