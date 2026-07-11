(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cropColors = {
    'Heirloom Tomato': '#c4622d',
    'Winter Squash': '#d4a85a',
    'Purple Kale': '#5a7a3a',
    'Sweet Corn': '#d4a85a',
    'Bush Bean': '#8fa86e',
    'Rye': '#9b6b3a',
    'Sunflower': '#d4a85a',
    'Red Onion': '#a03820',
    'Barley': '#9b6b3a',
    'Pumpkin': '#c4622d',
    'Lavender': '#8fa86e',
    'Buckwheat': '#5a7a3a'
  };

  var data = [
    { crop: 'Heirloom Tomato', region: 'Redwood Hollow', yield: 18.4, area: 6.2, date: '2026-08-14', quality: 'Excellent' },
    { crop: 'Winter Squash', region: 'Thistledown Field', yield: 24.1, area: 9.8, date: '2026-09-30', quality: 'Good' },
    { crop: 'Purple Kale', region: 'Ashvale Plot', yield: 11.7, area: 3.4, date: '2026-07-02', quality: 'Excellent' },
    { crop: 'Sweet Corn', region: 'Meadowrun Acres', yield: 32.6, area: 14.5, date: '2026-08-28', quality: 'Good' },
    { crop: 'Bush Bean', region: 'Redwood Hollow', yield: 9.3, area: 2.9, date: '2026-06-19', quality: 'Fair' },
    { crop: 'Rye', region: 'Stonebrook Rise', yield: 15.9, area: 11.1, date: '2026-07-25', quality: 'Good' },
    { crop: 'Sunflower', region: 'Goldenreach Field', yield: 6.8, area: 4.7, date: '2026-09-05', quality: 'Excellent' },
    { crop: 'Red Onion', region: 'Thistledown Field', yield: 21.2, area: 5.6, date: '2026-08-02', quality: 'Fair' },
    { crop: 'Barley', region: 'Stonebrook Rise', yield: 19.5, area: 13.2, date: '2026-07-11', quality: 'Good' },
    { crop: 'Pumpkin', region: 'Ashvale Plot', yield: 27.9, area: 7.8, date: '2026-10-09', quality: 'Excellent' },
    { crop: 'Lavender', region: 'Goldenreach Field', yield: 4.2, area: 2.1, date: '2026-06-30', quality: 'Excellent' },
    { crop: 'Buckwheat', region: 'Meadowrun Acres', yield: 13.4, area: 8.9, date: '2026-08-21', quality: 'Fair' }
  ];

  var tbody = document.getElementById('tableBody');
  var foot = document.getElementById('tableFoot');
  var headers = Array.prototype.slice.call(document.querySelectorAll('.field-table th'));

  var sortState = { key: null, dir: 1 };

  function qualityClass(q) {
    return 'quality-' + q.toLowerCase();
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function buildRow(row) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><span class="crop-cell"><span class="crop-dot" style="background:' + (cropColors[row.crop] || '#9b6b3a') + '"></span>' + row.crop + '</span></td>' +
      '<td class="muted-cell">' + row.region + '</td>' +
      '<td class="num-cell">' + row.yield.toFixed(1) + '</td>' +
      '<td class="num-cell">' + row.area.toFixed(1) + '</td>' +
      '<td class="muted-cell">' + formatDate(row.date) + '</td>' +
      '<td><span class="quality-pill ' + qualityClass(row.quality) + '">' + row.quality + '</span></td>';
    return tr;
  }

  function render(rows, animate) {
    tbody.innerHTML = '';
    rows.forEach(function (row, i) {
      var tr = buildRow(row);
      if (animate && !reduceMotion) {
        tr.classList.add('row-enter');
        tr.style.transitionDelay = (i * 22) + 'ms';
      }
      tbody.appendChild(tr);
    });

    if (animate && !reduceMotion) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          Array.prototype.forEach.call(tbody.children, function (tr) {
            tr.classList.remove('row-enter');
          });
        });
      });
    }

    foot.textContent = rows.length + ' harvest records';
  }

  function sortBy(key, type) {
    if (sortState.key === key) {
      sortState.dir *= -1;
    } else {
      sortState.key = key;
      sortState.dir = 1;
    }

    var sorted = data.slice().sort(function (a, b) {
      var av = a[key];
      var bv = b[key];
      if (type === 'number') {
        return (av - bv) * sortState.dir;
      }
      if (type === 'date') {
        return (new Date(av) - new Date(bv)) * sortState.dir;
      }
      return String(av).localeCompare(String(bv)) * sortState.dir;
    });

    headers.forEach(function (th) {
      if (th.dataset.key === key) {
        th.setAttribute('aria-sort', sortState.dir === 1 ? 'ascending' : 'descending');
      } else {
        th.removeAttribute('aria-sort');
      }
    });

    render(sorted, true);
  }

  headers.forEach(function (th) {
    var btn = th.querySelector('.th-btn');
    btn.addEventListener('click', function () {
      sortBy(th.dataset.key, th.dataset.type);
    });
  });

  render(data, false);
})();
