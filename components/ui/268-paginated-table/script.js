(function () {
  var orders = [
    { id: 'ORD-1001', customer: 'Greenfield Co-op', crate: 'Tomato, Cherokee Purple', qty: 24, date: '2026-06-01', status: 'Delivered' },
    { id: 'ORD-1002', customer: 'Maple & Vine Market', crate: 'Sweet Corn', qty: 40, date: '2026-06-01', status: 'Delivered' },
    { id: 'ORD-1003', customer: 'Riverside Kitchen', crate: 'Basil, Genovese', qty: 12, date: '2026-06-02', status: 'In transit' },
    { id: 'ORD-1004', customer: 'Hollow Creek Diner', crate: 'Snap Peas', qty: 18, date: '2026-06-02', status: 'Delivered' },
    { id: 'ORD-1005', customer: 'Thistle & Thyme', crate: 'Pumpkin', qty: 30, date: '2026-06-03', status: 'Delayed' },
    { id: 'ORD-1006', customer: 'Greenfield Co-op', crate: 'Kale, Lacinato', qty: 22, date: '2026-06-03', status: 'Delivered' },
    { id: 'ORD-1007', customer: 'Orchard Lane Bakery', crate: 'Apple, Honeycrisp', qty: 60, date: '2026-06-04', status: 'In transit' },
    { id: 'ORD-1008', customer: 'Maple & Vine Market', crate: 'Carrot, Nantes', qty: 35, date: '2026-06-04', status: 'Delivered' },
    { id: 'ORD-1009', customer: 'Riverside Kitchen', crate: 'Cucumber', qty: 16, date: '2026-06-05', status: 'Delivered' },
    { id: 'ORD-1010', customer: 'Hollow Creek Diner', crate: 'Rosemary', qty: 8, date: '2026-06-05', status: 'Delayed' },
    { id: 'ORD-1011', customer: 'Thistle & Thyme', crate: 'Winter Squash', qty: 27, date: '2026-06-06', status: 'Delivered' },
    { id: 'ORD-1012', customer: 'Orchard Lane Bakery', crate: 'Raspberry', qty: 14, date: '2026-06-06', status: 'In transit' },
    { id: 'ORD-1013', customer: 'Greenfield Co-op', crate: 'Potato, Russet', qty: 50, date: '2026-06-07', status: 'Delivered' },
    { id: 'ORD-1014', customer: 'Maple & Vine Market', crate: 'Sunflower, Cut', qty: 20, date: '2026-06-07', status: 'Delivered' },
    { id: 'ORD-1015', customer: 'Riverside Kitchen', crate: 'Beet, Detroit Dark Red', qty: 26, date: '2026-06-08', status: 'Delayed' },
    { id: 'ORD-1016', customer: 'Hollow Creek Diner', crate: 'Zucchini', qty: 19, date: '2026-06-08', status: 'Delivered' },
    { id: 'ORD-1017', customer: 'Thistle & Thyme', crate: 'Melon, Charentais', qty: 15, date: '2026-06-09', status: 'In transit' },
    { id: 'ORD-1018', customer: 'Orchard Lane Bakery', crate: 'Apple, Gala', qty: 55, date: '2026-06-09', status: 'Delivered' },
    { id: 'ORD-1019', customer: 'Greenfield Co-op', crate: 'Lettuce, Butterhead', qty: 33, date: '2026-06-10', status: 'Delivered' },
    { id: 'ORD-1020', customer: 'Maple & Vine Market', crate: 'Watermelon, Sugar Baby', qty: 10, date: '2026-06-10', status: 'In transit' },
    { id: 'ORD-1021', customer: 'Riverside Kitchen', crate: 'Thai Basil', qty: 9, date: '2026-06-11', status: 'Delivered' },
    { id: 'ORD-1022', customer: 'Hollow Creek Diner', crate: 'Radish, French Breakfast', qty: 28, date: '2026-06-11', status: 'Delayed' }
  ];

  var tbody = document.querySelector('.pag-tbl-body');
  var sizeSelect = document.querySelector('.pag-tbl-select');
  var indicator = document.querySelector('.pag-tbl-indicator');
  var prevBtn = document.querySelector('.pag-tbl-btn[data-action="prev"]');
  var nextBtn = document.querySelector('.pag-tbl-btn[data-action="next"]');
  if (!tbody) return;

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  var state = {
    page: 1,
    pageSize: parseInt(sizeSelect.value, 10)
  };

  function totalPages() {
    return Math.max(1, Math.ceil(orders.length / state.pageSize));
  }

  function render() {
    var pages = totalPages();
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;

    var start = (state.page - 1) * state.pageSize;
    var pageRows = orders.slice(start, start + state.pageSize);

    tbody.innerHTML = '';
    pageRows.forEach(function (row) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + row.id + '</td>' +
        '<td>' + row.customer + '</td>' +
        '<td>' + row.crate + '</td>' +
        '<td>' + row.qty + '</td>' +
        '<td>' + formatDate(row.date) + '</td>' +
        '<td><span class="pag-tbl-status" data-status="' + row.status + '">' + row.status + '</span></td>';
      tbody.appendChild(tr);
    });

    indicator.textContent = 'Page ' + state.page + ' of ' + pages;
    prevBtn.disabled = state.page <= 1;
    nextBtn.disabled = state.page >= pages;
  }

  sizeSelect.addEventListener('change', function () {
    state.pageSize = parseInt(sizeSelect.value, 10);
    state.page = 1;
    render();
  });

  prevBtn.addEventListener('click', function () {
    if (state.page > 1) {
      state.page -= 1;
      render();
    }
  });

  nextBtn.addEventListener('click', function () {
    if (state.page < totalPages()) {
      state.page += 1;
      render();
    }
  });

  render();
})();
