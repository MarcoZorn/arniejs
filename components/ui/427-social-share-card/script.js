(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var copyBtn = document.querySelector('.share-btn--link');
  if (!copyBtn) return;

  var label = copyBtn.querySelector('.share-btn-label');
  var defaultLabel = label ? label.textContent : 'Copy link';
  var revertTimer = null;

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(textarea);
    return ok;
  }

  function showCopied() {
    copyBtn.classList.add('is-copied');
    if (label) label.textContent = 'Copied!';

    if (!reduceMotion) {
      copyBtn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.05)' },
          { transform: 'scale(1)' }
        ],
        { duration: 220, easing: 'ease-out' }
      );
    }

    window.clearTimeout(revertTimer);
    revertTimer = window.setTimeout(function () {
      copyBtn.classList.remove('is-copied');
      if (label) label.textContent = defaultLabel;
    }, 2000);
  }

  copyBtn.addEventListener('click', function () {
    var url = copyBtn.getAttribute('data-copy') || window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(showCopied, function () {
        if (fallbackCopy(url)) showCopied();
      });
    } else {
      if (fallbackCopy(url)) showCopied();
    }
  });
})();
