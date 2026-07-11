(function () {
  var btn = document.getElementById('shareBtn');
  var label = document.getElementById('shareLabel');
  var hint = document.getElementById('shareHint');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var defaultLabel = label.textContent;
  var hintTimer = null;

  function showHint(text) {
    hint.textContent = text;
    hint.classList.add('visible');
    if (hintTimer) {
      clearTimeout(hintTimer);
    }
    hintTimer = setTimeout(function () {
      hint.classList.remove('visible');
    }, 2600);
  }

  function flashCopied() {
    btn.classList.add('copied');
    label.textContent = 'Copied to clipboard';
    showHint('Link copied — go plant it somewhere.');
    setTimeout(function () {
      btn.classList.remove('copied');
      label.textContent = defaultLabel;
    }, reduceMotion ? 0 : 1800);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      /* ignore */
    }
    document.body.removeChild(textarea);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        flashCopied();
      }).catch(function () {
        fallbackCopy(text);
        flashCopied();
      });
    } else {
      fallbackCopy(text);
      flashCopied();
    }
  }

  btn.addEventListener('click', function () {
    var url = btn.getAttribute('data-url') || window.location.href;
    var title = btn.getAttribute('data-title') || document.title;
    var text = btn.getAttribute('data-text') || '';

    if (navigator.share) {
      navigator.share({ title: title, text: text, url: url })
        .then(function () {
          showHint('Shared successfully.');
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') {
            return;
          }
          copyToClipboard(url);
        });
    } else {
      copyToClipboard(url);
    }
  });
})();
