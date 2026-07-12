(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var body = document.getElementById('logc-body');
  var autoscrollToggle = document.getElementById('logc-autoscroll');
  var clearBtn = document.getElementById('logc-clear');
  var countEl = document.getElementById('logc-count');
  var liveEl = document.getElementById('logc-live');
  if (!body || !autoscrollToggle || !clearBtn) return;

  var seedLines = [
    { t: '08:12:01', level: 'info', msg: 'greenhouse-core booted in 412ms, config loaded from /etc/greenhouse.yml' },
    { t: '08:12:02', level: 'info', msg: 'zone-1 irrigation controller connected (fw 2.3.1)' },
    { t: '08:12:02', level: 'info', msg: 'zone-2 irrigation controller connected (fw 2.3.1)' },
    { t: '08:12:04', level: 'debug', msg: 'sensor sweep started for 24 nodes' },
    { t: '08:12:05', level: 'info', msg: 'soil moisture zone-1: 38% (target 40-55%)' },
    { t: '08:12:06', level: 'warn', msg: 'soil moisture zone-3 below threshold: 21% (target 40-55%)' },
    { t: '08:12:06', level: 'info', msg: 'scheduling irrigation pulse on zone-3, duration 6min' },
    { t: '08:12:09', level: 'debug', msg: 'valve-07 opened, flow rate 4.2L/min' },
    { t: '08:12:14', level: 'info', msg: 'ambient temp reading: 22.4C / humidity 61%' },
    { t: '08:12:20', level: 'error', msg: 'sensor node-19 timeout after 3 retries, marking offline' },
    { t: '08:12:21', level: 'warn', msg: 'zone-4 canopy sensor reporting stale data (last update 14min ago)' },
    { t: '08:12:26', level: 'info', msg: 'valve-07 closed, total dispensed 25.1L' },
    { t: '08:12:31', level: 'debug', msg: 'sensor sweep completed, 23/24 nodes responsive' },
    { t: '08:12:33', level: 'info', msg: 'nutrient dosing pump idle, tank level at 78%' },
    { t: '08:12:40', level: 'warn', msg: 'CO2 concentration trending high in zone-2: 1180ppm' },
    { t: '08:12:47', level: 'info', msg: 'vent controller opened intake 12% on zone-2' },
    { t: '08:12:55', level: 'error', msg: 'failed to sync historical log batch to archive (connection refused)' },
    { t: '08:13:02', level: 'info', msg: 'retrying archive sync, attempt 2/5' }
  ];

  var liveMessages = [
    { level: 'info', msg: 'soil moisture zone-1: {n}% (target 40-55%)', n: function () { return 34 + Math.floor(Math.random() * 20); } },
    { level: 'debug', msg: 'heartbeat ok, uptime {n}h', n: function () { return 4 + Math.floor(Math.random() * 40); } },
    { level: 'info', msg: 'ambient temp reading: {n}C / humidity {m}%', n: function () { return (20 + Math.random() * 5).toFixed(1); }, m: function () { return 50 + Math.floor(Math.random() * 20); } },
    { level: 'warn', msg: 'zone-{n} light sensor drifting, recalibration recommended', n: function () { return 1 + Math.floor(Math.random() * 5); } },
    { level: 'info', msg: 'nutrient dosing cycle complete on zone-{n}', n: function () { return 1 + Math.floor(Math.random() * 5); } },
    { level: 'error', msg: 'sensor node-{n} timeout after 3 retries, marking offline', n: function () { return 10 + Math.floor(Math.random() * 20); } },
    { level: 'debug', msg: 'sensor sweep started for 24 nodes' },
    { level: 'info', msg: 'valve-{n} opened, flow rate {m}L/min', n: function () { return String(1 + Math.floor(Math.random() * 9)).padStart(2, '0'); }, m: function () { return (2 + Math.random() * 5).toFixed(1); } }
  ];

  var count = 0;

  function fmtTime(d) {
    function pad(x) { return String(x).padStart(2, '0'); }
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function appendLine(t, level, msg, animate) {
    var row = document.createElement('div');
    row.className = 'logc-line' + (animate ? ' logc-line--new' : '');
    row.setAttribute('data-level', level);

    var timeSpan = document.createElement('span');
    timeSpan.className = 'logc-line-time';
    timeSpan.textContent = t;

    var levelSpan = document.createElement('span');
    levelSpan.className = 'logc-line-level';
    levelSpan.textContent = level.toUpperCase();

    var msgSpan = document.createElement('span');
    msgSpan.className = 'logc-line-msg';
    msgSpan.textContent = msg;

    row.appendChild(timeSpan);
    row.appendChild(levelSpan);
    row.appendChild(msgSpan);
    body.appendChild(row);

    count += 1;
    if (countEl) countEl.textContent = count + (count === 1 ? ' line' : ' lines');

    if (autoscrollToggle.checked) {
      body.scrollTop = body.scrollHeight;
    }
  }

  // Seed initial lines (no entrance animation, they are "already there")
  seedLines.forEach(function (line) {
    appendLine(line.t, line.level, line.msg, false);
  });
  body.scrollTop = body.scrollHeight;

  // Clear button empties the log.
  clearBtn.addEventListener('click', function () {
    body.innerHTML = '';
    count = 0;
    if (countEl) countEl.textContent = '0 lines';
  });

  // Periodically push new log lines, respecting autoscroll toggle.
  var timer = window.setInterval(function () {
    var template = liveMessages[Math.floor(Math.random() * liveMessages.length)];
    var msg = template.msg
      .replace('{n}', template.n ? template.n() : '')
      .replace('{m}', template.m ? template.m() : '');
    appendLine(fmtTime(new Date()), template.level, msg, !reduceMotion);

    // Cap the log so the DOM doesn't grow unbounded.
    while (body.children.length > 500) {
      body.removeChild(body.firstChild);
    }
  }, 2200);

  // Pause the "streaming" indicator (visual only) when the tab is hidden,
  // but keep the interval running so counts stay accurate.
  document.addEventListener('visibilitychange', function () {
    if (!liveEl) return;
    liveEl.classList.toggle('is-paused', document.hidden);
    liveEl.textContent = document.hidden ? '● backgrounded' : '● streaming';
  });

  window.addEventListener('beforeunload', function () {
    window.clearInterval(timer);
  });
})();
