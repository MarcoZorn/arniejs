(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var grid = document.querySelector('[data-grid]');
  if (!grid) return;

  var ICON_UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 15 12 7 20 15"/></svg>';
  var ICON_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 9 12 17 20 9"/></svg>';
  var ICON_FLAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/></svg>';

  // Realistic sample data: a market stall's weekly figures.
  var metrics = [
    {
      name: 'Revenue',
      icon: '$',
      current: 4380,
      previous: 3720,
      format: function (v) { return '$' + v.toLocaleString('en-US'); }
    },
    {
      name: 'Orders',
      icon: '#',
      current: 214,
      previous: 231,
      format: function (v) { return v.toLocaleString('en-US'); }
    },
    {
      name: 'Visitors',
      icon: '~',
      current: 1560,
      previous: 1180,
      format: function (v) { return v.toLocaleString('en-US'); }
    },
    {
      name: 'Avg. order value',
      icon: '=',
      current: 20.47,
      previous: 16.10,
      format: function (v) { return '$' + v.toFixed(2); }
    }
  ];

  function computeDelta(current, previous) {
    if (previous === 0) {
      return current === 0 ? 0 : 100;
    }
    return ((current - previous) / previous) * 100;
  }

  var cards = metrics.map(function (metric) {
    var deltaPercent = computeDelta(metric.current, metric.previous);
    var dir = deltaPercent > 0.05 ? 'up' : deltaPercent < -0.05 ? 'down' : 'flat';
    var icon = dir === 'up' ? ICON_UP : dir === 'down' ? ICON_DOWN : ICON_FLAT;
    var sign = deltaPercent > 0 ? '+' : '';

    var card = document.createElement('div');
    card.className = 'scc-card';
    card.setAttribute('data-dir', dir);

    card.innerHTML =
      '<div class="scc-card-head">' +
        '<span class="scc-icon" aria-hidden="true">' + metric.icon + '</span>' +
        '<span class="scc-metric-name">' + metric.name + '</span>' +
      '</div>' +
      '<div class="scc-current">' + metric.format(metric.current) + '</div>' +
      '<div class="scc-compare">' +
        '<span class="scc-prev">was <b>' + metric.format(metric.previous) + '</b></span>' +
        '<span class="scc-delta" data-dir="' + dir + '">' + icon + '<span>' + sign + deltaPercent.toFixed(1) + '%</span></span>' +
      '</div>' +
      '<div class="scc-bar-track"><div class="scc-bar-fill"></div></div>';

    grid.appendChild(card);

    return {
      fill: card.querySelector('.scc-bar-fill'),
      width: Math.min(100, Math.abs(deltaPercent) * 3.2)
    };
  });

  function runBars() {
    cards.forEach(function (c) {
      c.fill.style.width = c.width + '%';
    });
  }

  if (reduceMotion) {
    runBars();
  } else {
    // Let the browser paint the 0% state first so the width transition animates.
    requestAnimationFrame(function () {
      requestAnimationFrame(runBars);
    });
  }
})();
