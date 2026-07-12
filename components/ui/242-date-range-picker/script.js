(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.drp-card');
  if (!wrap) return;

  var monthsLabel = document.getElementById('drp-months');
  var calendarsEl = document.getElementById('drp-calendars');
  var summaryEl = document.getElementById('drp-summary');
  var clearBtn = document.getElementById('drp-clear');
  var applyBtn = document.getElementById('drp-apply');
  var navBtns = Array.prototype.slice.call(wrap.querySelectorAll('.drp-nav-btn'));

  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();

  var startDate = null;
  var endDate = null;
  var hoverDate = null;

  function dateKey(d) {
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function sameDay(a, b) {
    return a && b && dateKey(a) === dateKey(b);
  }

  function inRange(d, a, b) {
    if (!a || !b) return false;
    var t = d.getTime();
    var lo = Math.min(a.getTime(), b.getTime());
    var hi = Math.max(a.getTime(), b.getTime());
    return t > lo && t < hi;
  }

  function formatShort(d) {
    return monthNames[d.getMonth()].slice(0, 3) + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function buildMonth(year, month) {
    var monthEl = document.createElement('div');
    monthEl.className = 'drp-month';

    var weekdaysRow = document.createElement('div');
    weekdaysRow.className = 'drp-cal-weekdays';
    weekdayNames.forEach(function (w) {
      var el = document.createElement('div');
      el.className = 'drp-weekday';
      el.textContent = w;
      weekdaysRow.appendChild(el);
    });
    monthEl.appendChild(weekdaysRow);

    var grid = document.createElement('div');
    grid.className = 'drp-cal-grid';

    var firstDay = new Date(year, month, 1);
    var startOffset = firstDay.getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    for (var i = 0; i < startOffset; i++) {
      var empty = document.createElement('span');
      empty.className = 'drp-day is-empty';
      grid.appendChild(empty);
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var d = new Date(year, month, day);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'drp-day';
      btn.textContent = String(day);
      btn.setAttribute('data-key', dateKey(d));

      if (sameDay(d, today)) btn.classList.add('is-today');
      if (sameDay(d, startDate)) btn.classList.add('is-start');
      if (sameDay(d, endDate)) btn.classList.add('is-end');

      if (startDate && endDate && inRange(d, startDate, endDate)) {
        btn.classList.add('is-in-range');
      } else if (startDate && !endDate && hoverDate && inRange(d, startDate, hoverDate)) {
        btn.classList.add('is-preview');
      }

      btn.addEventListener('click', function (dateObj) {
        return function () {
          handlePick(dateObj);
        };
      }(d));

      btn.addEventListener('mouseenter', function (dateObj) {
        return function () {
          if (startDate && !endDate) {
            hoverDate = dateObj;
            render();
          }
        };
      }(d));

      grid.appendChild(btn);
    }

    monthEl.appendChild(grid);
    return monthEl;
  }

  function handlePick(d) {
    if (!startDate || (startDate && endDate)) {
      startDate = d;
      endDate = null;
      hoverDate = null;
    } else {
      if (d.getTime() < startDate.getTime()) {
        endDate = startDate;
        startDate = d;
      } else {
        endDate = d;
      }
      hoverDate = null;
    }
    render();
  }

  function render() {
    monthsLabel.innerHTML = '';
    calendarsEl.innerHTML = '';

    var secondMonth = viewMonth + 1;
    var secondYear = viewYear;
    if (secondMonth > 11) {
      secondMonth = 0;
      secondYear++;
    }

    [[viewYear, viewMonth], [secondYear, secondMonth]].forEach(function (pair) {
      var label = document.createElement('span');
      label.textContent = monthNames[pair[1]] + ' ' + pair[0];
      monthsLabel.appendChild(label);
      calendarsEl.appendChild(buildMonth(pair[0], pair[1]));
    });

    if (startDate && endDate) {
      summaryEl.textContent = formatShort(startDate) + ' – ' + formatShort(endDate);
      applyBtn.disabled = false;
    } else if (startDate) {
      summaryEl.textContent = 'Start: ' + formatShort(startDate) + ' — pick an end date';
      applyBtn.disabled = true;
    } else {
      summaryEl.textContent = 'Pick a start date';
      applyBtn.disabled = true;
    }
  }

  navBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = parseInt(btn.getAttribute('data-dir'), 10);
      viewMonth += dir;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      } else if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      render();
    });
  });

  clearBtn.addEventListener('click', function () {
    startDate = null;
    endDate = null;
    hoverDate = null;
    render();
  });

  applyBtn.addEventListener('click', function () {
    if (!startDate || !endDate) return;
    summaryEl.textContent = 'Applied: ' + formatShort(startDate) + ' – ' + formatShort(endDate);
    if (!reduceMotion) {
      applyBtn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0.95)' }, { transform: 'scale(1)' }],
        { duration: 180, easing: 'ease-out' }
      );
    }
  });

  render();
})();
