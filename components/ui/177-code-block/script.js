(function () {
  var codeEl = document.getElementById('codeSample');
  var copyBtn = document.getElementById('copyCodeBtn');

  if (!codeEl) return;

  var rawCode = codeEl.textContent;

  var KEYWORDS = [
    'const', 'let', 'var', 'function', 'return', 'for', 'of', 'if', 'else',
    'continue', 'break', 'new', 'class', 'import', 'export', 'from',
    'async', 'await', 'try', 'catch', 'typeof'
  ];

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlight(source) {
    var pattern = new RegExp(
      '(\\/\\/[^\\n]*)' +                          // 1 line comment
      '|("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|`(?:[^`\\\\]|\\\\.)*`)' + // 2 strings/template literals
      '|(\\b\\d+\\.?\\d*\\b)' +                     // 3 numbers
      '|(\\b(?:' + KEYWORDS.join('|') + ')\\b)' +   // 4 keywords
      '|([A-Za-z_$][\\w$]*)(?=\\()',                // 5 function calls
      'g'
    );

    var result = '';
    var lastIndex = 0;
    var match;

    while ((match = pattern.exec(source)) !== null) {
      result += escapeHtml(source.slice(lastIndex, match.index));

      if (match[1]) {
        result += '<span class="tok-comment">' + escapeHtml(match[1]) + '</span>';
      } else if (match[2]) {
        result += '<span class="tok-string">' + escapeHtml(match[2]) + '</span>';
      } else if (match[3]) {
        result += '<span class="tok-number">' + escapeHtml(match[3]) + '</span>';
      } else if (match[4]) {
        result += '<span class="tok-keyword">' + escapeHtml(match[4]) + '</span>';
      } else if (match[5]) {
        result += '<span class="tok-function">' + escapeHtml(match[5]) + '</span>';
      }

      lastIndex = pattern.lastIndex;
    }

    result += escapeHtml(source.slice(lastIndex));
    return result;
  }

  codeEl.innerHTML = highlight(rawCode);

  if (!copyBtn) return;

  var iconCopy = copyBtn.querySelector('.icon-copy');
  var iconCheck = copyBtn.querySelector('.icon-check');
  var label = copyBtn.querySelector('.code-block__copy-label');
  var resetTimer = null;

  copyBtn.addEventListener('click', function () {
    copyText(rawCode);
  });

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onCopied, function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      onCopied();
    } catch (err) {
      /* clipboard unavailable, silently ignore */
    }
    document.body.removeChild(textarea);
  }

  function onCopied() {
    copyBtn.classList.add('is-copied');
    iconCopy.hidden = true;
    iconCheck.hidden = false;
    label.textContent = 'Copied';

    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () {
      copyBtn.classList.remove('is-copied');
      iconCopy.hidden = false;
      iconCheck.hidden = true;
      label.textContent = 'Copy';
    }, 2000);
  }
})();
