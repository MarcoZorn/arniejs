(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var W = 240;
  var H = 60;
  var PAD = 6;

  function buildPath(data) {
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var range = max - min || 1;
    var stepX = (W - PAD * 2) / (data.length - 1);
    var points = data.map(function (v, i) {
      var x = PAD + i * stepX;
      var y = PAD + (1 - (v - min) / range) * (H - PAD * 2);
      return { x: x, y: y };
    });
    var linePath = points.map(function (p, i) {
      return (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1);
    }).join(' ');
    var fillPath = linePath + ' L' + points[points.length - 1].x.toFixed(1) + ',' + H +
      ' L' + points[0].x.toFixed(1) + ',' + H + ' Z';
    return { linePath: linePath, fillPath: fillPath, last: points[points.length - 1] };
  }

  function renderSparkline(svgEl, data) {
    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
    var built = buildPath(data);

    var fill = document.createElementNS(SVG_NS, 'path');
    fill.setAttribute('d', built.fillPath);
    fill.setAttribute('class', 'spark-fill');
    svgEl.appendChild(fill);

    var line = document.createElementNS(SVG_NS, 'path');
    line.setAttribute('d', built.linePath);
    line.setAttribute('class', 'spark-line');
    svgEl.appendChild(line);

    var dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', built.last.x.toFixed(1));
    dot.setAttribute('cy', built.last.y.toFixed(1));
    dot.setAttribute('r', 3.2);
    dot.setAttribute('class', 'spark-dot');
    svgEl.appendChild(dot);

    if (!reduceMotion) {
      var len = line.getTotalLength ? line.getTotalLength() : 300;
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset .7s ease';
      requestAnimationFrame(function () {
        line.style.strokeDashoffset = '0';
      });
    }
  }

  function randomSeries(base, points, volatility, trendUp) {
    var arr = [];
    var v = base;
    for (var i = 0; i < points; i++) {
      var drift = trendUp ? (i / points) * volatility * 0.6 : -(i / points) * volatility * 0.6;
      v = v + (Math.random() - 0.5) * volatility + drift;
      arr.push(Math.max(v, base * 0.15));
    }
    return arr;
  }

  var cards = [
    {
      cardEl: document.querySelector('.metric-card[data-trend="up"]:nth-of-type(1)') || document.getElementsByClassName('metric-card')[0],
      sparkId: 'spark1', valueId: 'value1', deltaId: 'delta1', badgeId: 'badge1',
      base: 48000, volatility: 4000,
      format: function (v) { return '$' + Math.round(v).toLocaleString(); }
    },
    {
      cardEl: document.getElementsByClassName('metric-card')[1],
      sparkId: 'spark2', valueId: 'value2', deltaId: 'delta2', badgeId: 'badge2',
      base: 300, volatility: 40,
      format: function (v) { return Math.round(v).toString(); }
    },
    {
      cardEl: document.getElementsByClassName('metric-card')[2],
      sparkId: 'spark3', valueId: 'value3', deltaId: 'delta3', badgeId: 'badge3',
      base: 250, volatility: 25,
      format: function (v) {
        var s = Math.round(v);
        return Math.floor(s / 60) + 'm ' + (s % 60) + 's';
      }
    }
  ];

  function updateArrow(cardEl, isUp) {
    cardEl.setAttribute('data-trend', isUp ? 'up' : 'down');
    var arrow = cardEl.querySelector('.metric-card__arrow path:last-child');
    var svg = cardEl.querySelector('.metric-card__arrow');
    if (svg) {
      svg.innerHTML = isUp
        ? '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>'
        : '<path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/>';
    }
  }

  function refreshCard(cfg) {
    var trendUp = Math.random() > 0.4;
    var data = randomSeries(cfg.base, 14, cfg.volatility, trendUp);
    var svgEl = document.getElementById(cfg.sparkId);
    var valueEl = document.getElementById(cfg.valueId);
    var deltaEl = document.getElementById(cfg.deltaId);
    var pct = ((Math.random() * 12) + 0.5).toFixed(1);
    var sign = trendUp ? '+' : '-';

    renderSparkline(svgEl, data);
    valueEl.textContent = cfg.format(data[data.length - 1]);
    deltaEl.textContent = sign + pct + '%';
    updateArrow(cfg.cardEl, trendUp);

    if (!reduceMotion) {
      cfg.cardEl.classList.remove('is-updating');
      void cfg.cardEl.offsetWidth;
      cfg.cardEl.classList.add('is-updating');
    }
  }

  cards.forEach(function (cfg) {
    var initialTrend = cfg.cardEl.getAttribute('data-trend') === 'up';
    var data = randomSeries(cfg.base, 14, cfg.volatility, initialTrend);
    renderSparkline(document.getElementById(cfg.sparkId), data);
  });

  var refreshBtn = document.getElementById('refreshBtn');
  refreshBtn.addEventListener('click', function () {
    cards.forEach(refreshCard);
  });
})();
