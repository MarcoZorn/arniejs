(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PX_PER_DAY = 15;
  var ROW_H = 46;

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function d(s) {
    var parts = s.split('-').map(Number);
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  }

  function dayDiff(a, b) {
    return Math.round((b - a) / 86400000);
  }

  function fmt(date) {
    return MONTHS[date.getUTCMonth()] + ' ' + date.getUTCDate();
  }

  var PHASE_META = {
    prep: { label: 'Soil Prep', swatchClass: 'swatch-prep' },
    plant: { label: 'Planting / Sowing', swatchClass: 'swatch-plant' },
    grow: { label: 'Growing', swatchClass: 'swatch-grow' },
    harvest: { label: 'Harvest', swatchClass: 'swatch-harvest' }
  };

  var rows = [
    {
      name: 'Tomatoes',
      sub: 'Solanum lycopersicum',
      bars: [
        { phase: 'prep', start: '2026-03-16', end: '2026-03-28' },
        { phase: 'plant', start: '2026-03-29', end: '2026-04-05' },
        { phase: 'grow', start: '2026-04-06', end: '2026-07-10' },
        { phase: 'harvest', start: '2026-07-11', end: '2026-08-20' }
      ]
    },
    {
      name: 'Sweet Corn',
      sub: 'Zea mays',
      bars: [
        { phase: 'prep', start: '2026-04-01', end: '2026-04-10' },
        { phase: 'plant', start: '2026-04-11', end: '2026-04-18' },
        { phase: 'grow', start: '2026-04-19', end: '2026-07-15' },
        { phase: 'harvest', start: '2026-07-16', end: '2026-08-10' }
      ]
    },
    {
      name: 'Lettuce',
      sub: 'succession sow',
      bars: [
        { phase: 'plant', start: '2026-03-20', end: '2026-03-25' },
        { phase: 'grow', start: '2026-03-26', end: '2026-04-20' },
        { phase: 'harvest', start: '2026-04-21', end: '2026-04-28' },
        { phase: 'plant', start: '2026-05-01', end: '2026-05-05' },
        { phase: 'grow', start: '2026-05-06', end: '2026-05-30' },
        { phase: 'harvest', start: '2026-05-31', end: '2026-06-07' }
      ]
    },
    {
      name: 'Pumpkins',
      sub: 'Cucurbita pepo',
      bars: [
        { phase: 'prep', start: '2026-05-01', end: '2026-05-10' },
        { phase: 'plant', start: '2026-05-11', end: '2026-05-20' },
        { phase: 'grow', start: '2026-05-21', end: '2026-09-15' },
        { phase: 'harvest', start: '2026-09-16', end: '2026-10-05' }
      ]
    },
    {
      name: 'Garlic',
      sub: 'Allium sativum',
      bars: [
        { phase: 'plant', start: '2026-03-16', end: '2026-03-22' },
        { phase: 'grow', start: '2026-03-23', end: '2026-07-20' },
        { phase: 'harvest', start: '2026-07-21', end: '2026-08-05' }
      ]
    }
  ];

  var rangeStart = d('2026-03-15');
  var rangeEnd = d('2026-10-05');
  var totalDays = dayDiff(rangeStart, rangeEnd);
  var trackWidth = totalDays * PX_PER_DAY;

  document.documentElement.style.setProperty('--px-per-day', PX_PER_DAY + 'px');

  var labelsEl = document.getElementById('ganttLabels');
  var headerEl = document.getElementById('ganttHeader');
  var rowsEl = document.getElementById('ganttRows');
  var trackEl = document.getElementById('ganttTrack');
  var legendEl = document.getElementById('legend');
  var tooltip = document.getElementById('tooltip');
  var tooltipTitle = document.getElementById('tooltipTitle');
  var tooltipPhase = document.getElementById('tooltipPhase');
  var tooltipDates = document.getElementById('tooltipDates');

  trackEl.style.width = trackWidth + 'px';

  // ---- legend ----
  var legendColors = {
    prep: 'repeating-linear-gradient(135deg, var(--accent-clay), var(--accent-clay) 4px, #86602f 4px, #86602f 8px)',
    plant: 'var(--accent-sand)',
    grow: 'var(--accent-moss)',
    harvest: 'var(--accent-terra)'
  };
  Object.keys(PHASE_META).forEach(function (key) {
    var li = document.createElement('li');
    var sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = legendColors[key];
    li.appendChild(sw);
    li.appendChild(document.createTextNode(PHASE_META[key].label));
    legendEl.appendChild(li);
  });

  // ---- row labels ----
  rows.forEach(function (row) {
    var labelRow = document.createElement('div');
    labelRow.className = 'gantt-label-row';
    var name = document.createElement('div');
    name.className = 'gantt-label-name';
    name.textContent = row.name;
    var sub = document.createElement('div');
    sub.className = 'gantt-label-sub';
    sub.textContent = row.sub;
    labelRow.appendChild(name);
    labelRow.appendChild(sub);
    labelsEl.appendChild(labelRow);
  });

  // ---- header: month bands ----
  var cursor = new Date(rangeStart);
  while (cursor < rangeEnd) {
    var monthStart = cursor.getUTCDate() === 1 ? new Date(cursor) : new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
    var effectiveStart = cursor;
    var nextMonth = new Date(Date.UTC(effectiveStart.getUTCFullYear(), effectiveStart.getUTCMonth() + 1, 1));
    var bandEnd = nextMonth < rangeEnd ? nextMonth : rangeEnd;

    var left = dayDiff(rangeStart, effectiveStart) * PX_PER_DAY;
    var width = dayDiff(effectiveStart, bandEnd) * PX_PER_DAY;

    var band = document.createElement('div');
    band.className = 'month-band';
    band.style.left = left + 'px';
    band.style.width = width + 'px';
    band.textContent = MONTHS[effectiveStart.getUTCMonth()] + ' ' + effectiveStart.getUTCFullYear();
    headerEl.appendChild(band);

    cursor = nextMonth;
  }

  // ---- header: weekly ticks ----
  var weekCursor = new Date(rangeStart);
  var weekIndex = 0;
  while (weekCursor < rangeEnd) {
    var left2 = dayDiff(rangeStart, weekCursor) * PX_PER_DAY;

    var tick = document.createElement('div');
    tick.className = 'week-tick';
    tick.style.left = left2 + 'px';
    headerEl.appendChild(tick);

    if (weekIndex % 2 === 0) {
      var lbl = document.createElement('div');
      lbl.className = 'week-label';
      lbl.style.left = left2 + 'px';
      lbl.textContent = fmt(weekCursor);
      headerEl.appendChild(lbl);
    }

    var gridLine = document.createElement('div');
    gridLine.className = 'gantt-grid-line';
    gridLine.style.left = left2 + 'px';
    gridLine.style.height = (rows.length * ROW_H) + 'px';
    rowsEl.appendChild(gridLine);

    weekCursor = new Date(weekCursor.getTime() + 7 * 86400000);
    weekIndex++;
  }

  // ---- today marker ----
  var today = new Date(Date.UTC(2026, 6, 11)); // matches current date context
  if (today >= rangeStart && today <= rangeEnd) {
    var todayLeft = dayDiff(rangeStart, today) * PX_PER_DAY;
    var todayLine = document.createElement('div');
    todayLine.className = 'today-line';
    todayLine.style.left = todayLeft + 'px';
    todayLine.style.height = (62 + rows.length * ROW_H) + 'px';
    trackEl.appendChild(todayLine);
  }

  // ---- rows + bars ----
  rows.forEach(function (row) {
    var rowEl = document.createElement('div');
    rowEl.className = 'gantt-row';

    row.bars.forEach(function (bar) {
      var start = d(bar.start);
      var end = d(bar.end);
      var left = dayDiff(rangeStart, start) * PX_PER_DAY;
      var width = Math.max(dayDiff(start, end) * PX_PER_DAY, 10);

      var barEl = document.createElement('div');
      barEl.className = 'bar';
      barEl.dataset.phase = bar.phase;
      barEl.style.left = left + 'px';
      barEl.style.width = width + 'px';
      barEl.tabIndex = 0;
      barEl.setAttribute('role', 'button');
      var meta = PHASE_META[bar.phase];
      barEl.setAttribute(
        'aria-label',
        row.name + ' — ' + meta.label + ', ' + fmt(start) + ' to ' + fmt(end)
      );

      var labelSpan = document.createElement('span');
      labelSpan.className = 'bar-label';
      labelSpan.textContent = meta.label;
      barEl.appendChild(labelSpan);

      function showTooltip(clientX, clientY) {
        tooltipTitle.textContent = row.name;
        tooltipPhase.textContent = meta.label;
        tooltipDates.textContent = fmt(start) + ' – ' + fmt(end);
        tooltip.style.left = clientX + 'px';
        tooltip.style.top = clientY + 'px';
        tooltip.classList.add('visible');
        tooltip.setAttribute('aria-hidden', 'false');
      }

      function hideTooltip() {
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
      }

      barEl.addEventListener('mouseenter', function (e) {
        showTooltip(e.clientX, e.clientY);
      });
      barEl.addEventListener('mousemove', function (e) {
        showTooltip(e.clientX, e.clientY);
      });
      barEl.addEventListener('mouseleave', hideTooltip);

      barEl.addEventListener('focus', function () {
        var rect = barEl.getBoundingClientRect();
        showTooltip(rect.left + rect.width / 2, rect.top);
      });
      barEl.addEventListener('blur', hideTooltip);

      barEl.addEventListener(
        'touchstart',
        function (e) {
          var t = e.touches[0];
          showTooltip(t.clientX, t.clientY);
        },
        { passive: true }
      );
      barEl.addEventListener('touchend', function () {
        setTimeout(hideTooltip, 1200);
      });

      rowEl.appendChild(barEl);
    });

    rowsEl.appendChild(rowEl);
  });
})();
