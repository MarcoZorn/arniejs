(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stepsList = document.getElementById('steps');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var resetBtn = document.getElementById('resetBtn');
  var statusText = document.getElementById('statusText');
  if (!stepsList) return;

  var steps = Array.prototype.slice.call(stepsList.querySelectorAll('.step'));
  var labels = steps.map(function (s) {
    return s.querySelector('.step-label').textContent;
  });
  var total = steps.length;
  var current = 1;

  function render() {
    steps.forEach(function (step, idx) {
      var num = idx + 1;
      step.classList.remove('is-active', 'is-complete');
      var dot = step.querySelector('.step-dot');
      if (num < current) {
        step.classList.add('is-complete');
        dot.removeAttribute('aria-current');
        dot.textContent = '✓';
      } else if (num === current) {
        step.classList.add('is-active');
        dot.setAttribute('aria-current', 'step');
        dot.textContent = String(num);
      } else {
        dot.removeAttribute('aria-current');
        dot.textContent = String(num);
      }
    });

    prevBtn.disabled = current === 1;
    nextBtn.textContent = current === total ? 'Done' : 'Next';
    nextBtn.disabled = current === total;
    statusText.textContent = 'Step ' + current + ' of ' + total + ' — ' + labels[current - 1];
  }

  function goTo(num) {
    if (num < 1 || num > total) return;
    current = num;
    render();
  }

  steps.forEach(function (step, idx) {
    var dot = step.querySelector('.step-dot');
    dot.addEventListener('click', function () {
      goTo(idx + 1);
    });
  });

  nextBtn.addEventListener('click', function () {
    goTo(current + 1);
  });

  prevBtn.addEventListener('click', function () {
    goTo(current - 1);
  });

  resetBtn.addEventListener('click', function () {
    goTo(1);
  });

  render();
})();
