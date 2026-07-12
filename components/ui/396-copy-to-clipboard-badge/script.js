(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.ccb-copy-btn'));
  var status = document.getElementById('ccb-status');
  var timers = {};

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    textarea.style.left = '-1000px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(textarea);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }, function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function markCopied(btn) {
    var label = btn.querySelector('.ccb-copy-label');
    var originalLabel = label.textContent;
    btn.classList.add('is-copied');
    label.textContent = 'Copied!';
    btn.setAttribute('aria-label', 'Copied to clipboard');

    if (timers[btn.dataset.target]) {
      clearTimeout(timers[btn.dataset.target]);
    }

    var delay = reduceMotion ? 1200 : 2000;
    timers[btn.dataset.target] = setTimeout(function () {
      btn.classList.remove('is-copied');
      label.textContent = originalLabel;
      btn.setAttribute('aria-label', 'Copy snippet');
    }, delay);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.dataset.target;
      var codeEl = document.getElementById(targetId);
      if (!codeEl) return;
      var text = codeEl.textContent;

      copyText(text).then(function (success) {
        if (success) {
          markCopied(btn);
          if (status) status.textContent = 'Copied "' + text + '" to clipboard.';
        } else if (status) {
          status.textContent = 'Copy failed — select the text manually.';
        }
      });
    });
  });
})();
