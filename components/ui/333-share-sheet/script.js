(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('ssOpenBtn');
  var overlay = document.getElementById('ssOverlay');
  var sheet = document.getElementById('ssSheet');
  var closeBtn = document.getElementById('ssClose');
  var linkInput = document.getElementById('ssLinkInput');
  var copyBtn = document.getElementById('ssCopyBtn');
  var copyStatus = document.getElementById('ssCopyStatus');
  var networkStatus = document.getElementById('ssNetworkStatus');
  var networkButtons = Array.prototype.slice.call(document.querySelectorAll('.ss-target[data-network]'));

  var isOpen = false;
  var lastFocused = null;
  var statusTimer = null;

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    document.addEventListener('keydown', onKeydown, true);

    var focusTarget = closeBtn;
    if (reduceMotion) {
      focusTarget.focus();
    } else {
      window.setTimeout(function () {
        focusTarget.focus();
      }, 150);
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown, true);

    var finish = function () {
      overlay.hidden = true;
    };
    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 260);
    }

    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = sheet.querySelectorAll('button, a[href], input');
      focusable = Array.prototype.slice.call(focusable);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) close();
  });

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  function showCopyStatus(message) {
    copyStatus.textContent = message;
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      copyStatus.textContent = '';
    }, 2200);
  }

  function legacyCopyFallback(text) {
    var temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'absolute';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);

    var previousSelection = document.getSelection();
    var previousRange = previousSelection && previousSelection.rangeCount > 0
      ? previousSelection.getRangeAt(0)
      : null;

    temp.select();
    temp.setSelectionRange(0, temp.value.length);

    var succeeded = false;
    try {
      succeeded = document.execCommand('copy');
    } catch (err) {
      succeeded = false;
    }

    document.body.removeChild(temp);

    if (previousSelection && previousRange) {
      previousSelection.removeAllRanges();
      previousSelection.addRange(previousRange);
    }

    return succeeded;
  }

  copyBtn.addEventListener('click', function () {
    var text = linkInput.value;

    // Prefer the modern async clipboard API; fall back to execCommand for
    // older/insecure-context browsers where navigator.clipboard is unavailable.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          showCopyStatus('Copied!');
        },
        function () {
          var ok = legacyCopyFallback(text);
          showCopyStatus(ok ? 'Copied!' : 'Could not copy — select and copy manually.');
        }
      );
    } else {
      var ok = legacyCopyFallback(text);
      showCopyStatus(ok ? 'Copied!' : 'Could not copy — select and copy manually.');
    }
  });

  var networkLabels = {
    twitter: 'X',
    linkedin: 'LinkedIn',
    facebook: 'Facebook'
  };

  networkButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var network = btn.getAttribute('data-network');
      var label = networkLabels[network] || network;
      networkStatus.textContent = 'Opening ' + label + ' share (stub) — no live connection in this demo.';
      window.clearTimeout(statusTimer);
      statusTimer = window.setTimeout(function () {
        networkStatus.textContent = '';
      }, 2600);
    });
  });
})();
