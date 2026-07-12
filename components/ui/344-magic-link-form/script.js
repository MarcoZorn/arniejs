(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var form = document.getElementById('mlForm');
  if (!form) return;

  var emailInput = document.getElementById('mlEmail');
  var emailError = document.getElementById('mlEmailError');
  var emailField = emailInput.closest('.ml-field');

  var submitBtn = document.getElementById('mlSubmit');
  var submitLabel = document.getElementById('mlSubmitLabel');
  var spinner = document.getElementById('mlSpinner');

  var requestPanel = document.getElementById('mlRequestPanel');
  var sentPanel = document.getElementById('mlSentPanel');
  var sentEmailEl = document.getElementById('mlSentEmail');

  var resendBtn = document.getElementById('mlResendBtn');
  var resendLabel = document.getElementById('mlResendLabel');
  var resendSpinner = document.getElementById('mlResendSpinner');
  var resendNote = document.getElementById('mlResendNote');

  var backBtn = document.getElementById('mlBackBtn');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var currentEmail = '';

  function validateEmail(showError) {
    var value = emailInput.value.trim();
    if (!value) {
      if (showError) {
        emailError.textContent = 'Email is required.';
        emailField.classList.add('is-invalid');
      }
      return false;
    }
    if (!EMAIL_RE.test(value)) {
      if (showError) {
        emailError.textContent = 'Enter a valid email address.';
        emailField.classList.add('is-invalid');
      }
      return false;
    }
    emailError.textContent = '';
    emailField.classList.remove('is-invalid');
    return true;
  }

  emailInput.addEventListener('blur', function () { validateEmail(true); });
  emailInput.addEventListener('input', function () {
    if (emailField.classList.contains('is-invalid')) validateEmail(true);
  });

  function sendLink(delayMs, done) {
    var t0 = Date.now();
    window.setTimeout(function () {
      done();
    }, delayMs);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateEmail(true)) return;

    currentEmail = emailInput.value.trim();
    submitBtn.disabled = true;
    spinner.hidden = false;
    submitLabel.textContent = 'Sending…';

    var delay = reduceMotion ? 250 : 1300;

    sendLink(delay, function () {
      sentEmailEl.textContent = currentEmail;
      requestPanel.hidden = true;
      sentPanel.hidden = false;
      spinner.hidden = true;
      submitLabel.textContent = 'Send me a link';
      submitBtn.disabled = false;
    });
  });

  resendBtn.addEventListener('click', function () {
    resendBtn.disabled = true;
    resendSpinner.hidden = false;
    resendLabel.textContent = 'Resending…';
    resendNote.textContent = '';

    var delay = reduceMotion ? 200 : 1100;

    window.setTimeout(function () {
      resendSpinner.hidden = true;
      resendLabel.textContent = 'Resend link';
      resendBtn.disabled = false;
      resendNote.textContent = 'Sent again to ' + currentEmail + '.';
    }, delay);
  });

  backBtn.addEventListener('click', function () {
    sentPanel.hidden = true;
    requestPanel.hidden = false;
    emailInput.value = '';
    emailError.textContent = '';
    emailField.classList.remove('is-invalid');
    resendNote.textContent = '';
    emailInput.focus();
  });
})();
