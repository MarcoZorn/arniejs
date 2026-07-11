(function () {
  var svg = document.querySelector('.line-chart');
  if (!svg) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Realistic weekly rainfall data (mm) across a 12-week greenhouse cycle
  var data = [
    { week: 'Wk 1', value: 12 },
    { week: 'Wk 2', value: 18 },
    { week: 'Wk 3', value: 15 },
    { week: 'Wk 4', value: 24 },
    { week: 'Wk 5', value: 31 },
    { week: 'Wk 6', value: 27 },
    { week: 'Wk 7', value: 34 },
    { week: 'Wk 8', value: 42 },
    { week: 'Wk 9', value: 38 },
    { week: 'Wk 10', value: 46 },
    { week: 'Wk 11', value: 40 },
    { week: 'Wk 12', value: 51 }
  ];

  var viewW = 720;
  var viewH = 340;
  var margin = { top: 20, right: 20, bottom: 36, left: 44 };
  var innerW = viewW - margin.left - margin.right;
  var innerH = viewH - margin.top - margin.bottom;

  var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));
  var niceMax = Math.ceil((maxVal * 1.15) / 10) * 10;
  var minVal = 0;

  var NS = 'http://www.w3.org/2000/svg';

  function xForIndex(i) {
    return margin.left + (innerW * i) / (data.length - 1);
  }
  function yForValue(v) {
    var t = (v - minVal) / (niceMax - minVal);
    return margin.top + innerH * (1 - t);
  }

  var points = data.map(function (d, i) {
    return { x: xForIndex(i), y: yForValue(d.value), week: d.week, value: d.value };
  });

  // --- Gridlines (y) + y axis labels ---
  var gridY = svg.querySelector('[data-role="grid-y"]');
  var labelsY = svg.querySelector('[data-role="labels-y"]');
  var yTickCount = 5;
  for (var t = 0; t <= yTickCount; t++) {
    var val = (niceMax / yTickCount) * t;
    var y = yForValue(val);

    var line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', margin.left);
    line.setAttribute('x2', viewW - margin.right);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    gridY.appendChild(line);

    var text = document.createElementNS(NS, 'text');
    text.setAttribute('x', margin.left - 10);
    text.setAttribute('y', y + 4);
    text.textContent = Math.round(val) + 'mm';
    labelsY.appendChild(text);
  }

  // --- X axis labels (every other week to avoid crowding) ---
  var labelsX = svg.querySelector('[data-role="labels-x"]');
  points.forEach(function (p, i) {
    if (i % 2 !== 0 && i !== points.length - 1) return;
    var text = document.createElementNS(NS, 'text');
    text.setAttribute('x', p.x);
    text.setAttribute('y', viewH - margin.bottom + 20);
    text.textContent = p.week;
    labelsX.appendChild(text);
  });

  // --- Line + area paths ---
  function buildLinePath(pts) {
    return pts.map(function (p, i) {
      return (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    }).join(' ');
  }
  function buildAreaPath(pts) {
    var baseline = margin.top + innerH;
    var d = 'M' + pts[0].x.toFixed(2) + ' ' + baseline;
    pts.forEach(function (p) {
      d += ' L' + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    });
    d += ' L' + pts[pts.length - 1].x.toFixed(2) + ' ' + baseline + ' Z';
    return d;
  }

  var linePath = svg.querySelector('[data-role="line"]');
  var areaPath = svg.querySelector('[data-role="area"]');

  linePath.setAttribute('d', buildLinePath(points));
  areaPath.setAttribute('d', buildAreaPath(points));

  // --- Draw-in animation for the line ---
  var length = linePath.getTotalLength();

  if (reduceMotion) {
    linePath.style.strokeDasharray = 'none';
    linePath.style.strokeDashoffset = '0';
    areaPath.style.opacity = '1';
  } else {
    linePath.style.strokeDasharray = length + ' ' + length;
    linePath.style.strokeDashoffset = length;
    areaPath.style.opacity = '0';
    areaPath.style.transition = 'opacity 0.9s ease 0.5s';

    requestAnimationFrame(function () {
      linePath.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.65, 0, 0.35, 1)';
      linePath.style.strokeDashoffset = '0';
      requestAnimationFrame(function () {
        areaPath.style.opacity = '1';
      });
    });
  }

  // --- Points (hit targets + visible dots), staggered fade-in ---
  var pointsGroup = svg.querySelector('[data-role="points"]');
  var dotEls = [];

  points.forEach(function (p, i) {
    var dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('class', 'point-dot');
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    dot.setAttribute('r', 4);
    if (!reduceMotion) {
      dot.style.opacity = '0';
      dot.style.transition = 'opacity 0.4s ease, r 0.15s ease, stroke 0.15s ease';
    }

    var hit = document.createElementNS(NS, 'circle');
    hit.setAttribute('class', 'point-hit');
    hit.setAttribute('cx', p.x);
    hit.setAttribute('cy', p.y);
    hit.setAttribute('r', 14);
    hit.setAttribute('data-index', i);

    pointsGroup.appendChild(dot);
    pointsGroup.appendChild(hit);
    dotEls.push(dot);

    if (!reduceMotion) {
      setTimeout(function () {
        dot.style.opacity = '1';
      }, 1400 + i * 60);
    }
  });

  // --- Hover interaction ---
  var hoverLine = svg.querySelector('[data-role="hover-line"]');
  var tooltip = document.querySelector('[data-role="tooltip"]');
  var tooltipWeek = document.querySelector('[data-role="tooltip-week"]');
  var tooltipValue = document.querySelector('[data-role="tooltip-value"]');
  var chartBody = document.querySelector('.chart-body');

  function activateIndex(i) {
    dotEls.forEach(function (d, di) {
      d.classList.toggle('is-active', di === i);
      d.setAttribute('r', di === i ? 6 : 4);
    });

    var p = points[i];
    hoverLine.setAttribute('x1', p.x);
    hoverLine.setAttribute('x2', p.x);
    hoverLine.setAttribute('y1', margin.top);
    hoverLine.setAttribute('y2', margin.top + innerH);
    hoverLine.classList.add('is-visible');

    var bbox = svg.getBoundingClientRect();
    var bodyBox = chartBody.getBoundingClientRect();
    var scale = bbox.width / viewW;
    var pxX = p.x * scale + (bbox.left - bodyBox.left);
    var pxY = p.y * scale + (bbox.top - bodyBox.top);

    tooltip.style.left = pxX + 'px';
    tooltip.style.top = pxY + 'px';
    tooltipWeek.textContent = p.week;
    tooltipValue.textContent = p.value + ' mm';
    tooltip.hidden = false;
  }

  function deactivate() {
    dotEls.forEach(function (d) {
      d.classList.remove('is-active');
      d.setAttribute('r', 4);
    });
    hoverLine.classList.remove('is-visible');
    tooltip.hidden = true;
  }

  pointsGroup.querySelectorAll('.point-hit').forEach(function (hit) {
    var idx = parseInt(hit.getAttribute('data-index'), 10);
    hit.addEventListener('pointerenter', function () { activateIndex(idx); });
    hit.addEventListener('pointermove', function () { activateIndex(idx); });
    hit.addEventListener('touchstart', function (e) {
      e.preventDefault();
      activateIndex(idx);
    }, { passive: false });
  });

  svg.addEventListener('pointerleave', deactivate);
  document.addEventListener('touchend', function (e) {
    if (!svg.contains(e.target)) deactivate();
  });
})();
