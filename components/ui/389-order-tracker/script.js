(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.tracker-wrap');
  if (!wrap) return;

  var stages = Array.prototype.slice.call(wrap.querySelectorAll('.tracker-stage'));
  var lineFill = wrap.querySelector('[data-line-fill]');
  var statusEl = wrap.querySelector('[data-status]');
  var advanceBtn = wrap.querySelector('[data-advance]');
  if (!stages.length) return;

  var stageMessages = [
    'Your order has been placed and is being prepared.',
    'Your order has been packed and is ready for pickup.',
    'Your order has shipped and is on its way.',
    'Your order has been delivered. Enjoy!'
  ];

  var current = 0;

  function render() {
    stages.forEach(function (stage, i) {
      stage.setAttribute('data-complete', i < current ? 'true' : 'false');
      stage.setAttribute('data-current', i === current ? 'true' : 'false');
    });

    if (lineFill) {
      var pct = (current / (stages.length - 1)) * 100;
      lineFill.style.width = pct + '%';
    }

    if (statusEl) {
      statusEl.textContent = stageMessages[current] || '';
    }

    if (advanceBtn) {
      var atEnd = current >= stages.length - 1;
      advanceBtn.disabled = atEnd;
      advanceBtn.textContent = atEnd ? 'Delivered' : 'Simulate next update';
    }
  }

  function bump(dot) {
    if (reduceMotion || !dot) return;
    dot.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.18)' },
        { transform: 'scale(1.08)' }
      ],
      { duration: 260, easing: 'ease-out' }
    );
  }

  function goToStage(index) {
    if (index < 0 || index >= stages.length) return;
    // Only allow moving to an already-reached stage or advancing exactly
    // one step forward, so the tracker behaves like a real progression.
    if (index > current + 1) return;
    current = index;
    render();
    bump(stages[current].querySelector('.tracker-dot'));
  }

  if (advanceBtn) {
    advanceBtn.addEventListener('click', function () {
      goToStage(current + 1);
    });
  }

  stages.forEach(function (stage, i) {
    var dot = stage.querySelector('.tracker-dot');
    if (!dot) return;
    dot.addEventListener('click', function () {
      // Clicking allows revisiting a completed stage or the current one.
      if (i <= current) {
        current = i;
        render();
      }
    });
  });

  render();
})();
