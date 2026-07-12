(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stepsList = document.querySelector('[data-steps]');
  var backBtn = document.querySelector('[data-back]');
  var nextBtn = document.querySelector('[data-next]');
  var panelTitle = document.querySelector('[data-panel-title]');
  var panelBody = document.querySelector('[data-panel-body]');
  var panel = document.querySelector('[data-panel]');
  if (!stepsList || !backBtn || !nextBtn || !panelTitle || !panelBody) return;

  var steps = Array.prototype.slice.call(stepsList.querySelectorAll('[data-step]'));

  var content = [
    {
      title: 'Your cart',
      body: 'Three items ready to go. Double check quantities before moving on to shipping.'
    },
    {
      title: 'Shipping details',
      body: 'Tell us where it should land. Standard, express, and next-day options are all on the table.'
    },
    {
      title: 'Payment',
      body: 'Add a card or choose a saved method. Everything here is encrypted before it leaves your browser.'
    },
    {
      title: 'Confirm your order',
      body: 'Give it one last look — once you confirm, we start pulling your order from the shelves.'
    }
  ];

  var current = 0;

  function render() {
    steps.forEach(function (step, index) {
      var state = 'upcoming';
      if (index < current) state = 'complete';
      if (index === current) state = 'active';
      step.dataset.state = state;

      var btn = step.querySelector('[data-step-btn]');
      if (state === 'active') {
        btn.setAttribute('aria-current', 'step');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    panelTitle.textContent = content[current].title;
    panelBody.textContent = content[current].body;

    backBtn.disabled = current === 0;
    nextBtn.textContent = current === steps.length - 1 ? 'Place order' : 'Next';

    if (!reduceMotion && panel) {
      panel.animate(
        [
          { opacity: 0, transform: 'translateY(4px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 200, easing: 'ease-out' }
      );
    }
  }

  function goTo(index) {
    if (index < 0 || index > steps.length - 1) return;
    current = index;
    render();
  }

  nextBtn.addEventListener('click', function () {
    if (current === steps.length - 1) {
      nextBtn.textContent = 'Order placed';
      nextBtn.disabled = true;
      return;
    }
    goTo(current + 1);
  });

  backBtn.addEventListener('click', function () {
    goTo(current - 1);
  });

  steps.forEach(function (step, index) {
    var btn = step.querySelector('[data-step-btn]');
    btn.addEventListener('click', function () {
      // Only allow jumping to a completed step or the next immediate step.
      if (index <= current + 1) {
        nextBtn.disabled = false;
        goTo(index);
      }
    });
  });

  render();
})();
