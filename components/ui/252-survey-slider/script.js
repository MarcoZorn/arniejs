(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var panel = document.querySelector('.surv-panel');
  if (!panel) return;

  var range = panel.querySelector('.surv-range');
  var ticks = Array.prototype.slice.call(panel.querySelectorAll('.surv-tick'));
  var emojiEl = panel.querySelector('.surv-emoji');
  var labelEl = panel.querySelector('.surv-label');

  var STEPS = [
    { emoji: '😞', label: 'Very unsatisfied' },
    { emoji: '🙁', label: 'Unsatisfied' },
    { emoji: '😐', label: 'Somewhat unsatisfied' },
    { emoji: '🙂', label: 'Neutral' },
    { emoji: '😊', label: 'Somewhat satisfied' },
    { emoji: '😄', label: 'Satisfied' },
    { emoji: '🤩', label: 'Very satisfied' }
  ];

  function update(index, animate) {
    index = Math.max(0, Math.min(STEPS.length - 1, index));
    range.value = String(index);

    var pct = (index / (STEPS.length - 1)) * 100;
    range.style.setProperty('--surv-fill', pct + '%');

    var step = STEPS[index];
    emojiEl.textContent = step.emoji;
    labelEl.textContent = step.label;
    range.setAttribute('aria-valuetext', step.label);

    ticks.forEach(function (tick, i) {
      tick.classList.toggle('is-active', i === index);
    });

    if (!reduceMotion && animate) {
      emojiEl.animate(
        [
          { transform: 'scale(0.7)' },
          { transform: 'scale(1.15)' },
          { transform: 'scale(1)' }
        ],
        { duration: 220, easing: 'ease-out' }
      );
    }
  }

  range.addEventListener('input', function () {
    update(parseInt(range.value, 10), true);
  });

  ticks.forEach(function (tick) {
    tick.addEventListener('click', function () {
      var idx = parseInt(tick.getAttribute('data-index'), 10);
      update(idx, true);
      range.focus();
    });
  });

  // Initial paint.
  update(parseInt(range.value, 10) || 3, false);
})();
