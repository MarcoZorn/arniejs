(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TOTAL = 5000;
  var slider = document.getElementById('quota-slider');
  var bumpBtn = document.getElementById('quota-bump-btn');
  var usedEl = document.getElementById('quota-used');
  var totalEl = document.getElementById('quota-total');
  var fill = document.getElementById('quota-bar-fill');
  var track = document.getElementById('quota-bar-track');
  var pctEl = document.getElementById('quota-pct');
  var badge = document.getElementById('quota-badge');

  if (!slider || !fill) return;

  totalEl.textContent = TOTAL.toLocaleString('en-US');

  function formatNum(n) {
    return n.toLocaleString('en-US');
  }

  function render(used) {
    used = Math.max(0, Math.min(TOTAL, used));
    var pct = used / TOTAL * 100;

    usedEl.textContent = formatNum(used);
    fill.style.width = pct + '%';
    pctEl.textContent = Math.round(pct) + '% of monthly quota';
    track.setAttribute('aria-valuenow', String(used));

    fill.classList.remove('is-warning', 'is-critical');
    badge.classList.remove('is-warning', 'is-critical');

    if (pct >= 90) {
      fill.classList.add('is-critical');
      badge.classList.add('is-critical');
      badge.textContent = 'Near limit';
    } else if (pct >= 70) {
      fill.classList.add('is-warning');
      badge.classList.add('is-warning');
      badge.textContent = 'Watch usage';
    } else {
      badge.textContent = 'On track';
    }

    slider.value = String(used);
  }

  slider.addEventListener('input', function () {
    render(parseInt(slider.value, 10) || 0);
  });

  bumpBtn.addEventListener('click', function () {
    var current = parseInt(slider.value, 10) || 0;
    render(current + 250);

    if (!reduceMotion) {
      fill.animate(
        [
          { filter: 'brightness(1)' },
          { filter: 'brightness(1.35)' },
          { filter: 'brightness(1)' }
        ],
        { duration: 320, easing: 'ease-out' }
      );
    }
  });

  render(parseInt(slider.value, 10) || 3400);
})();
