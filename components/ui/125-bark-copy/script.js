(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var button = document.getElementById('copyBtn');
  var codeSample = document.getElementById('codeSample');

  if (!button || !codeSample) return;

  var label = button.querySelector('.copy-label');
  var resetTimer = null;

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
      // ignore
    }
    document.body.removeChild(textarea);
  }

  function showCopied() {
    button.setAttribute('data-copy-state', 'copied');
    if (label) label.textContent = 'Copied!';

    if (resetTimer) clearTimeout(resetTimer);
    var delay = prefersReducedMotion ? 900 : 1600;
    resetTimer = setTimeout(function () {
      button.setAttribute('data-copy-state', 'idle');
      if (label) label.textContent = 'Copy';
    }, delay);
  }

  button.addEventListener('click', function () {
    var text = codeSample.textContent || '';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied, function () {
        fallbackCopy(text);
        showCopied();
      });
    } else {
      fallbackCopy(text);
      showCopied();
    }
  });
})();
