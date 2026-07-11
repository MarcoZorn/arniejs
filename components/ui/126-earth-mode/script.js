(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('earthToggle');
  var label = document.getElementById('toggleLabel');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STORAGE_KEY = 'earth-mode-theme';
  var stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    stored = null;
  }

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var initial = stored || (prefersDark ? 'night' : 'day');

  function applyTheme(theme, animate) {
    root.setAttribute('data-theme', theme);
    var isNight = theme === 'night';
    toggle.setAttribute('aria-checked', String(isNight));
    label.textContent = isNight ? 'Night' : 'Day';

    if (!animate || reduceMotion) {
      return;
    }
  }

  applyTheme(initial, false);

  toggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') === 'night' ? 'night' : 'day';
    var next = current === 'night' ? 'day' : 'night';
    applyTheme(next, true);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* ignore storage failures */
    }
  });

  toggle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle.click();
    }
  });
})();
