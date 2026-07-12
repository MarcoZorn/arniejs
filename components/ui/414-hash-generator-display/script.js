(function () {
  var input = document.getElementById('hsh-input');
  var digestEl = document.getElementById('hsh-digest');
  var statusEl = document.getElementById('hsh-status');
  var copyBtn = document.getElementById('hsh-copy');
  var confirmEl = document.getElementById('hsh-confirm');

  if (!input || !digestEl) return;

  var debounceTimer = null;
  var requestId = 0;

  function bufferToHex(buffer) {
    var bytes = new Uint8Array(buffer);
    var hex = '';
    for (var i = 0; i < bytes.length; i++) {
      var h = bytes[i].toString(16);
      hex += h.length === 1 ? '0' + h : h;
    }
    return hex;
  }

  function computeHash(text) {
    var thisRequest = ++requestId;

    if (!text) {
      digestEl.textContent = '—';
      statusEl.textContent = '';
      statusEl.classList.remove('hsh-status--computing');
      return;
    }

    if (!window.crypto || !window.crypto.subtle) {
      statusEl.textContent = 'Web Crypto unavailable';
      return;
    }

    statusEl.textContent = 'Computing…';
    statusEl.classList.add('hsh-status--computing');

    var encoder = new TextEncoder();
    var data = encoder.encode(text);

    window.crypto.subtle.digest('SHA-256', data).then(function (buffer) {
      if (thisRequest !== requestId) return; // stale response, input changed since
      digestEl.textContent = bufferToHex(buffer);
      statusEl.textContent = 'Updated';
      statusEl.classList.remove('hsh-status--computing');
    }).catch(function () {
      if (thisRequest !== requestId) return;
      statusEl.textContent = 'Error computing hash';
      statusEl.classList.remove('hsh-status--computing');
    });
  }

  input.addEventListener('input', function () {
    var text = input.value;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      computeHash(text);
    }, 250);
  });

  var confirmTimer = null;
  function showConfirm(text) {
    confirmEl.textContent = text;
    confirmEl.classList.add('hsh-show');
    if (confirmTimer) clearTimeout(confirmTimer);
    confirmTimer = setTimeout(function () {
      confirmEl.classList.remove('hsh-show');
    }, 1800);
  }

  copyBtn.addEventListener('click', function () {
    var text = digestEl.textContent;
    if (!text || text === '—') return;

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
})();
