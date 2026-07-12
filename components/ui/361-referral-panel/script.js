(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var input = document.getElementById('ref-link');
  var btn = document.getElementById('ref-copy-btn');
  var status = document.getElementById('ref-copy-status');
  if (!input || !btn) return;

  var revertTimer = null;

  function fallbackCopy(text) {
    var temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'absolute';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    temp.setSelectionRange(0, temp.value.length);
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(temp);
    return ok;
  }

  function showCopied() {
    btn.textContent = 'Copied!';
    btn.classList.add('is-copied');
    if (status) status.textContent = 'Referral link copied to clipboard.';

    window.clearTimeout(revertTimer);
    revertTimer = window.setTimeout(function () {
      btn.textContent = btn.getAttribute('data-default') || 'Copy';
      btn.classList.remove('is-copied');
      if (status) status.textContent = '';
    }, 2000);
  }

  btn.addEventListener('click', function () {
    var text = input.value;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied, function () {
        if (fallbackCopy(text)) showCopied();
      });
    } else if (fallbackCopy(text)) {
      showCopied();
    }

    if (!reduceMotion) {
      btn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.95)' },
          { transform: 'scale(1)' }
        ],
        { duration: 200, easing: 'ease-out' }
      );
    }
  });

  // Tapping the input selects the full text for quick manual copy on mobile.
  input.addEventListener('click', function () {
    input.focus();
    input.setSelectionRange(0, input.value.length);
  });
})();
