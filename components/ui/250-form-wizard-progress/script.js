(function () {
  var card = document.querySelector('.wizard-card');
  if (!card) return;

  var steps = Array.prototype.slice.call(card.querySelectorAll('.wizard-step'));
  var panels = Array.prototype.slice.call(card.querySelectorAll('.wizard-panel'));
  var backBtn = card.querySelector('[data-wizard-back]');
  var nextBtn = card.querySelector('[data-wizard-next]');
  var submitBtn = card.querySelector('[data-wizard-submit]');
  var successEl = card.querySelector('.wizard-success');
  var form = card.querySelector('.wizard-form');

  var total = panels.length;
  var current = 1;

  function panelFor(n) {
    return panels.filter(function (p) { return Number(p.getAttribute('data-panel')) === n; })[0];
  }

  function requiredInput(panel) {
    return panel.querySelector('[required]');
  }

  function render() {
    steps.forEach(function (step) {
      var n = Number(step.getAttribute('data-step'));
      step.classList.toggle('is-active', n === current);
      step.classList.toggle('is-complete', n < current);
    });

    panels.forEach(function (panel) {
      var n = Number(panel.getAttribute('data-panel'));
      panel.classList.toggle('is-active', n === current);
    });

    backBtn.disabled = current === 1;
    nextBtn.hidden = current === total;
    submitBtn.hidden = current !== total;
  }

  function validateCurrent() {
    var panel = panelFor(current);
    if (!panel) return true;
    var input = requiredInput(panel);
    var errorEl = panel.querySelector('.wizard-error');
    if (!input) return true;

    if (input.value.trim() === '') {
      panel.classList.add('has-error');
      if (errorEl) errorEl.textContent = 'This field is required before moving on.';
      input.focus();
      return false;
    }

    panel.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  backBtn.addEventListener('click', function () {
    if (current === 1) return;
    current -= 1;
    render();
  });

  nextBtn.addEventListener('click', function () {
    if (!validateCurrent()) return;
    if (current < total) {
      current += 1;
      render();
    }
  });

  panels.forEach(function (panel) {
    var input = requiredInput(panel);
    if (!input) return;
    input.addEventListener('input', function () {
      if (input.value.trim() !== '') {
        panel.classList.remove('has-error');
        var errorEl = panel.querySelector('.wizard-error');
        if (errorEl) errorEl.textContent = '';
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateCurrent()) return;
    successEl.textContent = 'Your plot has been registered. Happy growing!';
  });

  render();
})();
