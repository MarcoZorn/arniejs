(function () {
  var panel = document.getElementById('hotkeyPanel');
  var keysDisplay = document.getElementById('hotkeyKeys');
  var logList = document.getElementById('hotkeyLog');
  var clearBtn = document.getElementById('clearLog');

  var KEY_LABELS = {
    ' ': 'Space',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Escape': 'Esc',
    'Control': 'Ctrl',
    'Meta': '⌘',
    'Alt': 'Alt',
    'Shift': 'Shift'
  };

  var MODIFIER_KEYS = ['Control', 'Meta', 'Alt', 'Shift'];

  function labelFor(key) {
    if (KEY_LABELS[key]) return KEY_LABELS[key];
    if (key.length === 1) return key.toUpperCase();
    return key;
  }

  function renderChips(parts) {
    keysDisplay.innerHTML = '';
    parts.forEach(function (part, i) {
      if (i > 0) {
        var plus = document.createElement('span');
        plus.className = 'hotkey-plus';
        plus.textContent = '+';
        keysDisplay.appendChild(plus);
      }
      var chip = document.createElement('span');
      chip.className = 'hotkey-chip';
      chip.textContent = part;
      keysDisplay.appendChild(chip);
    });
  }

  function logPress(comboText) {
    var emptyMsg = logList.querySelector('.hotkey-log__empty');
    if (emptyMsg) emptyMsg.remove();

    var item = document.createElement('li');
    var combo = document.createElement('span');
    combo.className = 'hotkey-log__combo';
    combo.textContent = comboText;
    var time = document.createElement('span');
    time.className = 'hotkey-log__time';
    time.textContent = new Date().toLocaleTimeString();
    item.appendChild(combo);
    item.appendChild(time);
    logList.insertBefore(item, logList.firstChild);

    while (logList.children.length > 8) {
      logList.removeChild(logList.lastChild);
    }
  }

  function showEmptyLog() {
    logList.innerHTML = '<li class="hotkey-log__empty">No key presses yet</li>';
  }

  panel.addEventListener('keydown', function (e) {
    if (MODIFIER_KEYS.indexOf(e.key) !== -1) {
      // still show modifier alone while held
      renderChips([labelFor(e.key)]);
      return;
    }

    e.preventDefault();

    var parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.metaKey) parts.push('⌘');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    parts.push(labelFor(e.key));

    renderChips(parts);
    logPress(parts.join(' + '));
  });

  panel.addEventListener('click', function () {
    panel.focus();
  });

  clearBtn.addEventListener('click', function () {
    showEmptyLog();
  });

  showEmptyLog();
})();
