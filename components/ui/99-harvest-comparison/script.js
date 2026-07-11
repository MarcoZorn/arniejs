(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var table = document.querySelector('.harvest-table');
  if (!table) return;

  var columns = Array.prototype.slice.call(table.querySelectorAll('.harvest-col'));

  // Build a row index for every cell based on its position within its column,
  // then wire hover so the whole row highlights across all columns.
  columns.forEach(function (col) {
    var cells = Array.prototype.slice.call(col.children);
    cells.forEach(function (cell, rowIndex) {
      cell.dataset.rowIndex = rowIndex;

      // Skip head/spacer/group rows for row-hover highlighting.
      var isInteractiveRow = !cell.classList.contains('harvest-cell--head') &&
        !cell.classList.contains('harvest-cell--group') &&
        !cell.classList.contains('harvest-cell--spacer');

      if (!isInteractiveRow) return;

      cell.addEventListener('mouseenter', function () {
        highlightRow(rowIndex, true);
      });
      cell.addEventListener('mouseleave', function () {
        highlightRow(rowIndex, false);
      });
    });
  });

  function highlightRow(rowIndex, on) {
    columns.forEach(function (col) {
      var cell = col.children[rowIndex];
      if (!cell) return;
      cell.classList.toggle('is-row-hover', on);
    });
  }

  // CTA buttons: brief confirmation message + tactile press feedback.
  var note = document.querySelector('.harvest-note');
  var ctas = Array.prototype.slice.call(table.querySelectorAll('.harvest-cta'));
  var noteTimer = null;

  ctas.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var plan = btn.getAttribute('data-plan') || 'this plan';

      if (note) {
        note.textContent = 'You selected the ' + plan + ' plan. Let’s get planting.';
        window.clearTimeout(noteTimer);
        noteTimer = window.setTimeout(function () {
          note.textContent = '';
        }, 4000);
      }

      if (reduceMotion) return;

      btn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.96)' },
          { transform: 'scale(1)' }
        ],
        { duration: 220, easing: 'ease-out' }
      );
    });
  });
})();
