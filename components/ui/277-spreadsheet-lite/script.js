(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var COLS = 6;
  var ROWS = 10;
  var COL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  var grid = document.getElementById('sslt-grid');
  var activeLabel = document.getElementById('sslt-active-cell');
  var clearBtn = document.getElementById('sslt-clear');
  if (!grid) return;

  // A little realistic seed data — a harvest tally sheet.
  var seed = {
    '0-0': 'Plot', '0-1': 'Crop', '0-2': 'Rows', '0-3': 'Yield (kg)', '0-4': 'Grade', '0-5': 'Notes',
    '1-0': 'A1', '1-1': 'Tomato', '1-2': '12', '1-3': '84', '1-4': 'A', '1-5': 'Early bloom',
    '2-0': 'A2', '2-1': 'Squash', '2-2': '8', '2-3': '61', '2-4': 'B', '2-5': '',
    '3-0': 'B1', '3-1': 'Kale', '3-2': '20', '3-3': '35', '3-4': 'A', '3-5': 'Second cut'
  };

  function cellKey(row, col) {
    return row + '-' + col;
  }

  var inputs = [];

  // Build header row (corner + column letters)
  var corner = document.createElement('div');
  corner.className = 'sslt-cell sslt-corner';
  corner.textContent = '';
  grid.appendChild(corner);

  COL_LETTERS.forEach(function (letter) {
    var head = document.createElement('div');
    head.className = 'sslt-cell sslt-colhead';
    head.textContent = letter;
    grid.appendChild(head);
  });

  for (var r = 0; r < ROWS; r++) {
    var rowHead = document.createElement('div');
    rowHead.className = 'sslt-cell sslt-rowhead';
    rowHead.textContent = String(r + 1);
    grid.appendChild(rowHead);

    inputs[r] = [];

    for (var c = 0; c < COLS; c++) {
      var cellWrap = document.createElement('div');
      cellWrap.className = 'sslt-cell';

      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'sslt-input';
      input.setAttribute('role', 'gridcell');
      input.setAttribute('data-row', String(r));
      input.setAttribute('data-col', String(c));
      input.setAttribute('aria-label', COL_LETTERS[c] + String(r + 1));

      var seedVal = seed[cellKey(r, c)];
      if (seedVal !== undefined) input.value = seedVal;

      cellWrap.appendChild(input);
      grid.appendChild(cellWrap);
      inputs[r][c] = input;
    }
  }

  function focusCell(r, c) {
    r = Math.max(0, Math.min(ROWS - 1, r));
    c = Math.max(0, Math.min(COLS - 1, c));
    var target = inputs[r][c];
    if (!target) return;
    target.focus();
    // Place caret at end rather than selecting all, so typing continues naturally.
    var len = target.value.length;
    try { target.setSelectionRange(len, len); } catch (e) {}
  }

  function updateActiveLabel(r, c) {
    activeLabel.textContent = 'Cell ' + COL_LETTERS[c] + (r + 1);
  }

  grid.addEventListener('focusin', function (e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains('sslt-input')) return;
    updateActiveLabel(Number(t.dataset.row), Number(t.dataset.col));
  });

  grid.addEventListener('keydown', function (e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains('sslt-input')) return;
    var r = Number(t.dataset.row);
    var c = Number(t.dataset.col);

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        focusCell(r - 1, c);
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusCell(r + 1, c);
        break;
      case 'ArrowLeft':
        if (t.selectionStart === 0 && t.selectionEnd === 0) {
          e.preventDefault();
          focusCell(r, c - 1);
        }
        break;
      case 'ArrowRight':
        if (t.selectionStart === t.value.length && t.selectionEnd === t.value.length) {
          e.preventDefault();
          focusCell(r, c + 1);
        }
        break;
      case 'Enter':
        e.preventDefault();
        focusCell(r + 1, c);
        break;
      case 'Tab':
        // Let Tab move naturally between inputs (DOM order matches column order),
        // but wrap to next row's first cell when tabbing past the last column.
        if (!e.shiftKey && c === COLS - 1) {
          e.preventDefault();
          focusCell(r + 1, 0);
        } else if (e.shiftKey && c === 0) {
          e.preventDefault();
          focusCell(r - 1, COLS - 1);
        }
        break;
      default:
        break;
    }
  });

  clearBtn.addEventListener('click', function () {
    inputs.forEach(function (row) {
      row.forEach(function (input) { input.value = ''; });
    });
    focusCell(0, 0);
  });

  updateActiveLabel(0, 0);
})();
