(function () {
  var oldText = [
    "module.exports = {",
    "  appName: 'Grove',",
    "  version: '1.4.0',",
    "  theme: 'dark',",
    "  features: {",
    "    analytics: false,",
    "    betaSync: false",
    "  },",
    "  maxUploadSizeMb: 10,",
    "  retries: 2",
    "};"
  ].join('\n');

  var newText = [
    "module.exports = {",
    "  appName: 'Grove',",
    "  version: '1.5.0',",
    "  theme: 'dark',",
    "  features: {",
    "    analytics: true,",
    "    betaSync: false,",
    "    exportPdf: true",
    "  },",
    "  maxUploadSizeMb: 25,",
    "  retries: 3,",
    "  timeoutMs: 8000",
    "};"
  ].join('\n');

  function diffLines(a, b) {
    var la = a.split('\n');
    var lb = b.split('\n');
    var n = la.length, m = lb.length;
    var lcs = [];
    for (var i = 0; i <= n; i++) {
      lcs.push(new Array(m + 1).fill(0));
    }
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        lcs[i][j] = la[i] === lb[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
      }
    }

    var result = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (la[i] === lb[j]) {
        result.push({ type: 'same', left: la[i], right: lb[j] });
        i++; j++;
      } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
        result.push({ type: 'remove', left: la[i], right: null });
        i++;
      } else {
        result.push({ type: 'add', left: null, right: lb[j] });
        j++;
      }
    }
    while (i < n) { result.push({ type: 'remove', left: la[i], right: null }); i++; }
    while (j < m) { result.push({ type: 'add', left: null, right: lb[j] }); j++; }
    return result;
  }

  function buildCol(rows, side) {
    var col = document.createElement('div');
    col.className = 'diff-col diff-col--' + side;
    var lineNo = 0;

    rows.forEach(function (row) {
      var line = document.createElement('div');
      var value = side === 'left' ? row.left : row.right;
      var isEmpty = value === null;
      var cls = 'diff-line';

      if (isEmpty) {
        cls += ' diff-line--empty';
      } else if (row.type === 'add') {
        cls += side === 'right' ? ' diff-line--add' : '';
      } else if (row.type === 'remove') {
        cls += side === 'left' ? ' diff-line--remove' : '';
      }
      line.className = cls;

      var num = document.createElement('span');
      num.className = 'diff-line__num';
      if (!isEmpty) {
        lineNo++;
        num.textContent = String(lineNo);
      }
      line.appendChild(num);

      var text = document.createElement('span');
      text.className = 'diff-line__text';
      text.textContent = isEmpty ? '' : value;
      line.appendChild(text);

      col.appendChild(line);
    });

    return col;
  }

  var rows = diffLines(oldText, newText);
  var grid = document.getElementById('diffGrid');
  grid.appendChild(buildCol(rows, 'left'));
  grid.appendChild(buildCol(rows, 'right'));
})();
