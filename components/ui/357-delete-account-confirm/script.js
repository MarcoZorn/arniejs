(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TARGET_EMAIL = 'jordan@example.com';

  var panels = {
    1: document.querySelector('[data-panel="1"]'),
    2: document.querySelector('[data-panel="2"]'),
    3: document.querySelector('[data-panel="3"]')
  };
  var dots = {
    1: document.querySelector('[data-step-dot="1"]'),
    2: document.querySelector('[data-step-dot="2"]'),
    3: document.querySelector('[data-step-dot="3"]')
  };

  function fadeIn(el) {
    if (!el || reduceMotion) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 220, easing: 'ease-out' }
    );
  }

  function goToStep(step) {
    Object.keys(panels).forEach(function (key) {
      var n = Number(key);
      panels[key].hidden = n !== step;
      if (dots[key]) {
        dots[key].classList.toggle('is-active', n === step);
        dots[key].classList.toggle('is-done', n < step);
      }
    });
    fadeIn(panels[step]);
  }

  var cancel1 = document.querySelector('[data-action="cancel-1"]');
  var next1 = document.querySelector('[data-action="next-1"]');
  var back2 = document.querySelector('[data-action="back-2"]');
  var next2 = document.querySelector('[data-action="next-2"]');
  var restart = document.querySelector('[data-action="restart"]');
  var emailInput = document.querySelector('[data-email-input]');
  var matchHint = document.querySelector('[data-match-hint]');
  var emailTarget = document.querySelector('[data-email-target]');

  if (emailTarget) emailTarget.textContent = TARGET_EMAIL;

  if (cancel1) {
    cancel1.addEventListener('click', function () {
      if (matchHint) matchHint.textContent = '';
      if (emailInput) emailInput.value = '';
      goToStep(1);
    });
  }

  if (next1) {
    next1.addEventListener('click', function () {
      goToStep(2);
      if (emailInput) emailInput.focus();
    });
  }

  if (back2) {
    back2.addEventListener('click', function () {
      goToStep(1);
    });
  }

  if (emailInput && next2 && matchHint) {
    emailInput.addEventListener('input', function () {
      var matches = emailInput.value.trim() === TARGET_EMAIL;
      next2.disabled = !matches;
      if (!emailInput.value) {
        matchHint.textContent = '';
      } else if (matches) {
        matchHint.textContent = 'Email matches.';
        matchHint.classList.remove('is-mismatch');
      } else {
        matchHint.textContent = "Doesn't match yet.";
        matchHint.classList.add('is-mismatch');
      }
    });
  }

  if (next2) {
    next2.addEventListener('click', function () {
      if (next2.disabled) return;
      goToStep(3);
    });
  }

  if (restart) {
    restart.addEventListener('click', function () {
      if (emailInput) emailInput.value = '';
      if (matchHint) matchHint.textContent = '';
      if (next2) next2.disabled = true;
      goToStep(1);
    });
  }
})();
