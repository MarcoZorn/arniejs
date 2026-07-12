(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var form = document.getElementById('fpForm');
  if (!form) return;

  var emailInput = document.getElementById('fpEmail');
  var emailError = document.getElementById('fpEmailError');
  var emailField = emailInput.closest('.fp-field');

  var submitBtn = document.getElementById('fpSubmit');
  var submitLabel = document.getElementById('fpSubmitLabel');

  var requestPanel = document.getElementById('fpRequestPanel');
  var confirmPanel = document.getElementById('fpConfirmPanel');
  var sentEmailEl = document.getElementById('fpSentEmail');
  var backBtn = document.getElementById('fpBackBtn');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateEmail(true)) return;

    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending link…';

    var delay = reduceMotion ? 150 : 800;

    window.setTimeout(function () {
      sentEmailEl.textContent = emailInput.value.trim();
      requestPanel.hidden = true;
      confirmPanel.hidden = false;

      submitLabel.textContent = 'Send reset link';
      submitBtn.disabled = false;
    }, delay);
  });

  backBtn.addEventListener('click', function () {
    confirmPanel.hidden = true;
    requestPanel.hidden = false;
    emailInput.value = '';
    emailError.textContent = '';
    emailField.classList.remove('is-invalid');
    emailInput.focus();
  });
})();
