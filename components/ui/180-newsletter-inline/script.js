(function () {
  var form = document.getElementById('newsletterForm');
  var input = document.getElementById('newsletterEmail');
  var errorEl = document.getElementById('newsletterError');
  var submitBtn = form ? form.querySelector('.newsletter__submit') : null;
  var submitLabel = form ? form.querySelector('.newsletter__submit-label') : null;
  var spinner = form ? form.querySelector('.newsletter__spinner') : null;
  var successEl = document.getElementById('newsletterSuccess');
  var confirmedEmail = document.getElementById('confirmedEmail');

  if (!form) return;

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(message) {
    errorEl.textContent = message;
    input.classList.toggle('is-invalid', Boolean(message));
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  input.addEventListener('input', function () {
    if (errorEl.textContent) setError('');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var value = input.value.trim();

    if (!value) {
      setError('Enter an email address to subscribe.');
      input.focus();
      return;
    }

    if (!EMAIL_PATTERN.test(value)) {
      setError('That email address doesn’t look right.');
      input.focus();
      return;
    }

    setError('');
    submitBtn.disabled = true;
    submitLabel.textContent = 'Subscribing';
    spinner.hidden = false;

    // Simulate a network request; swap for a real API call as needed.
    setTimeout(function () {
      confirmedEmail.textContent = value;
      form.hidden = true;
      successEl.hidden = false;
      successEl.setAttribute('tabindex', '-1');
      successEl.focus();
    }, 900);
  });
})();
