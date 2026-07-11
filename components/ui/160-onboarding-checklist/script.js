(function () {
  var checklist = document.getElementById('checklist');
  var fill = document.getElementById('checklistFill');
  var pctEl = document.getElementById('checklistPct');
  var summaryEl = document.getElementById('checklistSummary');

  if (!checklist || !fill || !pctEl || !summaryEl) return;

  var items = Array.prototype.slice.call(checklist.querySelectorAll('.checklist__item'));

  function update() {
    var done = items.filter(function (item) {
      return item.classList.contains('is-done');
    }).length;
    var pct = Math.round((done / items.length) * 100);

    fill.style.width = pct + '%';
    pctEl.textContent = pct + '%';
    summaryEl.textContent = done + ' of ' + items.length + ' steps complete';

    if (done === items.length) {
      summaryEl.textContent = 'All steps complete — you’re all set!';
    }
  }

  items.forEach(function (item) {
    var check = item.querySelector('.checklist__check');
    if (!check) return;

    check.addEventListener('click', function () {
      var nowDone = !item.classList.contains('is-done');
      item.classList.toggle('is-done', nowDone);
      check.setAttribute('aria-checked', nowDone ? 'true' : 'false');
      update();
    });
  });

  update();
})();
