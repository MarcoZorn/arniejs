(function () {
  var beforeEl = document.getElementById('dif-before');
  var afterEl = document.getElementById('dif-after');
  var compareBtn = document.getElementById('dif-compare');
  var resultEl = document.getElementById('dif-result');

  var sampleBefore = [
    'function waterPlants(garden) {',
    '  for (var i = 0; i < garden.length; i++) {',
    '    garden[i].water();',
    '  }',
    '  console.log("done watering");',
    '}'
  ].join('\n');

  var sampleAfter = [
    'function waterPlants(garden) {',
    '  garden.forEach(function (plot) {',
    '    plot.water();',
    '    plot.checkSoil();',
    '  });',
    '  console.log("done watering");',
    '}'
  ].join('\n');

  beforeEl.value = sampleBefore;
  afterEl.value = sampleAfter;

  // Real LCS-based line diff. Builds a DP table over the two line arrays,
  // then walks it backward to emit a sequence of equal/add/remove ops.
  function diffLines(a, b) {
    var n = a.length;
    var m = b.length;
    var dp = [];
    var i, j;
    for (i = 0; i <= n; i++) {
      dp.push(new Array(m + 1).fill(0));
    }
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        if (a[i] === b[j]) {
          dp[i][j] = dp[i + 1][j + 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    var ops = [];
    i = 0;
    j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) {
        ops.push({ type: 'same', text: a[i] });
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        ops.push({ type: 'del', text: a[i] });
        i++;
      } else {
        ops.push({ type: 'add', text: b[j] });
        j++;
      }
    }
    while (i < n) {
      ops.push({ type: 'del', text: a[i] });
      i++;
    }
    while (j < m) {
      ops.push({ type: 'add', text: b[j] });
      j++;
    }
    return ops;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function render() {
    var beforeLines = beforeEl.value.replace(/\r\n/g, '\n').split('\n');
    var afterLines = afterEl.value.replace(/\r\n/g, '\n').split('\n');
    var ops = diffLines(beforeLines, afterLines);

    resultEl.innerHTML = '';

    if (ops.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'dif-empty';
      empty.textContent = 'Nothing to compare yet.';
      resultEl.appendChild(empty);
      return;
    }

    var beforeNum = 1;
    var afterNum = 1;
    var frag = document.createDocumentFragment();

    ops.forEach(function (op) {
      var row = document.createElement('div');
      var gutter = document.createElement('span');
      var marker = document.createElement('span');
      var text = document.createElement('span');
      gutter.className = 'dif-line-gutter';
      marker.className = 'dif-line-marker';
      text.className = 'dif-line-text';
      text.innerHTML = escapeHtml(op.text) || '&nbsp;';

      if (op.type === 'same') {
        row.className = 'dif-line dif-line--same';
        gutter.textContent = beforeNum + ' / ' + afterNum;
        marker.textContent = ' ';
        beforeNum++;
        afterNum++;
      } else if (op.type === 'del') {
        row.className = 'dif-line dif-line--del';
        gutter.textContent = beforeNum + ' /';
        marker.textContent = '-';
        beforeNum++;
      } else {
        row.className = 'dif-line dif-line--add';
        gutter.textContent = '/ ' + afterNum;
        marker.textContent = '+';
        afterNum++;
      }

      row.appendChild(gutter);
      row.appendChild(marker);
      row.appendChild(text);
      frag.appendChild(row);
    });

    resultEl.appendChild(frag);
  }

  compareBtn.addEventListener('click', render);

  render();
})();
