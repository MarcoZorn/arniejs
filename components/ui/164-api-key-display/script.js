(function () {
  var keyValue = document.getElementById('keyValue');
  var keyRow = keyValue ? keyValue.closest('.key-card__row') : null;
  var copyBtn = document.getElementById('copyBtn');
  var regenBtn = document.getElementById('regenBtn');
  var keyHint = document.getElementById('keyHint');

  if (!keyValue || !copyBtn || !regenBtn) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fullKey = 'arnie_demo_9f2c7ab13de6440091c23f9a';
  var copyResetTimer = null;
  var confirming = false;
  var confirmResetTimer = null;

  function mask(key) {
    var last4 = key.slice(-4);
    return '•'.repeat(Math.max(key.length - 4, 8)) + last4;
  }

  keyValue.textContent = mask(fullKey);

  copyBtn.addEventListener('click', function () {
    var iconCopy = copyBtn.querySelector('.icon-copy');
    var iconCheck = copyBtn.querySelector('.icon-check');

    function showCopied() {
      copyBtn.classList.add('is-copied');
      if (iconCopy) iconCopy.hidden = true;
      if (iconCheck) iconCheck.hidden = false;
      copyBtn.setAttribute('aria-label', 'Copied');

      clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(function () {
        copyBtn.classList.remove('is-copied');
        if (iconCopy) iconCopy.hidden = false;
        if (iconCheck) iconCheck.hidden = true;
        copyBtn.setAttribute('aria-label', 'Copy API key');
      }, 1600);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullKey).then(showCopied, showCopied);
    } else {
      showCopied();
    }
  });

  function resetConfirm() {
    confirming = false;
    regenBtn.classList.remove('is-confirming');
    regenBtn.textContent = 'Regenerate';
  }

  regenBtn.addEventListener('click', function () {
    if (!confirming) {
      confirming = true;
      regenBtn.classList.add('is-confirming');
      regenBtn.textContent = 'Confirm?';
      clearTimeout(confirmResetTimer);
      confirmResetTimer = setTimeout(resetConfirm, 3000);
      return;
    }

    clearTimeout(confirmResetTimer);
    resetConfirm();

    var chars = 'abcdef0123456789';
    var next = 'arnie_demo_';
    for (var i = 0; i < 20; i++) {
      next += chars[Math.floor(Math.random() * chars.length)];
    }
    fullKey = next;
    keyValue.textContent = mask(fullKey);

    if (keyHint) keyHint.textContent = 'Regenerated just now · previous key revoked';

    if (keyRow && !reduceMotion) {
      keyRow.classList.remove('is-refreshed');
      void keyRow.offsetWidth;
      keyRow.classList.add('is-refreshed');
    }
  });
})();
