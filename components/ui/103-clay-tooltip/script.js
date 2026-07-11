(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tooltip = document.getElementById('tooltip');
  var seeds = document.querySelectorAll('.seed');
  var GAP = 12;
  var activeTarget = null;

  function place(target) {
    var text = target.getAttribute('data-tip');
    tooltip.textContent = text;
    tooltip.classList.remove('pos-top', 'pos-bottom', 'pos-left', 'pos-right');

    var rect = target.getBoundingClientRect();
    var tRect = tooltip.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var preferred = 'top';
    if (rect.top - tRect.height - GAP < 8) preferred = 'bottom';

    var top, left, pos;

    if (preferred === 'top') {
      pos = 'top';
      top = rect.top - tRect.height - GAP;
      left = rect.left + rect.width / 2 - tRect.width / 2;
    } else {
      pos = 'bottom';
      top = rect.bottom + GAP;
      left = rect.left + rect.width / 2 - tRect.width / 2;
    }

    if (left < 8) {
      left = 8;
    } else if (left + tRect.width > vw - 8) {
      left = vw - tRect.width - 8;
    }

    if (top < 8) {
      top = rect.bottom + GAP;
      pos = 'bottom';
    } else if (top + tRect.height > vh - 8) {
      top = rect.top - tRect.height - GAP;
      pos = 'top';
    }

    tooltip.classList.add('pos-' + pos);
    tooltip.style.top = Math.round(top) + 'px';
    tooltip.style.left = Math.round(left) + 'px';
  }

  function show(target) {
    activeTarget = target;
    tooltip.textContent = target.getAttribute('data-tip');
    tooltip.style.visibility = 'hidden';
    tooltip.classList.add('visible');
    requestAnimationFrame(function () {
      place(target);
      tooltip.style.visibility = '';
    });
  }

  function hide() {
    activeTarget = null;
    tooltip.classList.remove('visible');
  }

  seeds.forEach(function (seed) {
    seed.addEventListener('mouseenter', function () { show(seed); });
    seed.addEventListener('mouseleave', hide);
    seed.addEventListener('focus', function () { show(seed); });
    seed.addEventListener('blur', hide);
  });

  window.addEventListener('scroll', function () {
    if (activeTarget) place(activeTarget);
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (activeTarget) place(activeTarget);
  });

  if (reduceMotion) {
    tooltip.style.transition = 'none';
  }
})();
