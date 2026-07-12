(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORAGE_KEY = 'arniejs-announce-431-dismissed';

  var bar = document.getElementById('announceBar');
  var dismissBtn = document.getElementById('announceDismiss');
  var resetBtn = document.getElementById('announceReset');
  var demoLink = document.querySelector('[data-demo-link]');

  if (!bar || !dismissBtn) return;

  function isDismissed() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setDismissed(value) {
    try {
      if (value) {
        window.sessionStorage.setItem(STORAGE_KEY, '1');
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      /* sessionStorage unavailable, ignore */
    }
  }

  function applyDismissedState(instant) {
    if (instant) {
      var prevTransition = bar.style.transition;
      bar.style.transition = 'none';
      bar.classList.add('is-dismissed');
      // Force reflow so the "none" transition actually applies before restoring.
      void bar.offsetHeight;
      bar.style.transition = prevTransition;
    } else {
      bar.classList.add('is-dismissed');
    }
  }

  // Check on load and hide immediately (no animation) if already dismissed this session.
  if (isDismissed()) {
    applyDismissedState(true);
  }

  dismissBtn.addEventListener('click', function () {
    bar.classList.add('is-dismissed');
    setDismissed(true);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      setDismissed(false);
      bar.classList.remove('is-dismissed');
    });
  }

  if (demoLink) {
    demoLink.addEventListener('click', function (e) {
      e.preventDefault();
    });
  }
})();
