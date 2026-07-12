(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var orders = [
    { id: 'SO-3001', grower: 'Alma Reyes', variety: 'Heirloom Tomato "Brandywine"', qty: 500, unit: 'seeds', date: '2026-02-14', status: 'shipped' },
    { id: 'SO-3002', grower: 'Dan "Sparrow" Kilroy', variety: 'Butternut Squash', qty: 250, unit: 'seeds', date: '2026-02-18', status: 'shipped' },
    { id: 'SO-3003', grower: 'Priya Natarajan', variety: 'Sweet Basil, Genovese', qty: 1000, unit: 'seeds', date: '2026-02-20', status: 'pending' },
    { id: 'SO-3004', grower: 'Green Hollow Co-op', variety: 'Rainbow Chard', qty: 800, unit: 'seeds', date: '2026-02-22', status: 'shipped' },
    { id: 'SO-3005', grower: 'Tobias Wren', variety: 'Purple Top Turnip', qty: 300, unit: 'seeds', date: '2026-02-25', status: 'backorder' },
    { id: 'SO-3006', grower: 'Mei-Ling Cho', variety: 'Snap Pea, "Sugar Ann"', qty: 600, unit: 'seeds', date: '2026-03-01', status: 'shipped' },
    { id: 'SO-3007', grower: 'Alma Reyes', variety: 'Jalapeño, "Early"', qty: 200, unit: 'seeds', date: '2026-03-03', status: 'pending' },
    { id: 'SO-3008', grower: 'Osei Boateng', variety: 'Okra, "Clemson Spineless"', qty: 400, unit: 'seeds', date: '2026-03-05', status: 'shipped' },
    { id: 'SO-3009', grower: 'Green Hollow Co-op', variety: 'Zucchini, "Black Beauty"', qty: 350, unit: 'seeds', date: '2026-03-08', status: 'backorder' },
    { id: 'SO-3010', grower: 'Ines Duarte', variety: 'Sunflower, "Mammoth"', qty: 150, unit: 'bulbs', date: '2026-03-10', status: 'shipped' },
    { id: 'SO-3011', grower: 'Dan "Sparrow" Kilroy', variety: 'Carrot, "Nantes"', qty: 900, unit: 'seeds', date: '2026-03-12', status: 'pending' },
    { id: 'SO-3012', grower: 'Priya Natarajan', variety: 'Cucumber, "Marketmore"', qty: 500, unit: 'seeds', date: '2026-03-15', status: 'shipped' }
  ];

  var body = document.getElementById('cxbBody');
  var exportBtn = document.getElementById('cxbExport');
  var status = document.getElementById('cxbStatus');
  if (!body || !exportBtn) return;

  var statusLabel = { shipped: 'Shipped', pending: 'Pending', backorder: 'Backorder' };

  orders.forEach(function (order) {
    var tr = document.createElement('tr');

    [order.id, order.grower, order.variety, order.qty.toLocaleString(), order.unit, order.date].forEach(function (val) {
      var td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });

    var statusTd = document.createElement('td');
    var tag = document.createElement('span');
    tag.className = 'cxb-tag cxb-tag--' + order.status;
    tag.textContent = statusLabel[order.status];
    statusTd.appendChild(tag);
    tr.appendChild(statusTd);

    body.appendChild(tr);
  });

  function csvEscape(value) {
    var str = String(value);
    if (/[",\n]/.test(str)) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function buildCsv() {
    var headers = ['Order ID', 'Grower', 'Variety', 'Quantity', 'Unit', 'Order date', 'Status'];
    var lines = [headers.map(csvEscape).join(',')];

    orders.forEach(function (order) {
      var row = [order.id, order.grower, order.variety, order.qty, order.unit, order.date, statusLabel[order.status]];
      lines.push(row.map(csvEscape).join(','));
    });

    return lines.join('\r\n');
  }

  var statusTimer = null;

  exportBtn.addEventListener('click', function () {
    var csv = buildCsv();
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);

    var link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'seed-orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);

    if (status) {
      status.textContent = 'Exported ' + orders.length + ' orders to seed-orders.csv';
      status.classList.add('is-visible');
      window.clearTimeout(statusTimer);
      statusTimer = window.setTimeout(function () {
        status.classList.remove('is-visible');
      }, 3500);
    }

    if (!reduceMotion) {
      exportBtn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
        { duration: 200, easing: 'ease-out' }
      );
    }
  });
})();
