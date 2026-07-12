(function () {
  var toggleBtns = Array.prototype.slice.call(document.querySelectorAll('.b64-toggle-btn'));
  var input = document.getElementById('b64-input');
  var output = document.getElementById('b64-output');
  var inputLabel = document.getElementById('b64-input-label');
  var outputLabel = document.getElementById('b64-output-label');
  var errorEl = document.getElementById('b64-error');
  var copyBtn = document.getElementById('b64-copy');
  var confirmEl = document.getElementById('b64-confirm');

  if (!input || !output) return;

  var mode = 'encode';

  function encodeUtf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function decodeBase64ToUtf8(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  function updateLabels() {
    if (mode === 'encode') {
      inputLabel.textContent = 'Text to encode';
      outputLabel.textContent = 'Base64 output';
      input.placeholder = 'Type or paste text here…';
    } else {
      inputLabel.textContent = 'Base64 to decode';
      outputLabel.textContent = 'Decoded text';
      input.placeholder = 'Paste Base64 here…';
    }
  }

  function convert() {
    var value = input.value;
    errorEl.textContent = '';
    output.classList.remove('b64-has-error');

    if (!value) {
      output.value = '';
      return;
    }

    try {
      if (mode === 'encode') {
        output.value = encodeUtf8ToBase64(value);
      } else {
        output.value = decodeBase64ToUtf8(value);
      }
    } catch (err) {
      output.value = '';
      output.classList.add('b64-has-error');
      errorEl.textContent = mode === 'encode'
        ? 'Could not encode that text.'
        : 'That is not valid Base64.';
    }
  }

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.dataset.mode === mode) return;
      mode = btn.dataset.mode;
      toggleBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      updateLabels();
      convert();
    });
  });

  input.addEventListener('input', convert);

  var confirmTimer = null;
  function showConfirm(text) {
    confirmEl.textContent = text;
    confirmEl.classList.add('b64-show');
    if (confirmTimer) clearTimeout(confirmTimer);
    confirmTimer = setTimeout(function () {
      confirmEl.classList.remove('b64-show');
    }, 1800);
  }

  copyBtn.addEventListener('click', function () {
    var text = output.value;
    if (!text) return;

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
      }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  updateLabels();
})();
