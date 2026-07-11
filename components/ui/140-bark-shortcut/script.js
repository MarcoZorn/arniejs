(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rows = Array.prototype.slice.call(document.querySelectorAll('.bark-row[data-keys]'));
  var timers = new WeakMap();

  function normalizeKey(event) {
    var key = event.key;
    if (key === ' ') return 'space';
    if (key.length === 1) return key.toLowerCase();
    return key.toLowerCase();
  }

  function buildCombo(event) {
    var parts = [];
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');

    var mainKey = normalizeKey(event);
    var modifierNames = ['control', 'meta', 'alt', 'shift'];
    if (modifierNames.indexOf(mainKey) === -1) {
      parts.push(mainKey);
    }

    return parts.join('+');
  }

  function highlightRow(row) {
    var existingTimer = timers.get(row);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    row.classList.add('pressed');

    var duration = prefersReducedMotion ? 0 : 600;
    var timer = window.setTimeout(function () {
      row.classList.remove('pressed');
      timers.delete(row);
    }, duration || 600);

    timers.set(row, timer);
  }

  function findMatchingRows(combo) {
    return rows.filter(function (row) {
      var primary = row.getAttribute('data-keys');
      var alt = row.getAttribute('data-keys-alt');
      return combo === primary || (alt && combo === alt);
    });
  }

  window.addEventListener('keydown', function (event) {
    var combo = buildCombo(event);
    if (!combo) return;

    var matches = findMatchingRows(combo);
    if (matches.length === 0) return;

    matches.forEach(highlightRow);
  });
})();
