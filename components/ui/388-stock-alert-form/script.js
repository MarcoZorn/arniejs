(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.alert-wrap');
  if (!wrap) return;

  var body = wrap.querySelector('[data-alert-body]');
  var form = wrap.querySelector('[data-alert-form]');
  var errorEl = wrap.querySelector('[data-alert-error]');
  if (!form || !body || !errorEl) return;

  var input = form.querySelector('.alert-input');

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(message) {
    errorEl.textContent = message;
    if (input) input.classList.add('is-invalid');
    if (message && !reduceMotion) {
      form.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(6px)' },
          { transform: 'translateX(0)' }
        ],
        { duration: 220, easing: 'ease-out' }
      );
    }
  }

  function clearError() {
    errorEl.textContent = '';
    if (input) input.classList.remove('is-invalid');
  }

  function renderConfirmation(email) {
    var confirm = document.createElement('div');
    confirm.className = 'alert-confirm';
    confirm.setAttribute('role', 'status');

    var icon = document.createElement('span');
    icon.className = 'alert-confirm-icon';
    icon.setAttribute('aria-hidden', 'true');

    var text = document.createElement('p');
    text.className = 'alert-confirm-text';
    text.innerHTML = 'We’ll email you at <strong></strong> when this is back.';
    text.querySelector('strong').textContent = email;

    confirm.appendChild(icon);
    confirm.appendChild(text);

    body.innerHTML = '';
    body.appendChild(confirm);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = (input && input.value ? input.value : '').trim();

    if (!value) {
      showError('Enter your email address to get notified.');
      return;
    }
    if (!emailPattern.test(value)) {
      showError('That doesn’t look like a valid email address.');
      return;
    }

    clearError();
    renderConfirmation(value);
  });

  if (input) {
    input.addEventListener('input', function () {
      if (errorEl.textContent) clearError();
    });
  }
})();
