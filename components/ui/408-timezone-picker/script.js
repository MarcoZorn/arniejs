(function () {
  var ZONES = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Sao_Paulo',
    'America/Mexico_City',
    'America/Toronto',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Moscow',
    'Europe/Istanbul',
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Seoul',
    'Australia/Sydney',
    'Australia/Perth',
    'Pacific/Auckland'
  ];

  var searchInput = document.getElementById('tzpSearch');
  var listEl = document.getElementById('tzpList');
  var clockCard = document.getElementById('tzpClockCard');
  var clockZone = document.getElementById('tzpClockZone');
  var clockTime = document.getElementById('tzpClockTime');
  var clockDate = document.getElementById('tzpClockDate');

  var activeZone = null;
  var tickTimer = null;

  function getOffsetLabel(zone) {
    try {
      var dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'shortOffset'
      });
      var parts = dtf.formatToParts(new Date());
      var offsetPart = parts.filter(function (p) { return p.type === 'timeZoneName'; })[0];
      return offsetPart ? offsetPart.value : '';
    } catch (e) {
      return '';
    }
  }

  function renderList(filter) {
    var query = filter.trim().toLowerCase();
    listEl.innerHTML = '';

    var matches = ZONES.filter(function (zone) {
      return zone.toLowerCase().indexOf(query) !== -1;
    });

    if (matches.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'tzp-empty';
      empty.textContent = 'No timezones match "' + filter + '"';
      listEl.appendChild(empty);
      return;
    }

    matches.forEach(function (zone) {
      var li = document.createElement('li');
      li.className = 'tzp-item';
      li.setAttribute('role', 'option');
      li.dataset.zone = zone;
      if (zone === activeZone) li.classList.add('is-active');

      var name = document.createElement('span');
      name.textContent = zone.replace(/_/g, ' ');

      var offset = document.createElement('span');
      offset.className = 'tzp-item-offset';
      offset.textContent = getOffsetLabel(zone);

      li.appendChild(name);
      li.appendChild(offset);

      li.addEventListener('click', function () {
        selectZone(zone);
      });

      listEl.appendChild(li);
    });
  }

  function selectZone(zone) {
    activeZone = zone;
    clockCard.hidden = false;
    clockZone.textContent = zone.replace(/_/g, ' ');

    renderList(searchInput.value);
    tick();

    if (tickTimer) window.clearInterval(tickTimer);
    tickTimer = window.setInterval(tick, 1000);
  }

  function tick() {
    if (!activeZone) return;

    var now = new Date();

    var timeFmt = new Intl.DateTimeFormat('en-US', {
      timeZone: activeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    var dateFmt = new Intl.DateTimeFormat('en-US', {
      timeZone: activeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    clockTime.textContent = timeFmt.format(now);
    clockDate.textContent = dateFmt.format(now);
  }

  searchInput.addEventListener('input', function () {
    renderList(searchInput.value);
  });

  renderList('');
  selectZone('UTC');
})();
