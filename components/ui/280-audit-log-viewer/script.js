(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var listEl = document.getElementById('adlv-list');
  var searchInput = document.getElementById('adlv-search');
  var typeWrap = document.getElementById('adlv-type-filters');
  var countEl = document.getElementById('adlv-count');
  var emptyEl = document.getElementById('adlv-empty');
  if (!listEl) return;

  var now = Date.now();
  var MIN = 60 * 1000;

  // minutesAgo is used to build a realistic, ordered timestamp for each entry.
  var RAW_ENTRIES = [
    { minutesAgo: 4, actor: 'priya.anand', type: 'info', message: 'Irrigation schedule updated for Bed 3' },
    { minutesAgo: 11, actor: 'system', type: 'warning', message: 'Soil moisture sensor 7 reporting intermittent signal' },
    { minutesAgo: 22, actor: 'devon.ashworth', type: 'info', message: 'Field report exported for March' },
    { minutesAgo: 38, actor: 'system', type: 'error', message: 'Weather API sync failed after 3 retries' },
    { minutesAgo: 55, actor: 'kenji.osei', type: 'info', message: 'Drip line pressure test completed on Bed 5' },
    { minutesAgo: 74, actor: 'tomas.reyes', type: 'warning', message: 'Pest alert threshold exceeded on Bed 2' },
    { minutesAgo: 96, actor: 'marisol.vega', type: 'info', message: 'New team member Ines Tavares added to Operations' },
    { minutesAgo: 130, actor: 'system', type: 'error', message: 'Automated backup of field logs failed' },
    { minutesAgo: 165, actor: 'priya.anand', type: 'info', message: 'Harvest yield logged for Bed 1 — 84kg' },
    { minutesAgo: 210, actor: 'system', type: 'warning', message: 'Frost warning issued for tonight, row covers recommended' },
    { minutesAgo: 260, actor: 'devon.ashworth', type: 'info', message: 'Crop rotation plan approved for next season' },
    { minutesAgo: 320, actor: 'kenji.osei', type: 'error', message: 'Irrigation controller offline on Bed 4' },
    { minutesAgo: 400, actor: 'tomas.reyes', type: 'info', message: 'Compost delivery received and logged' },
    { minutesAgo: 480, actor: 'system', type: 'info', message: 'Nightly sensor sync completed successfully' },
    { minutesAgo: 560, actor: 'marisol.vega', type: 'warning', message: 'Budget threshold reached for equipment maintenance' },
    { minutesAgo: 650, actor: 'priya.anand', type: 'info', message: 'Seed inventory reconciled for spring planting' },
    { minutesAgo: 740, actor: 'system', type: 'error', message: 'Camera feed lost on north perimeter' },
    { minutesAgo: 820, actor: 'devon.ashworth', type: 'info', message: 'Field access granted to seasonal contractor' },
    { minutesAgo: 910, actor: 'kenji.osei', type: 'warning', message: 'Water tank level below 20 percent' },
    { minutesAgo: 1000, actor: 'tomas.reyes', type: 'info', message: 'Trellis repair completed on Bed 4' },
    { minutesAgo: 1120, actor: 'system', type: 'info', message: 'Weekly summary report generated' },
    { minutesAgo: 1260, actor: 'marisol.vega', type: 'error', message: 'Payment failed for irrigation equipment order' },
    { minutesAgo: 1400, actor: 'priya.anand', type: 'info', message: 'New planting log entry created for Bed 6' }
  ];

  function formatRelative(minutesAgo) {
    if (minutesAgo < 60) return minutesAgo + (minutesAgo === 1 ? ' minute ago' : ' minutes ago');
    var hours = Math.floor(minutesAgo / 60);
    if (hours < 24) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    var days = Math.floor(hours / 24);
    return days + (days === 1 ? ' day ago' : ' days ago');
  }

  function formatAbsolute(ts) {
    var d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  var entries = RAW_ENTRIES.map(function (raw) {
    var ts = now - raw.minutesAgo * MIN;
    return {
      actor: raw.actor,
      type: raw.type,
      message: raw.message,
      ts: ts,
      relative: formatRelative(raw.minutesAgo),
      absolute: formatAbsolute(ts)
    };
  });

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, query) {
    var safe = escapeHtml(text);
    if (!query) return safe;
    var idx = safe.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return safe;
    return safe.slice(0, idx) + '<mark class="adlv-highlight">' + safe.slice(idx, idx + query.length) + '</mark>' + safe.slice(idx + query.length);
  }

  entries.forEach(function (entry, i) {
    var li = document.createElement('li');
    li.className = 'adlv-entry';
    li.setAttribute('data-type', entry.type);
    li.setAttribute('data-index', String(i));
    listEl.appendChild(li);
  });

  var liEls = Array.prototype.slice.call(listEl.querySelectorAll('.adlv-entry'));

  function render() {
    var query = searchInput.value.trim().toLowerCase();
    var activeType = typeWrap.querySelector('.adlv-type-btn.is-active').getAttribute('data-type');
    var visible = 0;

    entries.forEach(function (entry, i) {
      var li = liEls[i];
      var matchesType = activeType === 'all' || entry.type === activeType;
      var matchesQuery = !query ||
        entry.message.toLowerCase().indexOf(query) !== -1 ||
        entry.actor.toLowerCase().indexOf(query) !== -1;
      var show = matchesType && matchesQuery;

      li.classList.toggle('adlv-hidden', !show);

      if (show) {
        visible++;
        li.innerHTML =
          '<span class="adlv-badge">' + entry.type + '</span>' +
          '<div class="adlv-body">' +
            '<p class="adlv-message">' + highlight(entry.message, query) + '</p>' +
            '<p class="adlv-meta"><span class="adlv-actor">' + highlight(entry.actor, query) + '</span> · ' + entry.relative + ' · <span title="' + entry.absolute + '">' + entry.absolute + '</span></p>' +
          '</div>';
      }
    });

    countEl.textContent = visible + ' of ' + entries.length + ' entries';
    emptyEl.hidden = visible !== 0;
  }

  searchInput.addEventListener('input', render);

  var typeBtns = Array.prototype.slice.call(typeWrap.querySelectorAll('.adlv-type-btn'));
  typeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      typeBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      render();
    });
  });

  render();
})();
