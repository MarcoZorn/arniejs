(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var form = document.getElementById('signupForm');
  if (!form) return;

  var nameInput = document.getElementById('signupName');
  var nameError = document.getElementById('signupNameError');
  var nameField = nameInput.closest('.signup-field');

  var emailInput = document.getElementById('signupEmail');
  var emailError = document.getElementById('signupEmailError');
  var emailField = emailInput.closest('.signup-field');

  var passwordInput = document.getElementById('signupPassword');
  var passwordError = document.getElementById('signupPasswordError');
  var passwordField = passwordInput.closest('.signup-field');
  var strengthEl = document.getElementById('signupStrength');

  var confirmInput = document.getElementById('signupConfirm');
  var confirmError = document.getElementById('signupConfirmError');
  var confirmField = confirmInput.closest('.signup-field');

  var termsCheckbox = document.getElementById('signupTerms');
  var submitBtn = document.getElementById('signupSubmit');
  var submitLabel = document.getElementById('signupSubmitLabel');
  var status = document.getElementById('signupStatus');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setState(field, errorEl, message) {
    errorEl.textContent = message || '';
    field.classList.toggle('is-invalid', !!message);
    field.classList.toggle('is-valid', !message && field.querySelector('input').value.trim() !== '');
  }

  function validateName(showError) {
    var value = nameInput.value.trim();
    if (!value) {
      if (showError) setState(nameField, nameError, 'Name is required.');
      return false;
    }
    setState(nameField, nameError, '');
    return true;
  }

  function validateEmail(showError) {
    var value = emailInput.value.trim();
    if (!value) {
      if (showError) setState(emailField, emailError, 'Email is required.');
      return false;
    }
    if (!EMAIL_RE.test(value)) {
      if (showError) setState(emailField, emailError, 'Enter a valid email address.');
      return false;
    }
    setState(emailField, emailError, '');
    return true;
  }

  function passwordStrength(value) {
    var score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score++;
    if (value.length >= 12 || /[^A-Za-z0-9]/.test(value)) score++;
    return Math.min(score, 3);
  }

  function validatePassword(showError) {
    var value = passwordInput.value;
    var level = value ? passwordStrength(value) : 0;
    strengthEl.setAttribute('data-level', String(level));

    if (!value) {
      if (showError) setState(passwordField, passwordError, 'Password is required.');
      return false;
    }
    if (value.length < 8) {
      if (showError) setState(passwordField, passwordError, 'Use at least 8 characters.');
      return false;
    }
    setState(passwordField, passwordError, '');
    return true;
  }

  function validateConfirm(showError) {
    var value = confirmInput.value;
    if (!value) {
      if (showError) setState(confirmField, confirmError, 'Please confirm your password.');
      return false;
    }
    if (value !== passwordInput.value) {
      if (showError) setState(confirmField, confirmError, 'Passwords do not match.');
      return false;
    }
    setState(confirmField, confirmError, '');
    return true;
  }

  function refreshSubmitState() {
    var ok = validateName(false) && validateEmail(false) && validatePassword(false) &&
      validateConfirm(false) && termsCheckbox.checked;
    submitBtn.disabled = !ok;
  }

  nameInput.addEventListener('input', function () {
    validateName(nameField.classList.contains('is-invalid'));
    refreshSubmitState();
  });
  nameInput.addEventListener('blur', function () { validateName(true); refreshSubmitState(); });

  emailInput.addEventListener('input', function () {
    validateEmail(emailField.classList.contains('is-invalid'));
    refreshSubmitState();
  });
  emailInput.addEventListener('blur', function () { validateEmail(true); refreshSubmitState(); });

  passwordInput.addEventListener('input', function () {
    validatePassword(passwordField.classList.contains('is-invalid'));
    if (confirmInput.value) validateConfirm(true);
    refreshSubmitState();
  });
  passwordInput.addEventListener('blur', function () { validatePassword(true); refreshSubmitState(); });

  confirmInput.addEventListener('input', function () {
    validateConfirm(true);
    refreshSubmitState();
  });
  confirmInput.addEventListener('blur', function () { validateConfirm(true); refreshSubmitState(); });

  termsCheckbox.addEventListener('change', refreshSubmitState);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = validateName(true) && validateEmail(true) && validatePassword(true) && validateConfirm(true);
    if (!ok || !termsCheckbox.checked) {
      refreshSubmitState();
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Creating account…';
    status.textContent = '';

    var delay = reduceMotion ? 200 : 1000;

    window.setTimeout(function () {
      submitLabel.textContent = 'Account created';
      status.textContent = 'Welcome, ' + nameInput.value.trim().split(' ')[0] + '. Your account is ready.';
    }, delay);
  });
})();
