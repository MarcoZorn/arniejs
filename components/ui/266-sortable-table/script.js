(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var plots = [
    { name: 'North Ridge', crop: 'Heirloom tomato', area: 420, yield: 610, planted: '2026-03-02', health: 92 },
    { name: 'Lowland Beds', crop: 'Sweet corn', area: 980, yield: 1420, planted: '2026-02-14', health: 78 },
    { name: 'Terrace Two', crop: 'Snap peas', area: 210, yield: 260, planted: '2026-03-18', health: 88 },
    { name: 'Greenhouse A', crop: 'Basil', area: 90, yield: 74, planted: '2026-04-01', health: 96 },
    { name: 'South Slope', crop: 'Pumpkin', area: 640, yield: 1180, planted: '2026-01-22', health: 65 },
    { name: 'Orchard Row 3', crop: 'Apple', area: 1200, yield: 2040, planted: '2025-11-05', health: 81 },
    { name: 'Herb Spiral', crop: 'Rosemary', area: 45, yield: 22, planted: '2026-02-28', health: 99 },
    { name: 'East Paddock', crop: 'Winter squash', area: 530, yield: 890, planted: '2026-01-09', health: 70 },
    { name: 'Terrace One', crop: 'Kale', area: 180, yield: 210, planted: '2026-03-11', health: 84 },
    { name: 'West Border', crop: 'Sunflower', area: 300, yield: 145, planted: '2026-02-20', health: 90 },
    { name: 'Root Cellar Beds', crop: 'Carrot', area: 260, yield: 340, planted: '2026-01-30', health: 73 },
    { name: 'Greenhouse B', crop: 'Cucumber', area: 120, yield: 205, planted: '2026-03-25', health: 94 },
    { name: 'North Paddock', crop: 'Potato', area: 720, yield: 1560, planted: '2025-12-12', health: 60 },
    { name: 'Bramble Edge', crop: 'Raspberry', area: 150, yield: 95, planted: '2025-10-18', health: 87 }
  ];

  var tbody = document.querySelector('.sort-tbl-body');
  var headers = Array.prototype.slice.call(document.querySelectorAll('.sort-tbl-th'));
  var status = document.querySelector('.sort-tbl-status');
  if (!tbody || !headers.length) return;

  var state = { key: null, dir: 'asc' };

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function render(rows) {
    tbody.innerHTML = '';
    rows.forEach(function (row) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + row.name + '</td>' +
        '<td class="sort-tbl-cell-crop">' + row.crop + '</td>' +
        '<td>' + row.area.toLocaleString() + '</td>' +
        '<td>' + row.yield.toLocaleString() + '</td>' +
        '<td>' + formatDate(row.planted) + '</td>' +
        '<td><span class="sort-tbl-health"><span class="sort-tbl-health-bar"><span class="sort-tbl-health-fill" style="width:' + row.health + '%"></span></span>' + row.health + '%</span></td>';
      tbody.appendChild(tr);
    });
  }

  function sortRows(key, type, dir) {
    var sorted = plots.slice().sort(function (a, b) {
      var av = a[key];
      var bv = b[key];
      if (type === 'number') {
        return dir === 'asc' ? av - bv : bv - av;
      }
      if (type === 'date') {
        var ad = new Date(av).getTime();
        var bd = new Date(bv).getTime();
        return dir === 'asc' ? ad - bd : bd - ad;
      }
      av = String(av).toLowerCase();
      bv = String(bv).toLowerCase();
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }

  headers.forEach(function (th) {
    var btn = th.querySelector('.sort-tbl-th-btn');
    btn.addEventListener('click', function () {
      var key = th.getAttribute('data-key');
      var type = th.getAttribute('data-type');

      if (state.key === key) {
        state.dir = state.dir === 'asc' ? 'desc' : 'asc';
      } else {
        state.key = key;
        state.dir = 'asc';
      }

      headers.forEach(function (other) {
        if (other === th) {
          other.setAttribute('data-active', 'true');
          other.setAttribute('data-dir', state.dir);
        } else {
          other.removeAttribute('data-active');
          other.removeAttribute('data-dir');
        }
      });

      var sorted = sortRows(key, type, state.dir);
      render(sorted);

      if (status) {
        var label = btn.querySelector('span').textContent;
        status.textContent = 'Sorted by ' + label + ', ' + (state.dir === 'asc' ? 'ascending' : 'descending') + '.';
      }
    });
  });

  // Initial render, sorted by plot name ascending to match the first header's default state.
  headers[0].setAttribute('data-active', 'true');
  headers[0].setAttribute('data-dir', 'asc');
  state.key = 'name';
  state.dir = 'asc';
  render(sortRows('name', 'string', 'asc'));
})();
