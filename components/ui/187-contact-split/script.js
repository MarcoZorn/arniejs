(function () {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = 'Please fill in all fields correctly.';
      status.style.color = 'var(--accent-rust)';
      return;
    }

    var submitBtn = form.querySelector('.contact-form__submit');
    var label = submitBtn.querySelector('.btn-label');
    var originalText = label.textContent;

    label.textContent = 'Sending...';
    submitBtn.disabled = true;

    window.setTimeout(function () {
      label.textContent = originalText;
      submitBtn.disabled = false;
      status.style.color = 'var(--accent-sage)';
      status.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    }, 900);
  });
})();
