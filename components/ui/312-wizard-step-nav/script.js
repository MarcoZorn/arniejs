(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stepsList = document.getElementById('wizSteps');
  var backBtn = document.getElementById('wizBack');
  var nextBtn = document.getElementById('wizNext');
  if (!stepsList || !backBtn || !nextBtn) return;

  var steps = Array.prototype.slice.call(stepsList.querySelectorAll('.wiz-step'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.wiz-panel'));
  var totalSteps = steps.length;
  var currentStep = 1;
  var furthestReached = 1;

  function panelFor(step) {
    return document.getElementById('wizPanel-' + step);
  }

  function goTo(step) {
    if (step < 1 || step > totalSteps) return;
    if (step > furthestReached) return;

    currentStep = step;
    if (step > furthestReached) furthestReached = step;

    steps.forEach(function (li) {
      var n = Number(li.getAttribute('data-step'));
      var btn = li.querySelector('.wiz-step-btn');
      var isActive = n === currentStep;
      var isComplete = n < furthestReached || (n < currentStep);
      // A step counts complete once we've moved past it at least once.
      var reached = n <= furthestReached;

      li.classList.toggle('is-active', isActive);
      li.classList.toggle('is-complete', n < currentStep && reached);

      if (isActive) {
        btn.setAttribute('aria-current', 'step');
      } else {
        btn.removeAttribute('aria-current');
      }

      // Clickable if it has already been reached (including current).
      if (reached) {
        btn.removeAttribute('disabled');
      } else {
        btn.setAttribute('disabled', '');
      }
    });

    panels.forEach(function (panel) {
      var n = Number(panel.getAttribute('data-panel'));
      panel.hidden = n !== currentStep;
    });

    backBtn.disabled = currentStep === 1;
    nextBtn.textContent = currentStep === totalSteps ? 'Finish' : 'Next step';
  }

  stepsList.addEventListener('click', function (e) {
    var btn = e.target.closest('.wiz-step-btn');
    if (!btn || btn.disabled) return;
    var target = Number(btn.getAttribute('data-target'));
    goTo(target);
  });

  backBtn.addEventListener('click', function () {
    goTo(currentStep - 1);
  });

  nextBtn.addEventListener('click', function () {
    if (currentStep === totalSteps) return;
    goTo(currentStep + 1);
  });

  goTo(1);
})();
