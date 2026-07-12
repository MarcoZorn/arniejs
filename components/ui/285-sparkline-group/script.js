(function () {
  var list = document.getElementById('spk-list');
  if (!list) return;

  var SVG_NS = 'http://www.w3.org/2000/svg';

  var metrics = [
    {
      label: 'Daily Active Users',
      unit: '',
      color: '#8fa86e',
      series: [4120, 4210, 4180, 4305, 4390, 4420, 4380, 4510, 4600, 4580, 4670, 4750, 4820, 4900]
    },
    {
      label: 'Revenue',
      unit: '$',
      color: '#d4a85a',
      series: [12100, 12450, 12300, 12800, 13100, 12950, 13400, 13650, 13500, 13900, 14200, 14050, 14500, 14800]
    },
    {
      label: 'Signups',
      unit: '',
      color: '#c4622d',
      series: [210, 198, 225, 240, 232, 260, 255, 248, 270, 265, 280, 275, 290, 302]
    },
    {
      label: 'Churn Rate',
      unit: '%',
      color: '#a03820',
      series: [3.2, 3.4, 3.1, 3.6, 3.8, 3.5, 3.9, 4.1, 3.9, 4.3, 4.0, 4.4, 4.2, 4.5]
    },
    {
      label: 'Avg Session Length',
      unit: 'm',
      color: '#5a7a3a',
      series: [6.1, 6.3, 6.0, 6.4, 6.2, 6.6, 6.5, 6.8, 6.7, 6.9, 7.0, 6.8, 7.2, 7.4]
    },
    {
      label: 'Support Tickets',
      unit: '',
      color: '#9b6b3a',
      series: [88, 92, 85, 79, 81, 74, 70, 68, 65, 62, 60, 58, 55, 52]
    },
    {
      label: 'Page Load Time',
      unit: 's',
      color: '#a03820',
      series: [1.8, 1.75, 1.82, 1.7, 1.68, 1.74, 1.6, 1.55, 1.58, 1.5, 1.48, 1.52, 1.45, 1.4]
    },
    {
      label: 'Conversion Rate',
      unit: '%',
      color: '#d4a85a',
      series: [2.1, 2.2, 2.0, 2.3, 2.4, 2.3, 2.5, 2.6, 2.55, 2.7, 2.65, 2.8, 2.75, 2.9]
    },
    {
      label: 'Trial Starts',
      unit: '',
      color: '#8fa86e',
      series: [140, 152, 148, 160, 155, 168, 172, 165, 178, 182, 176, 190, 195, 188]
    },
    {
      label: 'Server Uptime',
      unit: '%',
      color: '#5a7a3a',
      series: [99.92, 99.95, 99.9, 99.97, 99.93, 99.98, 99.96, 99.99, 99.95, 99.98, 99.97, 99.99, 99.98, 99.99]
    }
  ];

  function fmtValue(value, unit) {
    if (unit === '$') return '$' + value.toLocaleString('en-US');
    var rounded = Math.round(value * 100) / 100;
    return rounded.toLocaleString('en-US') + (unit || '');
  }

  function buildSparkline(series, color) {
    var width = 96;
    var height = 32;
    var padding = 3;

    var min = Math.min.apply(null, series);
    var max = Math.max.apply(null, series);
    var range = max - min || 1;

    var points = series.map(function (value, i) {
      var x = padding + (i / (series.length - 1)) * (width - padding * 2);
      var y = height - padding - ((value - min) / range) * (height - padding * 2);
      return x.toFixed(2) + ',' + y.toFixed(2);
    });

    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'spk-sparkline');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    var polyline = document.createElementNS(SVG_NS, 'polyline');
    polyline.setAttribute('points', points.join(' '));
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', color);
    polyline.setAttribute('stroke-width', '2');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(polyline);

    // Highlight the final point.
    var lastPoint = points[points.length - 1].split(',');
    var dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', lastPoint[0]);
    dot.setAttribute('cy', lastPoint[1]);
    dot.setAttribute('r', '2.2');
    dot.setAttribute('fill', color);
    svg.appendChild(dot);

    return svg;
  }

  metrics.forEach(function (metric) {
    var first = metric.series[0];
    var last = metric.series[metric.series.length - 1];
    var pctChange = first !== 0 ? ((last - first) / Math.abs(first)) * 100 : 0;
    var dir = pctChange > 0.05 ? 'up' : pctChange < -0.05 ? 'down' : 'flat';
    var arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '–';

    var row = document.createElement('div');
    row.className = 'spk-row';

    var labelGroup = document.createElement('div');
    labelGroup.className = 'spk-label-group';
    var labelEl = document.createElement('span');
    labelEl.className = 'spk-label';
    labelEl.textContent = metric.label;
    var periodEl = document.createElement('span');
    periodEl.className = 'spk-period';
    periodEl.textContent = 'Last 14 days';
    labelGroup.appendChild(labelEl);
    labelGroup.appendChild(periodEl);

    var sparkline = buildSparkline(metric.series, metric.color);

    var valueEl = document.createElement('div');
    valueEl.className = 'spk-value';
    valueEl.textContent = fmtValue(last, metric.unit);

    var trendEl = document.createElement('div');
    trendEl.className = 'spk-trend';
    trendEl.setAttribute('data-dir', dir);
    var arrowSpan = document.createElement('span');
    arrowSpan.className = 'spk-trend-arrow';
    arrowSpan.textContent = arrow;
    var pctSpan = document.createElement('span');
    pctSpan.textContent = Math.abs(pctChange).toFixed(1) + '%';
    trendEl.appendChild(arrowSpan);
    trendEl.appendChild(pctSpan);
    trendEl.setAttribute('aria-label', metric.label + ' ' + (dir === 'up' ? 'up' : dir === 'down' ? 'down' : 'flat') + ' ' + Math.abs(pctChange).toFixed(1) + ' percent over the period');

    row.appendChild(labelGroup);
    row.appendChild(sparkline);
    row.appendChild(valueEl);
    row.appendChild(trendEl);

    list.appendChild(row);
  });
})();
