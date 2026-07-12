(function () {
  var rowsEl = document.getElementById('envd-rows');
  var addBtn = document.getElementById('envd-add');
  var copyBtn = document.getElementById('envd-copy');
  var confirmEl = document.getElementById('envd-confirm');
  var template = document.getElementById('envd-row-template');

  if (!rowsEl || !template) return;

  var sampleRows = [
    { key: 'API_URL', value: 'https://api.example.com' },
    { key: 'NODE_ENV', value: 'development' },
    { key: 'PORT', value: '3000' }
  ];

  function createRow(key, value) {
    var fragment = template.content.cloneNode(true);
    var row = fragment.querySelector('.envd-row');
    var keyInput = row.querySelector('.envd-key');
    var valueInput = row.querySelector('.envd-value');
    var removeBtn = row.querySelector('.envd-remove');

    keyInput.value = key || '';
    valueInput.value = value || '';

    removeBtn.addEventListener('click', function () {
      row.remove();
    });

    rowsEl.appendChild(row);
    return row;
  }

  sampleRows.forEach(function (r) {
    createRow(r.key, r.value);
  });

  addBtn.addEventListener('click', function () {
    var row = createRow('', '');
    var keyInput = row.querySelector('.envd-key');
    if (keyInput) keyInput.focus();
  });

  function buildEnvText() {
    var rows = Array.prototype.slice.call(rowsEl.querySelectorAll('.envd-row'));
    var lines = [];

    rows.forEach(function (row) {
      var keyInput = row.querySelector('.envd-key');
      var valueInput = row.querySelector('.envd-value');
      var key = (keyInput.value || '').trim();
      var value = (valueInput.value || '').trim();

      if (!key && !value) return;

      lines.push(key + '=' + value);
    });

    return lines.join('\n');
  }

  var confirmTimer = null;

  function showConfirm(text) {
    confirmEl.textContent = text;
    confirmEl.classList.add('envd-show');
    if (confirmTimer) clearTimeout(confirmTimer);
    confirmTimer = setTimeout(function () {
      confirmEl.classList.remove('envd-show');
    }, 1800);
  }

  copyBtn.addEventListener('click', function () {
    var text = buildEnvText();

    function fallbackCopy() {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showConfirm('Copied!');
      } catch (err) {
        showConfirm('Copy failed');
      }
      document.body.removeChild(textarea);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showConfirm('Copied!');
      }).catch(function () {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  });
})();
