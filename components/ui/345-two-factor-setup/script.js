(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var digits = Array.prototype.slice.call(document.querySelectorAll('.tfa-digit'));
  if (!digits.length) return;

  var codeRow = document.getElementById('tfaCodeRow');
  var verifyBtn = document.getElementById('tfaVerifyBtn');
  var feedback = document.getElementById('tfaFeedback');

  var copyBtn = document.getElementById('tfaCopyBtn');
  var copyNote = document.getElementById('tfaCopyNote');
  var keyEl = document.getElementById('tfaKey');

  digits.forEach(function (input, index) {
    input.addEventListener('input', function () {
      input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
      codeRow.classList.remove('is-invalid', 'is-valid');
      feedback.textContent = '';
      feedback.className = 'tfa-feedback';

      if (input.value && index < digits.length - 1) {
        digits[index + 1].focus();
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        digits[index - 1].focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        digits[index - 1].focus();
      }
      if (e.key === 'ArrowRight' && index < digits.length - 1) {
        digits[index + 1].focus();
      }
    });

    input.addEventListener('paste', function (e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
      if (!text) return;
      for (var i = 0; i < digits.length; i++) {
        digits[i].value = text[i] || '';
      }
      var lastFilled = Math.min(text.length, digits.length) - 1;
      if (lastFilled >= 0) digits[lastFilled].focus();
    });
  });

  copyBtn.addEventListener('click', function () {
    var text = keyEl.textContent.replace(/\s+/g, '');
    var done = function () {
      copyNote.textContent = 'Key copied to clipboard.';
      window.setTimeout(function () { copyNote.textContent = ''; }, 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      done();
    }
  });

  verifyBtn.addEventListener('click', function () {
    var code = digits.map(function (d) { return d.value; }).join('');

    if (code.length < 6) {
      codeRow.classList.add('is-invalid');
      codeRow.classList.remove('is-valid');
      feedback.textContent = 'Enter all 6 digits.';
      feedback.className = 'tfa-feedback is-error';
      return;
    }

    // Demo validation rule: a code where every digit repeats is treated as invalid.
    var allSame = code.split('').every(function (d) { return d === code[0]; });

    if (allSame) {
      codeRow.classList.add('is-invalid');
      codeRow.classList.remove('is-valid');
      feedback.textContent = 'That code doesn’t match. Check your authenticator app and try again.';
      feedback.className = 'tfa-feedback is-error';

      if (!reduceMotion) {
        codeRow.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' }
          ],
          { duration: 260, easing: 'ease-out' }
        );
      }
      return;
    }

    codeRow.classList.add('is-valid');
    codeRow.classList.remove('is-invalid');
    feedback.textContent = 'Two-factor authentication is now enabled.';
    feedback.className = 'tfa-feedback is-success';
    digits.forEach(function (d) { d.disabled = true; });
    verifyBtn.disabled = true;
  });
})();
