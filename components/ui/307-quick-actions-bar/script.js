(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar = document.querySelector('.qab-bar');
  var note = document.getElementById('qabNote');
  if (!bar || !note) return;

  var actions = Array.prototype.slice.call(bar.querySelectorAll('.qab-action'));
  var labels = {
    search: 'Search opened',
    'new-item': 'New item started',
    filter: 'Filter panel opened',
    archive: 'Item archived',
    share: 'Share dialog opened'
  };
  var pressTimer = null;

  function fire(btn) {
    var action = btn.getAttribute('data-action');
    note.textContent = (labels[action] || 'Action triggered') + '.';
    btn.classList.add('is-pressed');
    window.clearTimeout(pressTimer);
    pressTimer = window.setTimeout(function () {
      btn.classList.remove('is-pressed');
    }, 260);

    if (reduceMotion) return;
    btn.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
      { duration: 180, easing: 'ease-out' }
    );
  }

  actions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      fire(btn);
    });
  });

  // Parse each button's data-combo (e.g. "mod+shift+s") into a matcher and
  // listen globally so the shortcuts work no matter what has focus.
  function comboMatches(combo, event) {
    var parts = combo.split('+');
    var key = parts[parts.length - 1];
    var needsMod = parts.indexOf('mod') !== -1;
    var needsShift = parts.indexOf('shift') !== -1;
    var mod = event.metaKey || event.ctrlKey;

    if (needsMod && !mod) return false;
    if (!needsMod && mod) return false;
    if (needsShift && !event.shiftKey) return false;
    if (!needsShift && event.shiftKey) return false;

    return event.key.toLowerCase() === key.toLowerCase();
  }

  document.addEventListener('keydown', function (event) {
    for (var i = 0; i < actions.length; i++) {
      var combo = actions[i].getAttribute('data-combo');
      if (combo && comboMatches(combo, event)) {
        event.preventDefault();
        fire(actions[i]);
        return;
      }
    }
  });
})();
