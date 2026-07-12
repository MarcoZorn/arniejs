(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage = document.getElementById('kkd-stage');
  var display = document.getElementById('kkd-display');
  var placeholder = document.getElementById('kkd-placeholder');
  var metaKeyEl = document.getElementById('kkd-meta-key');
  var metaCodeEl = document.getElementById('kkd-meta-code');
  var history = document.getElementById('kkd-history');

  var SPECIAL_LABELS = {
    ' ': 'Space',
    'Spacebar': 'Space',
    'Escape': 'Esc',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Enter': 'Enter',
    'Tab': 'Tab',
    'Backspace': 'Backspace',
    'Delete': 'Delete',
    'CapsLock': 'Caps Lock',
    'Control': 'Ctrl',
    'Shift': 'Shift',
    'Alt': 'Alt',
    'Meta': 'Meta',
    'PageUp': 'Page Up',
    'PageDown': 'Page Down',
    'Home': 'Home',
    'End': 'End'
  };

  var MODIFIER_KEYS = { Control: true, Shift: true, Alt: true, Meta: true };

  function labelFor(key) {
    if (SPECIAL_LABELS.hasOwnProperty(key)) return SPECIAL_LABELS[key];
    if (key.length === 1) return key.toUpperCase();
    return key;
  }

  function buildCombo(evt) {
    var parts = [];
    if (evt.ctrlKey) parts.push({ label: 'Ctrl', mod: true });
    if (evt.altKey) parts.push({ label: 'Alt', mod: true });
    if (evt.shiftKey) parts.push({ label: 'Shift', mod: true });
    if (evt.metaKey) parts.push({ label: 'Meta', mod: true });

    if (!MODIFIER_KEYS[evt.key]) {
      parts.push({ label: labelFor(evt.key), mod: false });
    }

    return parts;
  }

  function render(evt) {
    var parts = buildCombo(evt);
    if (!parts.length) return;

    display.innerHTML = '';
    parts.forEach(function (part, i) {
      if (i > 0) {
        var plus = document.createElement('span');
        plus.className = 'kkd-plus';
        plus.textContent = '+';
        display.appendChild(plus);
      }
      var kbd = document.createElement('kbd');
      kbd.className = 'kkd-key' + (part.mod ? ' kkd-key--mod' : '');
      kbd.textContent = part.label;
      display.appendChild(kbd);
    });

    metaKeyEl.textContent = evt.key === ' ' ? '" "' : evt.key;
    metaCodeEl.textContent = evt.code || '—';

    var comboText = parts.map(function (p) { return p.label; }).join(' + ');
    var entry = document.createElement('li');
    entry.textContent = comboText + '  (code: ' + (evt.code || '—') + ')';
    history.insertBefore(entry, history.firstChild);
    while (history.children.length > 6) {
      history.removeChild(history.lastChild);
    }
  }

  stage.addEventListener('keydown', function (evt) {
    // Prevent page scroll for space/arrow keys while the stage is focused.
    if (evt.key === ' ' || evt.key.indexOf('Arrow') === 0) {
      evt.preventDefault();
    }
    render(evt);
  });

  stage.addEventListener('click', function () {
    stage.focus();
  });

  stage.addEventListener('focus', function () {
    stage.style.borderColor = '';
  });
})();
