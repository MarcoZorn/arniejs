(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var data = [
    { label: 'Mon', full: 'Monday', count: 1240 },
    { label: 'Tue', full: 'Tuesday', count: 1860 },
    { label: 'Wed', full: 'Wednesday', count: 1510 },
    { label: 'Thu', full: 'Thursday', count: 2320 },
    { label: 'Fri', full: 'Friday', count: 2040 },
    { label: 'Sat', full: 'Saturday', count: 760 },
    { label: 'Sun', full: 'Sunday', count: 980 }
  ];

  var barsWrap = document.getElementById('apichart-bars');
  var axisWrap = document.getElementById('apichart-axis');
  var tooltip = document.getElementById('apichart-tooltip');
  var plot = document.getElementById('apichart-plot');
  if (!barsWrap || !tooltip) return;

  var max = Math.max.apply(null, data.map(function (d) { return d.count; }));

  var activeBar = null;

  data.forEach(function (d, i) {
    var col = document.createElement('div');
    col.className = 'apichart-bar-col';

    var bar = document.createElement('button');
    bar.type = 'button';
    bar.className = 'apichart-bar';
    bar.setAttribute('aria-label', d.full + ': ' + d.count.toLocaleString('en-US') + ' calls');
    var heightPct = Math.max(4, Math.round(d.count / max * 100));
    bar.style.height = heightPct + '%';
    bar.dataset.index = String(i);

    col.appendChild(bar);
    barsWrap.appendChild(col);

    var axisLabel = document.createElement('div');
    axisLabel.className = 'apichart-axis-label';
    axisLabel.textContent = d.label;
    axisWrap.appendChild(axisLabel);

    function showTooltip() {
      if (activeBar) activeBar.classList.remove('is-active');
      activeBar = bar;
      bar.classList.add('is-active');

      tooltip.innerHTML = d.full + '<span class="apichart-tooltip-sub">' +
        d.count.toLocaleString('en-US') + ' calls</span>';

      var plotRect = plot.getBoundingClientRect();
      var barRect = bar.getBoundingClientRect();
      var left = (barRect.left - plotRect.left) + barRect.width / 2;
      tooltip.style.left = left + 'px';
      tooltip.classList.add('is-visible');
    }

    function hideTooltip() {
      bar.classList.remove('is-active');
      tooltip.classList.remove('is-visible');
      if (activeBar === bar) activeBar = null;
    }

    bar.addEventListener('mouseenter', showTooltip);
    bar.addEventListener('mouseleave', hideTooltip);
    bar.addEventListener('focus', showTooltip);
    bar.addEventListener('blur', hideTooltip);

    // Tap/click toggles the tooltip for touch devices.
    bar.addEventListener('click', function (e) {
      e.preventDefault();
      if (bar.classList.contains('is-active') && tooltip.classList.contains('is-visible')) {
        hideTooltip();
      } else {
        showTooltip();
      }
    });
  });

  // Dismiss tooltip when tapping elsewhere.
  document.addEventListener('click', function (e) {
    if (!plot.contains(e.target)) {
      tooltip.classList.remove('is-visible');
      if (activeBar) {
        activeBar.classList.remove('is-active');
        activeBar = null;
      }
    }
  });

  if (!reduceMotion) {
    var bars = barsWrap.querySelectorAll('.apichart-bar');
    bars.forEach(function (bar, i) {
      var target = bar.style.height;
      bar.style.height = '0%';
      window.setTimeout(function () {
        bar.style.transition = 'height 0.5s ease';
        bar.style.height = target;
      }, 40 * i);
    });
  }
})();
