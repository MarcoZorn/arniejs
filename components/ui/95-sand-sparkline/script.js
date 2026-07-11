(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 240;
  var H = 64;
  var PAD_Y = 8;

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-spark]'));

  cards.forEach(function (card, cardIndex) {
    var values = (card.getAttribute('data-values') || '')
      .split(',')
      .map(function (v) { return parseFloat(v); })
      .filter(function (v) { return !isNaN(v); });

    if (!values.length) return;

    var trend = card.getAttribute('data-trend') || 'flat';
    card.setAttribute('data-trend-state', trend);

    var svg = card.querySelector('[data-role="svg"]');
    var tooltip = card.querySelector('[data-role="tooltip"]');
    var svgNS = 'http://www.w3.org/2000/svg';

    var min = Math.min.apply(Math, values);
    var max = Math.max.apply(Math, values);
    var range = max - min || 1;

    var points = values.map(function (v, i) {
      var x = (i / (values.length - 1)) * W;
      var y = H - PAD_Y - ((v - min) / range) * (H - PAD_Y * 2);
      return { x: x, y: y, v: v };
    });

    var linePath = points
      .map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ',' + p.y.toFixed(2); })
      .join(' ');

    var fillPath = linePath + ' L' + W + ',' + H + ' L0,' + H + ' Z';

    var gradId = 'sparkGrad-' + cardIndex + '-' + Math.random().toString(36).slice(2, 8);

    var defs = document.createElementNS(svgNS, 'defs');
    var gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', gradId);
    gradient.setAttribute('x1', '0');
    gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '0');
    gradient.setAttribute('y2', '1');

    var stopColor = trend === 'down' ? '#a03820' : trend === 'flat' ? '#9b6b3a' : '#d4a85a';

    var stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', stopColor);
    stop1.setAttribute('stop-opacity', '0.38');

    var stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', stopColor);
    stop2.setAttribute('stop-opacity', '0');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    var fill = document.createElementNS(svgNS, 'path');
    fill.setAttribute('class', 'spark-fill');
    fill.setAttribute('d', fillPath);
    fill.setAttribute('fill', 'url(#' + gradId + ')');
    svg.appendChild(fill);

    var line = document.createElementNS(svgNS, 'path');
    line.setAttribute('class', 'spark-line');
    line.setAttribute('d', linePath);
    svg.appendChild(line);

    var guideLine = document.createElementNS(svgNS, 'line');
    guideLine.setAttribute('class', 'spark-guide');
    guideLine.setAttribute('y1', PAD_Y);
    guideLine.setAttribute('y2', H);
    svg.appendChild(guideLine);

    var dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('class', 'spark-dot');
    dot.setAttribute('r', '4');
    svg.appendChild(dot);

    var hit = document.createElementNS(svgNS, 'rect');
    hit.setAttribute('class', 'spark-hit');
    hit.setAttribute('x', '0');
    hit.setAttribute('y', '0');
    hit.setAttribute('width', W);
    hit.setAttribute('height', H);
    svg.appendChild(hit);

    // draw-in animation
    if (!prefersReducedMotion) {
      var length = line.getTotalLength();
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
      fill.style.opacity = '0';
      fill.style.transition = 'opacity 0.6s ease 0.5s';
      line.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          line.style.strokeDashoffset = '0';
          fill.style.opacity = '0.9';
        });
      });
    }

    function showAt(clientX) {
      var rect = svg.getBoundingClientRect();
      var relX = ((clientX - rect.left) / rect.width) * W;
      var closest = points[0];
      var closestDist = Infinity;
      points.forEach(function (p) {
        var d = Math.abs(p.x - relX);
        if (d < closestDist) {
          closestDist = d;
          closest = p;
        }
      });

      dot.setAttribute('cx', closest.x);
      dot.setAttribute('cy', closest.y);
      guideLine.setAttribute('x1', closest.x);
      guideLine.setAttribute('x2', closest.x);

      card.classList.add('is-active');

      var pct = (closest.x / W) * rect.width;
      tooltip.style.left = pct + 'px';
      tooltip.textContent = formatValue(closest.v);
    }

    function hide() {
      card.classList.remove('is-active');
    }

    function formatValue(v) {
      if (Math.abs(v) >= 1000) {
        return (v / 1000).toFixed(1) + 'k';
      }
      return (Math.round(v * 10) / 10).toString();
    }

    hit.addEventListener('pointermove', function (e) {
      showAt(e.clientX);
    });
    hit.addEventListener('pointerenter', function (e) {
      showAt(e.clientX);
    });
    hit.addEventListener('pointerleave', hide);
    hit.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches[0]) showAt(e.touches[0].clientX);
    }, { passive: true });
    hit.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches[0]) showAt(e.touches[0].clientX);
    }, { passive: true });
    hit.addEventListener('touchend', hide);
  });
})();
