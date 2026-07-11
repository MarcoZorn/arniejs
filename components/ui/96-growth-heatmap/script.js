(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var grid = document.querySelector('[data-role="grid"]');
  var monthsRow = document.querySelector('[data-role="months"]');
  var totalEl = document.querySelector('[data-role="total"]');
  var rangeLabelEl = document.querySelector('[data-role="range-label"]');
  var tooltip = document.querySelector('[data-role="tooltip"]');

  var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAY_MS = 24 * 60 * 60 * 1000;
  var WEEKS = 26; // ~6 months

  function seededRandom(seed) {
    var s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  var rand = seededRandom(42);

  function startOfGrid(weeks) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var totalDays = weeks * 7;
    var start = new Date(today.getTime() - (totalDays - 1) * DAY_MS);
    // shift back to the most recent Sunday on/before start
    var dow = start.getDay();
    start = new Date(start.getTime() - dow * DAY_MS);
    return start;
  }

  function generateActivity(date, index, totalDays) {
    // seasonal-ish curve: more garden activity in "growing season" middle of range,
    // with weekly bump on weekends, plus randomness. Occasional zero days.
    var seasonPos = index / totalDays; // 0..1
    var seasonCurve = Math.sin(seasonPos * Math.PI); // peaks mid-range
    var dow = date.getDay();
    var weekendBoost = (dow === 0 || dow === 6) ? 1.4 : 1.0;

    var base = seasonCurve * 6 * weekendBoost;
    var noise = rand() * 5;
    var value = Math.max(0, Math.round(base + noise - 2));

    // sprinkle rest days
    if (rand() < 0.18) value = 0;

    return value;
  }

  function levelFor(value, max) {
    if (value <= 0) return 0;
    var ratio = value / max;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  function formatDate(date) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  function activityLabel(count) {
    if (count === 0) return 'No activity';
    if (count === 1) return '1 activity';
    return count + ' activities';
  }

  var start = startOfGrid(WEEKS);
  var totalDays = WEEKS * 7;
  var days = [];

  for (var i = 0; i < totalDays; i++) {
    var date = new Date(start.getTime() + i * DAY_MS);
    var count = generateActivity(date, i, totalDays);
    days.push({ date: date, count: count });
  }

  var maxCount = days.reduce(function (m, d) { return Math.max(m, d.count); }, 1);
  var totalCount = days.reduce(function (sum, d) { return sum + d.count; }, 0);

  totalEl.textContent = totalCount.toLocaleString() + ' activities logged';
  rangeLabelEl.textContent = WEEKS + ' weeks';

  // build grid (column-major: week columns, 7 rows each)
  var frag = document.createDocumentFragment();

  days.forEach(function (day, idx) {
    var cell = document.createElement('div');
    var isFuture = day.date.getTime() > Date.now();

    if (isFuture) {
      cell.className = 'day-cell is-empty';
    } else {
      var level = levelFor(day.count, maxCount);
      cell.className = 'day-cell';
      cell.setAttribute('data-level', level);
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('data-date', formatDate(day.date));
      cell.setAttribute('data-count', activityLabel(day.count));
      cell.setAttribute('aria-label', formatDate(day.date) + ': ' + activityLabel(day.count));

      var weekIndex = Math.floor(idx / 7);
      if (!prefersReducedMotion) {
        cell.style.animationDelay = (weekIndex * 22) + 'ms';
      }
    }

    frag.appendChild(cell);
  });

  grid.appendChild(frag);
  grid.style.gridTemplateColumns = 'repeat(' + WEEKS + ', 13px)';

  // trigger entrance animation
  requestAnimationFrame(function () {
    var cells = grid.querySelectorAll('.day-cell:not(.is-empty)');
    cells.forEach(function (c) {
      if (prefersReducedMotion) {
        c.style.opacity = '1';
        c.style.transform = 'scale(1)';
      } else {
        c.classList.add('is-in');
      }
    });
  });

  // month labels aligned to week columns
  monthsRow.style.gridTemplateColumns = 'repeat(' + WEEKS + ', 13px)';
  var lastMonth = -1;
  for (var w = 0; w < WEEKS; w++) {
    var weekStartDate = new Date(start.getTime() + w * 7 * DAY_MS);
    var m = weekStartDate.getMonth();
    var label = document.createElement('span');
    if (m !== lastMonth) {
      label.textContent = MONTH_NAMES[m];
      lastMonth = m;
    }
    monthsRow.appendChild(label);
  }

  // tooltip interactions
  var activeCell = null;

  function positionTooltip(cell) {
    var rect = cell.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = rect.top + 'px';
  }

  function showTooltip(cell) {
    if (cell.classList.contains('is-empty')) return;
    activeCell = cell;
    cell.classList.add('is-active');
    tooltip.innerHTML = cell.getAttribute('data-date') + ' &middot; <span class="tt-count">' + cell.getAttribute('data-count') + '</span>';
    positionTooltip(cell);
    tooltip.classList.add('is-visible');
  }

  function hideTooltip() {
    if (activeCell) {
      activeCell.classList.remove('is-active');
      activeCell = null;
    }
    tooltip.classList.remove('is-visible');
  }

  grid.addEventListener('pointerover', function (e) {
    var cell = e.target.closest('.day-cell');
    if (cell) showTooltip(cell);
  });

  grid.addEventListener('pointermove', function (e) {
    var cell = e.target.closest('.day-cell');
    if (cell && cell === activeCell) positionTooltip(cell);
  });

  grid.addEventListener('pointerout', function (e) {
    var cell = e.target.closest('.day-cell');
    if (cell) hideTooltip();
  });

  grid.addEventListener('focusin', function (e) {
    var cell = e.target.closest('.day-cell');
    if (cell) showTooltip(cell);
  });

  grid.addEventListener('focusout', function (e) {
    var cell = e.target.closest('.day-cell');
    if (cell) hideTooltip();
  });

  grid.addEventListener('touchstart', function (e) {
    var target = e.target.closest ? e.target.closest('.day-cell') : null;
    if (target) showTooltip(target);
  }, { passive: true });
})();
