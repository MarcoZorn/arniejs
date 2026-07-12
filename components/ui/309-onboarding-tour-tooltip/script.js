(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tooltip = document.getElementById('tourTooltip');
  var arrow = document.getElementById('tourArrow');
  var stepCount = document.getElementById('tourStepCount');
  var title = document.getElementById('tourTooltipTitle');
  var body = document.getElementById('tourTooltipBody');
  var prevBtn = document.getElementById('tourPrev');
  var nextBtn = document.getElementById('tourNext');
  var skipBtn = document.getElementById('tourSkip');
  var restartBtn = document.getElementById('tourRestart');

  if (!tooltip || !arrow || !stepCount || !title || !body || !prevBtn || !nextBtn || !skipBtn || !restartBtn) return;

  var steps = [
    {
      target: '#tourTargetNav',
      title: 'Find your way around',
      body: 'These are the main sections of your dashboard — beds, irrigation, and harvest all live here.',
      placement: 'right'
    },
    {
      target: '#tourTargetStats',
      title: 'Your plot at a glance',
      body: 'Active beds, soil moisture, and alerts update here as conditions change through the day.',
      placement: 'bottom'
    },
    {
      target: '#tourTargetAdd',
      title: 'Add a new plot',
      body: 'When you are ready to grow, this button starts a new bed in just a couple of steps.',
      placement: 'bottom'
    },
    {
      target: '#tourTargetProfile',
      title: 'That is you',
      body: 'Your profile and account settings are always tucked in here, one click away.',
      placement: 'top'
    }
  ];

  var currentIndex = 0;
  var activeTargetEl = null;

  function clearHighlight() {
    if (activeTargetEl) {
      activeTargetEl.classList.remove('tour-highlight');
      activeTargetEl = null;
    }
  }

  function position(step) {
    var targetEl = document.querySelector(step.target);
    if (!targetEl) return;

    clearHighlight();
    targetEl.classList.add('tour-highlight');
    activeTargetEl = targetEl;

    var rect = targetEl.getBoundingClientRect();
    var tw = tooltip.offsetWidth || 300;
    var th = tooltip.offsetHeight || 150;
    var gap = 16;
    var top, left, arrowSide;

    if (step.placement === 'right') {
      top = rect.top + rect.height / 2 - th / 2;
      left = rect.right + gap;
      arrowSide = 'left';
    } else if (step.placement === 'top') {
      top = rect.top - th - gap;
      left = rect.left + rect.width / 2 - tw / 2;
      arrowSide = 'bottom';
    } else {
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - tw / 2;
      arrowSide = 'top';
    }

    var margin = 12;
    var maxLeft = window.innerWidth - tw - margin;
    var maxTop = window.innerHeight - th - margin;
    left = Math.max(margin, Math.min(left, maxLeft));
    top = Math.max(margin, Math.min(top, maxTop));

    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';

    arrow.style.top = arrow.style.bottom = arrow.style.left = arrow.style.right = 'auto';
    if (arrowSide === 'left') {
      arrow.style.left = '-6px';
      arrow.style.top = '50%';
      arrow.style.marginTop = '-6px';
    } else if (arrowSide === 'top') {
      arrow.style.top = '-6px';
      arrow.style.left = '50%';
      arrow.style.marginLeft = '-6px';
    } else {
      arrow.style.bottom = '-6px';
      arrow.style.left = '50%';
      arrow.style.marginLeft = '-6px';
    }
  }

  function render() {
    var step = steps[currentIndex];
    stepCount.textContent = 'Step ' + (currentIndex + 1) + ' of ' + steps.length;
    title.textContent = step.title;
    body.textContent = step.body;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.textContent = currentIndex === steps.length - 1 ? 'Finish' : 'Next';
    tooltip.hidden = false;
    position(step);
    nextBtn.focus();
  }

  function startTour() {
    currentIndex = 0;
    render();
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeydown);
  }

  function endTour() {
    tooltip.hidden = true;
    clearHighlight();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('keydown', onKeydown);
    restartBtn.focus();
  }

  function onResize() {
    if (!tooltip.hidden) position(steps[currentIndex]);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      endTour();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    }
  }

  function goNext() {
    if (currentIndex === steps.length - 1) {
      endTour();
      return;
    }
    currentIndex += 1;
    render();
  }

  function goPrev() {
    if (currentIndex === 0) return;
    currentIndex -= 1;
    render();
  }

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);
  skipBtn.addEventListener('click', endTour);
  restartBtn.addEventListener('click', startTour);

  startTour();
})();
