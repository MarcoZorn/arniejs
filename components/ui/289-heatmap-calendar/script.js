(function () {
  var wrap = document.querySelector('.hmc-wrap');
  if (!wrap) return;

  var gridEl = wrap.querySelector('[data-grid]');
  var monthsEl = wrap.querySelector('[data-months]');
  var tooltip = wrap.querySelector('[data-tooltip]');

  var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAY_MS = 24 * 60 * 60 * 1000;

  function levelForMinutes(m) {
    if (m <= 0) return 0;
    if (m < 15) return 1;
    if (m < 35) return 2;
    if (m < 65) return 3;
    return 4;
  }

  function generateMinutes(date) {
    var day = date.getDay(); // 0 sun .. 6 sat
    var isWeekend = day === 0 || day === 6;
    var chanceOfNothing = isWeekend ? 0.2 : 0.45;

    if (Math.random() < chanceOfNothing) return 0;

    var base = isWeekend ? 40 : 20;
    var spread = isWeekend ? 70 : 45;
    return Math.round(base + Math.random() * spread);
  }

  // Build a Monday-aligned grid spanning roughly the last 53 weeks, ending today.
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var start = new Date(today.getTime() - 364 * DAY_MS);
  var startDow = start.getDay(); // 0=Sun
  var mondayOffset = startDow === 0 ? 6 : startDow - 1;
  start = new Date(start.getTime() - mondayOffset * DAY_MS);

  var days = [];
  var cursor = new Date(start.getTime());
  while (cursor.getTime() <= today.getTime()) {
    var minutes = generateMinutes(cursor);
    days.push({
      date: new Date(cursor.getTime()),
      minutes: minutes,
      level: levelForMinutes(minutes)
    });
    cursor = new Date(cursor.getTime() + DAY_MS);
  }

  var weekCount = Math.ceil(days.length / 7);
  gridEl.style.gridTemplateColumns = 'repeat(' + weekCount + ', 14px)';

  var monthLabelWeeks = [];
  var lastMonth = -1;

  days.forEach(function (day, i) {
    var weekIndex = Math.floor(i / 7);
    var cell = document.createElement('div');
    cell.className = 'hmc-cell';
    cell.setAttribute('data-level', day.level);
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'button');
    var dateStr = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var label = dateStr + ': ' + (day.minutes > 0 ? day.minutes + ' minutes in the garden' : 'no time in the garden');
    cell.setAttribute('aria-label', label);
    cell.dataset.dateStr = dateStr;
    cell.dataset.minutes = day.minutes;
    cell.style.gridColumn = String(weekIndex + 1);
    cell.style.gridRow = String((day.date.getDay() === 0 ? 7 : day.date.getDay()));
    gridEl.appendChild(cell);

    var month = day.date.getMonth();
    if (month !== lastMonth && day.date.getDay() <= 1) {
      monthLabelWeeks.push({ week: weekIndex, name: MONTH_NAMES[month] });
      lastMonth = month;
    }
  });

  // Month labels aligned above their first week column.
  var lastPlaced = -3;
  monthLabelWeeks.forEach(function (m) {
    if (m.week - lastPlaced < 3) return;
    lastPlaced = m.week;
    var span = document.createElement('span');
    span.textContent = m.name;
    span.style.gridColumn = String(m.week + 1);
    monthsEl.appendChild(span);
  });
  monthsEl.style.gridTemplateColumns = 'repeat(' + weekCount + ', 14px)';

  // Custom tooltip, positioned near the pointer or the focused cell.
  function showTooltip(cell, x, y) {
    var minutes = Number(cell.dataset.minutes);
    var valueText = minutes > 0 ? minutes + ' min' : 'no activity';
    tooltip.innerHTML = cell.dataset.dateStr + ' — <span class="hmc-tooltip-value">' + valueText + '</span>';
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.classList.add('is-visible');
    tooltip.setAttribute('aria-hidden', 'false');
  }

  function hideTooltip() {
    tooltip.classList.remove('is-visible');
    tooltip.setAttribute('aria-hidden', 'true');
  }

  gridEl.addEventListener('pointermove', function (e) {
    var cell = e.target.closest ? e.target.closest('.hmc-cell') : null;
    if (!cell) return;
    showTooltip(cell, e.clientX, e.clientY - 14);
  });

  gridEl.addEventListener('pointerleave', hideTooltip);

  gridEl.addEventListener('pointerdown', function (e) {
    var cell = e.target.closest ? e.target.closest('.hmc-cell') : null;
    if (!cell) return;
    showTooltip(cell, e.clientX, e.clientY - 14);
  });

  gridEl.addEventListener('focusin', function (e) {
    var cell = e.target.closest ? e.target.closest('.hmc-cell') : null;
    if (!cell) return;
    var rect = cell.getBoundingClientRect();
    showTooltip(cell, rect.left + rect.width / 2, rect.top - 6);
  });

  gridEl.addEventListener('focusout', hideTooltip);
})();
