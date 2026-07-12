(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ICON_YES = '<span class="cmpx-icon cmpx-icon--yes"><svg viewBox="0 0 24 24" fill="none" stroke="#5a7a3a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12.5 9.5 18 20 6"/></svg></span>';
  var ICON_NO = '<span class="cmpx-icon cmpx-icon--no"><svg viewBox="0 0 24 24" fill="none" stroke="#6b5540" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></span>';

  // Each feature row: group label (optional, starts a new group), name, and one value per plan.
  // Values: true/false render as check/cross icons; strings render as plain text.
  var ROWS = [
    { group: 'Core' },
    { name: 'Plots per account', values: ['1 plot', '10 plots', 'Unlimited'] },
    { name: 'Seed catalog access', values: [true, true, true] },
    { name: 'Mobile app access', values: [true, true, true] },
    { name: 'Weather-aware scheduling', values: [false, true, true] },
    { group: 'Growth & automation' },
    { name: 'Automated irrigation rules', values: [false, true, true] },
    { name: 'Yield forecasting', values: [false, true, true] },
    { name: 'Companion planting guide', values: [true, true, true] },
    { name: 'Pest & disease alerts', values: [false, false, true] },
    { name: 'Bulk field operations', values: [false, false, true] },
    { group: 'Collaboration' },
    { name: 'Team collaborators', values: ['1 seat', '5 seats', 'Unlimited'] },
    { name: 'Shared field notes', values: [false, true, true] },
    { name: 'Role-based permissions', values: [false, false, true] },
    { group: 'Support & data' },
    { name: 'Historical harvest data', values: ['30 days', 'Unlimited', 'Unlimited'] },
    { name: 'Priority agronomist support', values: [false, false, true] },
    { name: 'Custom field reports', values: [false, true, true] },
    { name: 'API access', values: [false, false, true] }
  ];

  var tbody = document.getElementById('cmpx-tbody');
  var toggle = document.getElementById('cmpx-diff-toggle');
  var countEl = document.getElementById('cmpx-count');
  var emptyEl = document.getElementById('cmpx-empty');
  if (!tbody) return;

  function cellHtml(value, colIndex) {
    var featured = colIndex === 1 ? ' cmpx-featured' : '';
    if (typeof value === 'boolean') {
      return '<td class="' + featured.trim() + '">' + (value ? ICON_YES : ICON_NO) + '</td>';
    }
    return '<td class="' + featured.trim() + '"><span class="cmpx-value">' + value + '</span></td>';
  }

  function rowAllEqual(values) {
    return values.every(function (v) { return v === values[0]; });
  }

  var featureRowCount = 0;

  ROWS.forEach(function (row) {
    var tr = document.createElement('tr');
    if (row.group) {
      tr.className = 'cmpx-group-row';
      var td = document.createElement('td');
      td.setAttribute('colspan', '4');
      td.textContent = row.group;
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    featureRowCount++;
    tr.className = 'cmpx-feature-row';
    tr.dataset.same = rowAllEqual(row.values) ? 'true' : 'false';

    var nameTd = document.createElement('td');
    nameTd.className = 'cmpx-sticky cmpx-feature-cell';
    nameTd.textContent = row.name;
    tr.appendChild(nameTd);

    var html = '';
    row.values.forEach(function (v, i) {
      html += cellHtml(v, i);
    });
    tr.insertAdjacentHTML('beforeend', html);

    tbody.appendChild(tr);
  });

  function updateCount() {
    var rows = Array.prototype.slice.call(tbody.querySelectorAll('.cmpx-feature-row'));
    var visible = rows.filter(function (r) { return !r.classList.contains('cmpx-row-hidden'); });
    countEl.textContent = visible.length + ' of ' + rows.length + ' features shown';
    emptyEl.hidden = visible.length !== 0;
  }

  function applyFilter() {
    var showDiffOnly = toggle.checked;
    var rows = Array.prototype.slice.call(tbody.querySelectorAll('.cmpx-feature-row'));
    rows.forEach(function (r) {
      var hide = showDiffOnly && r.dataset.same === 'true';
      r.classList.toggle('cmpx-row-hidden', hide);
    });

    // Hide group headers whose entire group is now empty.
    var groupRows = Array.prototype.slice.call(tbody.querySelectorAll('.cmpx-group-row'));
    groupRows.forEach(function (gr) {
      var next = gr.nextElementSibling;
      var hasVisible = false;
      while (next && !next.classList.contains('cmpx-group-row')) {
        if (!next.classList.contains('cmpx-row-hidden')) {
          hasVisible = true;
          break;
        }
        next = next.nextElementSibling;
      }
      gr.classList.toggle('cmpx-row-hidden', !hasVisible);
    });

    updateCount();
  }

  toggle.addEventListener('change', applyFilter);

  updateCount();
})();
