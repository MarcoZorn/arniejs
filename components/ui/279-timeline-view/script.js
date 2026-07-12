(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EVENTS = [
    { date: 'Feb 3', title: 'Cover crop turned under', desc: 'Winter rye tilled into beds 1-6 to feed the soil ahead of spring planting.', type: 'maintenance' },
    { date: 'Mar 12', title: 'Tomato & pepper starts sown', desc: 'Seed trays started indoors under grow lights — 40 tomato, 24 pepper.', type: 'planting' },
    { date: 'Apr 2', title: 'Late frost warning', desc: 'Overnight temperatures dropped to 29°F. Row covers deployed across all beds.', type: 'weather' },
    { date: 'Apr 18', title: 'Irrigation lines flushed', desc: 'Drip lines cleared and pressure-tested before the growing season ramp-up.', type: 'maintenance' },
    { date: 'May 6', title: 'Tomato transplant', desc: 'Hardened-off tomato and pepper seedlings moved to beds 2 and 3.', type: 'planting' },
    { date: 'May 29', title: 'Squash & bean direct-sow', desc: 'Summer squash, pole beans, and cucumber seeded directly into beds 4-5.', type: 'planting' },
    { date: 'Jun 14', title: 'Heavy hailstorm', desc: 'Ten-minute hail event bruised young squash leaves; no major crop loss.', type: 'weather' },
    { date: 'Jul 9', title: 'First tomato harvest', desc: 'Early-season Sungold and Celebrity varieties picked — 18 kg total.', type: 'harvest' },
    { date: 'Jul 22', title: 'Trellis repair', desc: 'Wind-damaged bean trellises rebuilt with reinforced cross bracing.', type: 'maintenance' },
    { date: 'Aug 4', title: 'Peak harvest week', desc: 'Tomato, squash, and cucumber all cropping heavily — 96 kg picked.', type: 'harvest' },
    { date: 'Aug 30', title: 'Powdery mildew treatment', desc: 'Squash bed treated with a diluted milk spray after early mildew signs.', type: 'maintenance' },
    { date: 'Sep 21', title: 'Final harvest & bed clearing', desc: 'Last of the peppers and squash picked; beds cleared and mulched for winter.', type: 'harvest' }
  ];

  var listEl = document.getElementById('tlvw-timeline');
  var filterWrap = document.getElementById('tlvw-filters');
  var emptyEl = document.getElementById('tlvw-empty');
  if (!listEl) return;

  EVENTS.forEach(function (ev) {
    var li = document.createElement('li');
    li.className = 'tlvw-event';
    li.setAttribute('data-type', ev.type);

    li.innerHTML =
      '<span class="tlvw-dot" aria-hidden="true"></span>' +
      '<div class="tlvw-card">' +
        '<span class="tlvw-date">' + ev.date + '</span>' +
        '<h3 class="tlvw-event-title">' + ev.title + '</h3>' +
        '<p class="tlvw-event-desc">' + ev.desc + '</p>' +
        '<span class="tlvw-badge">' + ev.type + '</span>' +
      '</div>';

    listEl.appendChild(li);
  });

  var pills = Array.prototype.slice.call(filterWrap.querySelectorAll('.tlvw-pill'));
  var events = Array.prototype.slice.call(listEl.querySelectorAll('.tlvw-event'));

  function applyFilter(filter) {
    var visibleCount = 0;
    events.forEach(function (li) {
      var show = filter === 'all' || li.getAttribute('data-type') === filter;
      li.classList.toggle('tlvw-hidden', !show);
      if (show) visibleCount++;
    });
    emptyEl.hidden = visibleCount !== 0;
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('is-active'); });
      pill.classList.add('is-active');
      applyFilter(pill.getAttribute('data-filter'));
    });
  });

  applyFilter('all');
})();
