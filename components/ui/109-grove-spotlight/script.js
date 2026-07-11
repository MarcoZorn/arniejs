(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var overlay = document.getElementById('spotlightOverlay');
  var hole = document.getElementById('spotlightHole');
  var tooltip = document.getElementById('spotlightTooltip');
  var textEl = document.getElementById('spotlightText');
  var nextBtn = document.getElementById('spotlightNext');
  var skipBtn = document.getElementById('spotlightSkip');
  var startBtn = document.getElementById('startTour');

  var steps = [
    { target: document.getElementById('target1'), text: 'Start here: create a new planting bed for the season.' },
    { target: document.getElementById('target2'), text: 'Next, schedule watering and harvest dates.' },
    { target: document.getElementById('target3'), text: 'Finally, adjust your grove settings anytime here.' }
  ];

  var stepIndex = 0;
  var PADDING = 10;

  function clearSpotlighted() {
    steps.forEach(function (s) { s.target.classList.remove('spotlighted'); });
  }

  function showStep(i) {
    clearSpotlighted();
    var step = steps[i];
    var rect = step.target.getBoundingClientRect();
    step.target.classList.add('spotlighted');

    hole.style.top = (rect.top - PADDING) + 'px';
    hole.style.left = (rect.left - PADDING) + 'px';
    hole.style.width = (rect.width + PADDING * 2) + 'px';
    hole.style.height = (rect.height + PADDING * 2) + 'px';

    textEl.textContent = step.text;
    nextBtn.textContent = (i === steps.length - 1) ? 'Finish' : 'Next';

    var vw = window.innerWidth;
    var tooltipTop = rect.bottom + PADDING + 16;
    var tooltipLeft = Math.min(Math.max(rect.left, 12), vw - 300);

    requestAnimationFrame(function () {
      var tRect = tooltip.getBoundingClientRect();
      if (tooltipTop + tRect.height > window.innerHeight - 12) {
        tooltipTop = rect.top - tRect.height - PADDING - 16;
      }
      tooltip.style.top = tooltipTop + 'px';
      tooltip.style.left = tooltipLeft + 'px';
    });
  }

  function start() {
    stepIndex = 0;
    overlay.classList.add('visible');
    showStep(stepIndex);
    document.addEventListener('keydown', onKeydown);
  }

  function end() {
    overlay.classList.remove('visible');
    clearSpotlighted();
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') end();
  }

  startBtn.addEventListener('click', start);
  skipBtn.addEventListener('click', end);

  nextBtn.addEventListener('click', function () {
    stepIndex++;
    if (stepIndex >= steps.length) {
      end();
    } else {
      showStep(stepIndex);
    }
  });

  window.addEventListener('resize', function () {
    if (overlay.classList.contains('visible')) showStep(stepIndex);
  });

  if (reduceMotion) {
    hole.style.transition = 'none';
    tooltip.style.transition = 'none';
  }
})();
