(function () {
  var card = document.querySelector('.cs-card');
  if (!card) return;

  var stepper = card.querySelector('.cs-stepper');
  var steps = Array.prototype.slice.call(stepper.querySelectorAll('.cs-step'));
  var connectors = Array.prototype.slice.call(stepper.querySelectorAll('.cs-connector'));
  var backBtn = card.querySelector('[data-action="back"]');
  var nextBtn = card.querySelector('[data-action="next"]');

  var current = 1;

  function render() {
    steps.forEach(function (step, i) {
      var num = i + 1;
      step.classList.remove('is-active', 'is-complete');
      var node = step.querySelector('.cs-node');
      if (num < current) {
        step.classList.add('is-complete');
        node.removeAttribute('aria-current');
      } else if (num === current) {
        step.classList.add('is-active');
        node.setAttribute('aria-current', 'step');
      } else {
        node.removeAttribute('aria-current');
      }
    });

    connectors.forEach(function (connector, i) {
      connector.classList.toggle('is-filled', i + 1 < current);
    });

    backBtn.disabled = current === 1;
    nextBtn.textContent = current === steps.length ? 'Place order' : 'Continue';
    nextBtn.disabled = current === steps.length && nextBtn.dataset.done === 'true';
  }

  function goTo(step) {
    current = Math.min(steps.length, Math.max(1, step));
    render();
  }

  backBtn.addEventListener('click', function () {
    goTo(current - 1);
  });

  nextBtn.addEventListener('click', function () {
    if (current === steps.length) {
      nextBtn.dataset.done = 'true';
      nextBtn.textContent = 'Order placed ✓';
      render();
      return;
    }
    goTo(current + 1);
  });

  steps.forEach(function (step, i) {
    var node = step.querySelector('.cs-node');
    node.addEventListener('click', function () {
      if (i + 1 <= current) goTo(i + 1);
    });
  });

  render();
})();
