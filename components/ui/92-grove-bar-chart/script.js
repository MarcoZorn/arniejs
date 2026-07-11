(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var svgNS = 'http://www.w3.org/2000/svg';

  var data = [
    { plot: 'North Terrace', current: 42, prior: 34 },
    { plot: 'Willow Bend', current: 28, prior: 31 },
    { plot: 'Sunwell Row', current: 51, prior: 40 },
    { plot: 'Ashvale', current: 19, prior: 22 },
    { plot: 'Redwood Hollow', current: 36, prior: 29 },
    { plot: 'Meadowrun', current: 47, prior: 44 }
  ];

  var svg = document.getElementById('chart');
  var tooltip = document.getElementById('tooltip');
  var card = document.querySelector('.chart-card');

  var W = 720;
  var H = 360;
  var margin = { top: 20, right: 20, bottom: 50, left: 46 };
  var plotW = W - margin.left - margin.right;
  var plotH = H - margin.top - margin.bottom;

  var maxVal = Math.max.apply(null, data.map(function (d) { return Math.max(d.current, d.prior); }));
  var niceMax = Math.ceil(maxVal / 10) * 10;
  var ticks = 4;

  function el(tag, attrs) {
    var node = document.createElementNS(svgNS, tag);
    for (var k in attrs) {
      node.setAttribute(k, attrs[k]);
    }
    return node;
  }

  function yFor(value) {
    return margin.top + plotH - (value / niceMax) * plotH;
  }

  function buildAxes() {
    for (var i = 0; i <= ticks; i++) {
      var val = (niceMax / ticks) * i;
      var y = yFor(val);
      svg.appendChild(el('line', {
        class: i === 0 ? 'axis-line' : 'grid-line',
        x1: margin.left,
        x2: W - margin.right,
        y1: y,
        y2: y
      }));
      var label = el('text', {
        class: 'axis-label',
        x: margin.left - 10,
        y: y + 4,
        'text-anchor': 'end'
      });
      label.textContent = val;
      svg.appendChild(label);
    }
  }

  function buildBars() {
    var groupWidth = plotW / data.length;
    var barWidth = Math.min(30, groupWidth * 0.28);
    var barGap = 6;

    data.forEach(function (d, i) {
      var groupX = margin.left + i * groupWidth + groupWidth / 2;
      var xCurrent = groupX - barWidth - barGap / 2;
      var xPrior = groupX + barGap / 2;

      var baseline = yFor(0);

      [
        { x: xCurrent, value: d.current, cls: 'bar-current', label: 'This Season' },
        { x: xPrior, value: d.prior, cls: 'bar-prior', label: 'Last Season' }
      ].forEach(function (bar) {
        var targetY = yFor(bar.value);
        var targetH = baseline - targetY;

        var rect = el('rect', {
          class: 'bar ' + bar.cls,
          x: bar.x,
          width: barWidth,
          y: reduceMotion ? targetY : baseline,
          height: reduceMotion ? targetH : 0,
          rx: 4
        });

        var valueLabel = el('text', {
          class: 'bar-value',
          x: bar.x + barWidth / 2,
          y: targetY - 8
        });
        valueLabel.textContent = bar.value;
        if (reduceMotion) valueLabel.classList.add('visible');

        svg.appendChild(rect);
        svg.appendChild(valueLabel);

        if (!reduceMotion) {
          requestAnimationFrame(function () {
            setTimeout(function () {
              rect.style.transition = 'y 0.7s cubic-bezier(.2,.8,.2,1), height 0.7s cubic-bezier(.2,.8,.2,1), filter 0.2s ease, transform 0.2s ease';
              rect.setAttribute('y', targetY);
              rect.setAttribute('height', targetH);
              setTimeout(function () {
                valueLabel.classList.add('visible');
              }, 550);
            }, i * 90);
          });
        }

        rect.addEventListener('pointerenter', function () { showTooltip(bar, rect); });
        rect.addEventListener('pointermove', function (e) { positionTooltip(rect); });
        rect.addEventListener('pointerleave', hideTooltip);
        rect.addEventListener('focus', function () { showTooltip(bar, rect); });
        rect.addEventListener('blur', hideTooltip);
        rect.setAttribute('tabindex', '0');
        rect.setAttribute('role', 'img');
        rect.setAttribute('aria-label', d.plot + ' ' + bar.label + ': ' + bar.value + ' tonnes');
      });

      var plotLabel = el('text', {
        class: 'plot-label',
        x: groupX,
        y: yFor(0) + 24
      });
      plotLabel.textContent = d.plot;
      svg.appendChild(plotLabel);
    });
  }

  function showTooltip(bar, rect) {
    tooltip.innerHTML = '<span class="tt-label">' + bar.label + '</span>' + bar.value + ' t';
    tooltip.classList.add('visible');
    positionTooltip(rect);
  }

  function positionTooltip(rect) {
    var cardRect = card.getBoundingClientRect();
    var barRect = rect.getBoundingClientRect();
    var left = barRect.left - cardRect.left + barRect.width / 2;
    var top = barRect.top - cardRect.top;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  buildAxes();
  buildBars();
})();
