(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var form = document.getElementById('loginForm');
  if (!form) return;

  var emailInput = document.getElementById('loginEmail');
  var emailError = document.getElementById('loginEmailError');
  var emailField = emailInput.closest('.login-field');

  var passwordInput = document.getElementById('loginPassword');
  var passwordError = document.getElementById('loginPasswordError');
  var passwordField = passwordInput.closest('.login-field');

  var toggleEye = document.getElementById('loginToggleEye');
  var eyeIcon = document.getElementById('loginEyeIcon');

  var rememberCheckbox = document.getElementById('loginRemember');
  var forgotLink = document.getElementById('loginForgotLink');

  var submitBtn = document.getElementById('loginSubmit');
  var submitLabel = document.getElementById('loginSubmitLabel');
  var status = document.getElementById('loginStatus');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var EYE_OPEN = '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle>';
  var EYE_CLOSED = '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.6 19.6 0 0 1 4.22-5.06"></path><path d="M9.9 4.24A10.6 10.6 0 0 1 12 4c7 0 11 7 11 7a19.7 19.7 0 0 1-2.16 3.19"></path><path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"></path><line x1="1" y1="1" x2="23" y2="23"></line>';

  function setError(field, errorEl, message) {
    errorEl.textContent = message || '';
    field.classList.toggle('is-invalid', !!message);
  }

  function validateEmail(showError) {
    var value = emailInput.value.trim();
    if (!value) {
      if (showError) setError(emailField, emailError, 'Email is required.');
      return false;
    }
    if (!EMAIL_RE.test(value)) {
      if (showError) setError(emailField, emailError, 'Enter a valid email address.');
      return false;
    }
    setError(emailField, emailError, '');
    return true;
  }

  function validatePassword(showError) {
    var value = passwordInput.value;
    if (!value) {
      if (showError) setError(passwordField, passwordError, 'Password is required.');
      return false;
    }
    setError(passwordField, passwordError, '');
    return true;
  }

  emailInput.addEventListener('blur', function () { validateEmail(true); });
  emailInput.addEventListener('input', function () {
    if (emailField.classList.contains('is-invalid')) validateEmail(true);
  });

  passwordInput.addEventListener('blur', function () { validatePassword(true); });
  passwordInput.addEventListener('input', function () {
    if (passwordField.classList.contains('is-invalid')) validatePassword(true);
  });

  toggleEye.addEventListener('click', function () {
    var isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleEye.setAttribute('aria-pressed', String(isPassword));
    toggleEye.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    eyeIcon.innerHTML = isPassword ? EYE_CLOSED : EYE_OPEN;
  });

  forgotLink.addEventListener('click', function (e) {
    e.preventDefault();
    status.textContent = 'A password reset link would be sent here.';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var emailOk = validateEmail(true);
    var passwordOk = validatePassword(true);

    if (!emailOk || !passwordOk) {
      status.textContent = '';
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Signing you in…';
    status.textContent = '';

    var delay = reduceMotion ? 200 : 1100;

    window.setTimeout(function () {
      submitLabel.textContent = 'Signed in';
      var remembered = rememberCheckbox.checked ? ' We’ll keep you signed in on this device.' : '';
      status.textContent = 'Welcome back, ' + emailInput.value.trim() + '.' + remembered;

      window.setTimeout(function () {
        submitLabel.textContent = 'Sign in';
        submitBtn.disabled = false;
      }, 1800);
    }, delay);
  });
})();
