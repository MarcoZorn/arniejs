(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.rpr-wrap');
  if (!wrap) return;

  var fillCircle = wrap.querySelector('.rpr-fill');
  var countEl = wrap.querySelector('[data-count]');
  var labelEl = wrap.querySelector('[data-label]');
  var input = wrap.querySelector('.rpr-input');
  var runBtn = wrap.querySelector('[data-run]');
  var randomBtn = wrap.querySelector('[data-random]');

  var radius = fillCircle.r.baseVal.value;
  var circumference = 2 * Math.PI * radius;
  fillCircle.style.strokeDasharray = circumference;
  fillCircle.style.strokeDashoffset = circumference;

  var labels = [
    { max: 30, text: 'just planted' },
    { max: 60, text: 'sprouting' },
    { max: 90, text: 'germinated' },
    { max: 101, text: 'fully sprouted' }
  ];

  function labelForValue(v) {
    for (var i = 0; i < labels.length; i++) {
      if (v < labels[i].max) return labels[i].text;
    }
    return 'fully sprouted';
  }

  var current = 0;
  var animId = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function render(v) {
    var clamped = Math.max(0, Math.min(100, v));
    var offset = circumference * (1 - clamped / 100);
    fillCircle.style.strokeDashoffset = offset;
    countEl.textContent = Math.round(clamped);
    labelEl.textContent = labelForValue(clamped);
  }

  function animateTo(target) {
    target = Math.max(0, Math.min(100, target));

    if (reduceMotion) {
      current = target;
      render(current);
      return;
    }

    if (animId) cancelAnimationFrame(animId);

    var start = current;
    var delta = target - start;
    var duration = 1100;
    var startTime = null;

    function step(ts) {
      if (startTime === null) startTime = ts;
      var elapsed = ts - startTime;
      var t = Math.min(1, elapsed / duration);
      var eased = easeOutCubic(t);
      render(start + delta * eased);

      if (t < 1) {
        animId = requestAnimationFrame(step);
      } else {
        current = target;
        animId = null;
      }
    }

    animId = requestAnimationFrame(step);
  }

  var initialTarget = Number(input.value) || 0;
  requestAnimationFrame(function () {
    animateTo(initialTarget);
  });

  runBtn.addEventListener('click', function () {
    var target = Number(input.value);
    if (isNaN(target)) target = 0;
    animateTo(target);
  });

  randomBtn.addEventListener('click', function () {
    var value = Math.round(Math.random() * 100);
    input.value = value;
    animateTo(value);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      runBtn.click();
    }
  });
})();
