(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.signup-card');
  var form = document.querySelector('.signup-form');
  var input = document.querySelector('.signup-email') || document.getElementById('signup-email');
  var errorEl = document.getElementById('signup-error');
  var success = document.querySelector('.signup-success');
  var successEmail = document.querySelector('.signup-success-email');
  var resetBtn = document.querySelector('.signup-reset');

  if (!form || !input || !card) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(message) {
    card.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError() {
    card.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function validate() {
    var value = input.value.trim();
    if (!value) {
      showError('Enter your email address to join.');
      return false;
    }
    if (!EMAIL_RE.test(value)) {
      showError('That email address doesn’t look quite right.');
      return false;
    }
    clearError();
    return true;
  }

  input.addEventListener('blur', function () {
    if (input.value.trim() === '') return;
    validate();
  });

  input.addEventListener('input', function () {
    if (card.classList.contains('has-error')) validate();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      if (!reduceMotion) {
        input.animate(
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

    if (successEmail) successEmail.textContent = input.value.trim();
    form.hidden = true;
    success.hidden = false;
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      clearError();
      input.value = '';
      input.focus();
    });
  }
})();
