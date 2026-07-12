(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var columns = [
    { key: 'sku', label: 'SKU', width: 110 },
    { key: 'item', label: 'Item', width: 200 },
    { key: 'category', label: 'Category', width: 140 },
    { key: 'bin', label: 'Bin', width: 90 },
    { key: 'qty', label: 'Qty on hand', width: 120 },
    { key: 'reorder', label: 'Reorder at', width: 110 },
    { key: 'supplier', label: 'Supplier', width: 170 },
    { key: 'lastCounted', label: 'Last counted', width: 130 }
  ];

  var rows = [
    { sku: 'SD-1001', item: 'Heirloom tomato seed', category: 'Seeds', bin: 'A3', qty: 420, reorder: 100, supplier: 'Green Hollow Farms', lastCounted: '2026-06-02' },
    { sku: 'SD-1002', item: 'Butternut squash seed', category: 'Seeds', bin: 'A4', qty: 210, reorder: 80, supplier: 'Green Hollow Farms', lastCounted: '2026-06-02' },
    { sku: 'TL-2010', item: 'Hand trowel', category: 'Tools', bin: 'C1', qty: 34, reorder: 10, supplier: 'Ridge Tool Co.', lastCounted: '2026-05-28' },
    { sku: 'TL-2011', item: 'Pruning shears', category: 'Tools', bin: 'C2', qty: 18, reorder: 8, supplier: 'Ridge Tool Co.', lastCounted: '2026-05-28' },
    { sku: 'FT-3005', item: 'Fish emulsion fertilizer', category: 'Fertilizer', bin: 'D2', qty: 62, reorder: 20, supplier: 'Bluewater Supply', lastCounted: '2026-06-10' },
    { sku: 'FT-3006', item: 'Compost tea concentrate', category: 'Fertilizer', bin: 'D3', qty: 45, reorder: 15, supplier: 'Bluewater Supply', lastCounted: '2026-06-10' },
    { sku: 'PT-4001', item: '4in terracotta pot', category: 'Pots', bin: 'E1', qty: 300, reorder: 60, supplier: 'Ridge Tool Co.', lastCounted: '2026-06-15' },
    { sku: 'PT-4002', item: '10in ceramic planter', category: 'Pots', bin: 'E2', qty: 55, reorder: 20, supplier: 'Ridge Tool Co.', lastCounted: '2026-06-15' },
    { sku: 'IR-5010', item: 'Drip line, 100ft', category: 'Irrigation', bin: 'F1', qty: 27, reorder: 10, supplier: 'Bluewater Supply', lastCounted: '2026-05-30' },
    { sku: 'IR-5011', item: 'Emitter stakes (pack 50)', category: 'Irrigation', bin: 'F2', qty: 80, reorder: 25, supplier: 'Bluewater Supply', lastCounted: '2026-05-30' },
    { sku: 'SD-1003', item: 'Sweet basil seed', category: 'Seeds', bin: 'A1', qty: 500, reorder: 120, supplier: 'Green Hollow Farms', lastCounted: '2026-06-02' },
    { sku: 'TL-2012', item: 'Garden fork', category: 'Tools', bin: 'C3', qty: 12, reorder: 6, supplier: 'Ridge Tool Co.', lastCounted: '2026-05-28' },
    { sku: 'FT-3007', item: 'Bone meal', category: 'Fertilizer', bin: 'D1', qty: 38, reorder: 12, supplier: 'Bluewater Supply', lastCounted: '2026-06-10' },
    { sku: 'PT-4003', item: '6in nursery pot (pack 20)', category: 'Pots', bin: 'E3', qty: 150, reorder: 40, supplier: 'Ridge Tool Co.', lastCounted: '2026-06-15' },
    { sku: 'IR-5012', item: 'Timer valve', category: 'Irrigation', bin: 'F3', qty: 9, reorder: 5, supplier: 'Bluewater Supply', lastCounted: '2026-05-30' }
  ];

  var MIN_WIDTH = 64;

  var table = document.getElementById('drzTable');
  var headRow = document.getElementById('drzHeadRow');
  var body = document.getElementById('drzBody');
  if (!table || !headRow || !body) return;

  columns.forEach(function (col, i) {
    var th = document.createElement('th');
    th.textContent = col.label;
    th.style.width = col.width + 'px';
    th.dataset.colIndex = String(i);

    var handle = document.createElement('span');
    handle.className = 'drz-resize-handle';
    handle.setAttribute('aria-hidden', 'true');
    th.appendChild(handle);

    headRow.appendChild(th);
  });

  rows.forEach(function (row) {
    var tr = document.createElement('tr');
    columns.forEach(function (col) {
      var td = document.createElement('td');
      var val = row[col.key];
      if (col.key === 'qty' || col.key === 'reorder') {
        td.textContent = val.toLocaleString();
      } else {
        td.textContent = val;
      }
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });

  var ths = Array.prototype.slice.call(headRow.querySelectorAll('th'));

  function startResize(th, colIndex, startX, startWidth, handle) {
    handle.classList.add('is-active');
    table.classList.add('is-resizing');

    function onMove(clientX) {
      var delta = clientX - startX;
      var newWidth = Math.max(MIN_WIDTH, startWidth + delta);
      th.style.width = newWidth + 'px';
      columns[colIndex].width = newWidth;
    }

    function onMouseMove(e) {
      onMove(e.clientX);
    }
    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        onMove(e.touches[0].clientX);
        e.preventDefault();
      }
    }
    function stop() {
      handle.classList.remove('is-active');
      table.classList.remove('is-resizing');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stop);
      window.removeEventListener('touchcancel', stop);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', stop);
    window.addEventListener('touchcancel', stop);
  }

  ths.forEach(function (th, colIndex) {
    var handle = th.querySelector('.drz-resize-handle');
    if (!handle) return;

    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      startResize(th, colIndex, e.clientX, th.getBoundingClientRect().width, handle);
    });

    handle.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches[0]) return;
      startResize(th, colIndex, e.touches[0].clientX, th.getBoundingClientRect().width, handle);
    }, { passive: true });

    // keyboard accessible resize as a fallback for non-pointer users
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'separator');
    handle.setAttribute('aria-label', 'Resize ' + columns[colIndex].label + ' column');
    handle.addEventListener('keydown', function (e) {
      var step = 16;
      var current = th.getBoundingClientRect().width;
      if (e.key === 'ArrowLeft') {
        var next = Math.max(MIN_WIDTH, current - step);
        th.style.width = next + 'px';
        columns[colIndex].width = next;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        var next2 = current + step;
        th.style.width = next2 + 'px';
        columns[colIndex].width = next2;
        e.preventDefault();
      }
    });
  });
})();
