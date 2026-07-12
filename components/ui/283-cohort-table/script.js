(function () {
  var grid = document.getElementById('cht-grid');
  var tooltip = document.getElementById('cht-tooltip');
  if (!grid) return;

  var weekLabels = ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

  var cohorts = [
    { label: 'Feb 2026', size: 1240, values: [100, 62, 51, 44, 40, 37] },
    { label: 'Mar 2026', size: 1380, values: [100, 58, 47, 41, 38, null] },
    { label: 'Apr 2026', size: 1510, values: [100, 65, 55, 49, null, null] },
    { label: 'May 2026', size: 1622, values: [100, 60, 50, null, null, null] },
    { label: 'Jun 2026', size: 1790, values: [100, 68, null, null, null, null] },
    { label: 'Jul 2026', size: 1310, values: [100, null, null, null, null, null] }
  ];

  grid.style.gridTemplateColumns = '150px repeat(' + weekLabels.length + ', 1fr)';

  function heatColor(value) {
    // Interpolate lightness/opacity of accent-moss based on retention 0-100.
    var t = Math.max(0, Math.min(1, value / 100));
    var alpha = 0.08 + t * 0.72;
    return 'rgba(90, 122, 58, ' + alpha.toFixed(3) + ')';
  }

  function textColor(value) {
    return value >= 45 ? '#f0e6d3' : '#c9b898';
  }

  // Corner cell
  var corner = document.createElement('div');
  corner.className = 'cht-cell cht-cell--corner';
  corner.textContent = 'Cohort';
  corner.setAttribute('role', 'columnheader');
  grid.appendChild(corner);

  // Column headers
  weekLabels.forEach(function (label) {
    var head = document.createElement('div');
    head.className = 'cht-cell cht-cell--colhead';
    head.textContent = label;
    head.setAttribute('role', 'columnheader');
    grid.appendChild(head);
  });

  cohorts.forEach(function (cohort) {
    var rowHead = document.createElement('div');
    rowHead.className = 'cht-cell cht-cell--rowhead';
    rowHead.setAttribute('role', 'rowheader');

    var labelSpan = document.createElement('span');
    labelSpan.textContent = cohort.label;
    var sizeSpan = document.createElement('span');
    sizeSpan.className = 'cht-rowhead-size';
    sizeSpan.textContent = cohort.size.toLocaleString('en-US') + ' users';

    rowHead.appendChild(labelSpan);
    rowHead.appendChild(sizeSpan);
    grid.appendChild(rowHead);

    cohort.values.forEach(function (value, weekIndex) {
      var cell = document.createElement('div');

      if (value === null || value === undefined) {
        cell.className = 'cht-cell cht-cell--empty';
        grid.appendChild(cell);
        return;
      }

      cell.className = 'cht-cell cht-cell--value';
      cell.textContent = value + '%';
      cell.style.background = heatColor(value);
      cell.style.color = textColor(value);
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('role', 'cell');

      var describe = function () {
        var count = Math.round((value / 100) * cohort.size);
        return cohort.label + ' · ' + weekLabels[weekIndex] + ': ' + value + '% retained (' + count.toLocaleString('en-US') + ' of ' + cohort.size.toLocaleString('en-US') + ' users)';
      };

      cell.addEventListener('mouseenter', function () {
        cell.classList.add('is-active');
        if (tooltip) tooltip.textContent = describe();
      });
      cell.addEventListener('mouseleave', function () {
        cell.classList.remove('is-active');
        if (tooltip) tooltip.textContent = '';
      });
      cell.addEventListener('focus', function () {
        cell.classList.add('is-active');
        if (tooltip) tooltip.textContent = describe();
      });
      cell.addEventListener('blur', function () {
        cell.classList.remove('is-active');
        if (tooltip) tooltip.textContent = '';
      });

      grid.appendChild(cell);
    });
  });
})();
