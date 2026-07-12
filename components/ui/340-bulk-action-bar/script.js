(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var selectAll = document.getElementById('bulkSelectAll');
  var list = document.getElementById('bulkList');
  var itemChecks = Array.prototype.slice.call(list.querySelectorAll('.bulk-check'));
  var bar = document.getElementById('bulkBar');
  var countEl = document.getElementById('bulkCount');
  var status = document.getElementById('bulkStatus');
  var actionBtns = Array.prototype.slice.call(bar.querySelectorAll('.bulk-bar-btn'));

  if (reduceMotion) {
    bar.style.transition = 'none';
  }

  var statusTimer = null;

  function selectedCount() {
    return itemChecks.filter(function (cb) { return cb.checked; }).length;
  }

  function updateUI() {
    var count = selectedCount();

    if (count > 0) {
      bar.classList.add('visible');
      countEl.textContent = count + (count === 1 ? ' item selected' : ' items selected');
    } else {
      bar.classList.remove('visible');
    }

    selectAll.checked = count === itemChecks.length;
    selectAll.indeterminate = count > 0 && count < itemChecks.length;
  }

  itemChecks.forEach(function (cb) {
    cb.addEventListener('change', updateUI);
  });

  selectAll.addEventListener('change', function () {
    itemChecks.forEach(function (cb) {
      cb.checked = selectAll.checked;
    });
    updateUI();
  });

  function clearSelection() {
    itemChecks.forEach(function (cb) { cb.checked = false; });
    updateUI();
  }

  actionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var count = selectedCount();
      if (count === 0) return;
      var action = btn.getAttribute('data-action');

      status.textContent = action + ' applied to ' + count + (count === 1 ? ' item.' : ' items.');
      window.clearTimeout(statusTimer);
      statusTimer = window.setTimeout(function () {
        status.textContent = '';
      }, 4000);

      clearSelection();
    });
  });

  updateUI();
})();
