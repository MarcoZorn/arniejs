(function () {
  var flags = [
    { key: 'new-checkout-flow', name: 'New checkout flow', enabled: true, rollout: 100 },
    { key: 'dark-mode-v2', name: 'Dark mode v2', enabled: true, rollout: 40 },
    { key: 'ai-suggestions', name: 'AI suggestions', enabled: false, rollout: 10 },
    { key: 'bulk-export', name: 'Bulk export', enabled: false, rollout: 0 },
    { key: 'realtime-sync', name: 'Realtime sync', enabled: true, rollout: 75 }
  ];

  var listEl = document.getElementById('fflList');
  var countEl = document.getElementById('fflCount');
  var jsonEl = document.getElementById('fflJson');

  function clamp(n) {
    if (isNaN(n)) return 0;
    return Math.min(100, Math.max(0, Math.round(n)));
  }

  function renderSummary() {
    var enabledCount = flags.filter(function (f) { return f.enabled; }).length;
    countEl.textContent = enabledCount + ' of ' + flags.length + ' flags enabled';
    var state = {};
    flags.forEach(function (f) {
      state[f.key] = { enabled: f.enabled, rollout: f.rollout };
    });
    jsonEl.textContent = JSON.stringify(state, null, 2);
  }

  function buildRow(flag) {
    var li = document.createElement('li');
    li.className = 'ffl-row';

    var nameWrap = document.createElement('div');
    nameWrap.className = 'ffl-name';
    var nameSpan = document.createElement('span');
    nameSpan.textContent = flag.name;
    var keySpan = document.createElement('span');
    keySpan.className = 'ffl-name-key';
    keySpan.textContent = flag.key;
    nameWrap.appendChild(nameSpan);
    nameWrap.appendChild(keySpan);

    var switchLabel = document.createElement('label');
    switchLabel.className = 'ffl-switch';
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = flag.enabled;
    checkbox.setAttribute('aria-label', 'Toggle ' + flag.name);
    var track = document.createElement('span');
    track.className = 'ffl-switch-track';
    switchLabel.appendChild(checkbox);
    switchLabel.appendChild(track);

    var rolloutWrap = document.createElement('div');
    rolloutWrap.className = 'ffl-rollout';
    var rolloutLabel = document.createElement('label');
    rolloutLabel.textContent = 'Rollout';
    rolloutLabel.setAttribute('for', 'rollout-' + flag.key);
    var rolloutInput = document.createElement('input');
    rolloutInput.type = 'number';
    rolloutInput.min = '0';
    rolloutInput.max = '100';
    rolloutInput.id = 'rollout-' + flag.key;
    rolloutInput.value = flag.rollout;
    var pct = document.createElement('span');
    pct.className = 'ffl-pct';
    pct.textContent = '%';
    rolloutWrap.appendChild(rolloutLabel);
    rolloutWrap.appendChild(rolloutInput);
    rolloutWrap.appendChild(pct);

    checkbox.addEventListener('change', function () {
      flag.enabled = checkbox.checked;
      renderSummary();
    });

    rolloutInput.addEventListener('input', function () {
      var value = clamp(parseInt(rolloutInput.value, 10));
      flag.rollout = value;
      renderSummary();
    });

    rolloutInput.addEventListener('blur', function () {
      rolloutInput.value = flag.rollout;
    });

    li.appendChild(nameWrap);
    li.appendChild(switchLabel);
    li.appendChild(rolloutWrap);
    return li;
  }

  flags.forEach(function (flag) {
    listEl.appendChild(buildRow(flag));
  });

  renderSummary();
})();
