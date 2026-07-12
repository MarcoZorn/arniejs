(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tasks = [
    { id: 't1', task: 'Thin seedlings, north bed', assignee: 'Alma Reyes', plot: 'North Plot', due: '2026-07-14', priority: 'high' },
    { id: 't2', task: 'Repair drip line valve', assignee: 'Osei Boateng', plot: 'Greenhouse', due: '2026-07-15', priority: 'high' },
    { id: 't3', task: 'Rotate compost pile', assignee: 'Dan Kilroy', plot: 'Compost Yard', due: '2026-07-16', priority: 'medium' },
    { id: 't4', task: 'Label new tomato transplants', assignee: 'Priya Natarajan', plot: 'South Plot', due: '2026-07-16', priority: 'low' },
    { id: 't5', task: 'Inspect for aphids', assignee: 'Mei-Ling Cho', plot: 'Greenhouse', due: '2026-07-17', priority: 'high' },
    { id: 't6', task: 'Sharpen pruning shears', assignee: 'Tobias Wren', plot: 'Tool Shed', due: '2026-07-18', priority: 'low' },
    { id: 't7', task: 'Test soil pH, block D', assignee: 'Alma Reyes', plot: 'South Plot', due: '2026-07-18', priority: 'medium' },
    { id: 't8', task: 'Order replacement seed trays', assignee: 'Ines Duarte', plot: 'Greenhouse', due: '2026-07-19', priority: 'low' },
    { id: 't9', task: 'Stake tomato rows', assignee: 'Osei Boateng', plot: 'South Plot', due: '2026-07-20', priority: 'medium' },
    { id: 't10', task: 'Clean rain gutters, barn', assignee: 'Dan Kilroy', plot: 'Barn', due: '2026-07-20', priority: 'low' },
    { id: 't11', task: 'Harvest early squash', assignee: 'Priya Natarajan', plot: 'North Plot', due: '2026-07-21', priority: 'high' },
    { id: 't12', task: 'Reseed bare patches, cover crop', assignee: 'Mei-Ling Cho', plot: 'North Plot', due: '2026-07-22', priority: 'medium' }
  ];

  var priorityLabel = { high: 'High', medium: 'Medium', low: 'Low' };
  var selected = new Set();

  var body = document.getElementById('rslBody');
  var selectAll = document.getElementById('rslSelectAll');
  var summary = document.getElementById('rslSummary');
  var summaryText = document.getElementById('rslSummaryText');
  var clearBtn = document.getElementById('rslClear');
  if (!body || !selectAll) return;

  tasks.forEach(function (t) {
    var tr = document.createElement('tr');
    tr.dataset.id = t.id;

    var checkTd = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'rsl-row-check';
    checkbox.setAttribute('aria-label', 'Select task: ' + t.task);
    checkbox.dataset.id = t.id;
    checkTd.appendChild(checkbox);
    tr.appendChild(checkTd);

    [t.task, t.assignee, t.plot, t.due].forEach(function (val) {
      var td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });

    var prTd = document.createElement('td');
    var span = document.createElement('span');
    span.className = 'rsl-priority rsl-priority--' + t.priority;
    span.textContent = priorityLabel[t.priority];
    prTd.appendChild(span);
    tr.appendChild(prTd);

    body.appendChild(tr);
  });

  var rowChecks = Array.prototype.slice.call(body.querySelectorAll('.rsl-row-check'));

  function updateSummary() {
    var count = selected.size;
    if (count === 0) {
      summary.hidden = true;
    } else {
      summary.hidden = false;
      summaryText.textContent = count + ' of ' + tasks.length + ' selected';
    }
  }

  function updateSelectAllState() {
    if (selected.size === 0) {
      selectAll.checked = false;
      selectAll.indeterminate = false;
    } else if (selected.size === tasks.length) {
      selectAll.checked = true;
      selectAll.indeterminate = false;
    } else {
      selectAll.checked = false;
      selectAll.indeterminate = true;
    }
  }

  function setRowSelected(id, isSelected) {
    var tr = body.querySelector('tr[data-id="' + id + '"]');
    if (tr) tr.classList.toggle('is-selected', isSelected);
  }

  function toggleRow(id, isSelected) {
    if (isSelected) {
      selected.add(id);
    } else {
      selected.delete(id);
    }
    setRowSelected(id, isSelected);
    updateSelectAllState();
    updateSummary();
  }

  rowChecks.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      toggleRow(checkbox.dataset.id, checkbox.checked);
    });
  });

  selectAll.addEventListener('change', function () {
    var checkAll = selectAll.checked;
    rowChecks.forEach(function (checkbox) {
      checkbox.checked = checkAll;
      if (checkAll) {
        selected.add(checkbox.dataset.id);
      } else {
        selected.delete(checkbox.dataset.id);
      }
      setRowSelected(checkbox.dataset.id, checkAll);
    });
    updateSelectAllState();
    updateSummary();
  });

  clearBtn.addEventListener('click', function () {
    selected.clear();
    rowChecks.forEach(function (checkbox) {
      checkbox.checked = false;
      setRowSelected(checkbox.dataset.id, false);
    });
    updateSelectAllState();
    updateSummary();
  });

  updateSummary();
  updateSelectAllState();
})();
