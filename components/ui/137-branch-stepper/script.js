(function () {
  var stepper = document.querySelector('[data-stepper]');
  if (!stepper) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nodeEls = Array.prototype.slice.call(stepper.querySelectorAll('.stepper-node'));
  var dotEls = Array.prototype.slice.call(stepper.querySelectorAll('[data-dot]'));
  var paneEls = Array.prototype.slice.call(stepper.querySelectorAll('[data-pane]'));
  var vineFg = stepper.querySelector('[data-vine-fg]');
  var backBtn = stepper.querySelector('[data-back]');
  var nextBtn = stepper.querySelector('[data-next]');
  var progressText = stepper.querySelector('[data-progress-text]');

  var total = nodeEls.length;
  var current = 0;

  var vineLength = 0;
  if (vineFg && typeof vineFg.getTotalLength === 'function') {
    vineLength = vineFg.getTotalLength();
    vineFg.style.strokeDasharray = vineLength;
    vineFg.style.strokeDashoffset = vineLength;
    if (reduceMotion) {
      vineFg.style.transition = 'none';
    }
  }

  function updateVine() {
    if (!vineFg || !vineLength) return;
    var progress = total > 1 ? current / (total - 1) : 1;
    var offset = vineLength - vineLength * progress;
    vineFg.style.strokeDashoffset = offset;
  }

  function render() {
    nodeEls.forEach(function (node, index) {
      var dot = dotEls[index];
      node.classList.remove('is-active', 'is-completed', 'is-upcoming');

      if (index < current) {
        node.classList.add('is-completed');
      } else if (index === current) {
        node.classList.add('is-active');
      } else {
        node.classList.add('is-upcoming');
      }

      if (dot) {
        if (index === current) {
          dot.setAttribute('aria-current', 'step');
        } else {
          dot.removeAttribute('aria-current');
        }
      }
    });

    paneEls.forEach(function (pane) {
      var isActive = Number(pane.getAttribute('data-pane')) === current;
      pane.classList.toggle('is-active', isActive);
    });

    if (backBtn) backBtn.disabled = current === 0;
    if (nextBtn) {
      nextBtn.disabled = current === total - 1;
      nextBtn.textContent = current === total - 1 ? 'Done' : 'Next';
    }

    if (progressText) {
      progressText.textContent = 'Step ' + (current + 1) + ' of ' + total;
    }

    updateVine();
  }

  function goTo(index) {
    if (index < 0 || index > total - 1 || index === current) {
      if (index >= 0 && index <= total - 1) {
        current = index;
        render();
      }
      return;
    }
    current = index;
    render();
  }

  dotEls.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      goTo(index);
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      goTo(current - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (current < total - 1) {
        goTo(current + 1);
      }
    });
  }

  render();
})();
