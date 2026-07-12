(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.gau-wrap');
  if (!wrap) return;

  var fillPath = wrap.querySelector('.gau-fill');
  var needle = wrap.querySelector('.gau-needle');
  var valueEl = wrap.querySelector('[data-value]');
  var captionEl = wrap.querySelector('[data-caption]');
  var ticksGroup = wrap.querySelector('.gau-ticks');
  var slider = wrap.querySelector('.gau-slider');
  var presets = Array.prototype.slice.call(wrap.querySelectorAll('.gau-preset'));

  var CX = 120, CY = 120, R = 100;
  var length = fillPath.getTotalLength();
  fillPath.style.strokeDasharray = length;
  fillPath.style.strokeDashoffset = length;

  // Build tick marks at 0/25/50/75/100% around the arc.
  [0, 0.25, 0.5, 0.75, 1].forEach(function (frac) {
    var angleDeg = 180 - frac * 180;
    var rad = (angleDeg * Math.PI) / 180;
    var outerR = R + 10;
    var innerR = R - 8;
    var x1 = CX + outerR * Math.cos(rad);
    var y1 = CY - outerR * Math.sin(rad);
    var x2 = CX + innerR * Math.cos(rad);
    var y2 = CY - innerR * Math.sin(rad);
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toFixed(1));
    line.setAttribute('y1', y1.toFixed(1));
    line.setAttribute('x2', x2.toFixed(1));
    line.setAttribute('y2', y2.toFixed(1));
    ticksGroup.appendChild(line);
  });

  function colorForValue(v) {
    if (v < 34) return getCssVar('--gau-low');
    if (v < 67) return getCssVar('--gau-mid');
    return getCssVar('--gau-high');
  }

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function captionForValue(v) {
    if (v < 25) return 'bone dry — water soon';
    if (v < 50) return 'a little thirsty';
    if (v < 75) return 'well balanced';
    return 'soaked — hold off watering';
  }

  var current = 0;
  var animId = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function renderInstant(v) {
    var frac = v / 100;
    fillPath.style.strokeDashoffset = length * (1 - frac);
    fillPath.style.stroke = colorForValue(v);
    needle.style.transform = 'rotate(' + (-90 + frac * 180) + 'deg)';
    valueEl.textContent = Math.round(v);
    captionEl.textContent = captionForValue(v);
  }

  function animateTo(target) {
    target = Math.max(0, Math.min(100, target));

    if (reduceMotion) {
      current = target;
      renderInstant(current);
      return;
    }

    if (animId) cancelAnimationFrame(animId);

    var start = current;
    var delta = target - start;
    var duration = 900;
    var startTime = null;

    function step(ts) {
      if (startTime === null) startTime = ts;
      var elapsed = ts - startTime;
      var t = Math.min(1, elapsed / duration);
      var eased = easeOutCubic(t);
      var value = start + delta * eased;
      renderInstant(value);

      if (t < 1) {
        animId = requestAnimationFrame(step);
      } else {
        current = target;
        animId = null;
      }
    }

    animId = requestAnimationFrame(step);
  }

  // Initial sweep from 0 to the slider's starting value.
  var initialTarget = Number(slider.value);
  requestAnimationFrame(function () {
    animateTo(initialTarget);
  });

  slider.addEventListener('input', function () {
    animateTo(Number(slider.value));
  });

  presets.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var raw = btn.getAttribute('data-preset');
      var value = raw === 'random' ? Math.round(Math.random() * 100) : Number(raw);
      slider.value = value;
      animateTo(value);
    });
  });
})();
