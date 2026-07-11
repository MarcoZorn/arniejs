(function () {
  var svg = document.querySelector('.donut-chart');
  if (!svg) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Realistic community garden plot allocation (m^2 out of 240 total)
  var data = [
    { label: 'Vegetables', value: 96, color: 'var(--accent-moss)', hex: '#5a7a3a' },
    { label: 'Herbs', value: 34, color: 'var(--accent-sage)', hex: '#8fa86e' },
    { label: 'Flowers', value: 42, color: 'var(--accent-terra)', hex: '#c4622d' },
    { label: 'Compost', value: 22, color: 'var(--accent-rust)', hex: '#a03820' },
    { label: 'Pathways', value: 28, color: 'var(--accent-sand)', hex: '#d4a85a' },
    { label: 'Tool shed', value: 18, color: 'var(--accent-clay)', hex: '#9b6b3a' }
  ];

  var total = data.reduce(function (sum, d) { return sum + d.value; }, 0);

  var cx = 120, cy = 120, r = 84;
  var circumference = 2 * Math.PI * r;
  var NS = 'http://www.w3.org/2000/svg';

  var segmentsGroup = svg.querySelector('[data-role="segments"]');
  var legendList = document.querySelector('[data-role="legend"]');
  var centerValue = document.querySelector('[data-role="center-value"]');
  var centerLabel = document.querySelector('[data-role="center-label"]');
  var tooltip = document.querySelector('[data-role="tooltip"]');
  var card = document.querySelector('.donut-card');

  var cumulative = 0;
  var segEls = [];
  var legendEls = [];

  data.forEach(function (d, i) {
    var pct = d.value / total;
    var segLength = pct * circumference;
    var offset = cumulative * circumference;
    cumulative += pct;

    var circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('class', 'segment');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('stroke', d.hex);
    circle.setAttribute('data-index', i);
    // start at 12 o'clock, drawn clockwise
    circle.style.transform = 'rotate(-90deg)';
    circle.style.transformOrigin = cx + 'px ' + cy + 'px';

    var gapPx = 2.5; // small visual separation between segments
    var visibleLength = Math.max(segLength - gapPx, 0);

    if (reduceMotion) {
      circle.setAttribute('stroke-dasharray', visibleLength + ' ' + (circumference - visibleLength));
      circle.setAttribute('stroke-dashoffset', -offset);
    } else {
      circle.setAttribute('stroke-dasharray', '0 ' + circumference);
      circle.setAttribute('stroke-dashoffset', -offset);
      circle.style.transition = 'stroke-dasharray 1s cubic-bezier(0.65,0,0.35,1)';
      circle.style.transitionDelay = (i * 0.09) + 's';
    }

    segmentsGroup.appendChild(circle);
    segEls.push(circle);

    if (!reduceMotion) {
      setTimeout(function () {
        circle.setAttribute('stroke-dasharray', visibleLength + ' ' + (circumference - visibleLength));
      }, 40);
    }

    var li = document.createElement('li');
    li.className = 'legend-item';
    li.setAttribute('data-index', i);
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.innerHTML =
      '<span class="legend-swatch" style="background:' + d.hex + '"></span>' +
      '<span class="legend-text">' +
        '<span class="legend-label">' + d.label + '</span>' +
        '<span class="legend-meta">' + d.value + ' m&sup2;</span>' +
      '</span>' +
      '<span class="legend-pct">' + Math.round(pct * 100) + '%</span>';
    legendList.appendChild(li);
    legendEls.push(li);
  });

  function activate(i) {
    var d = data[i];
    var pct = Math.round((d.value / total) * 100);

    segEls.forEach(function (s, si) {
      s.classList.toggle('is-active', si === i);
      s.classList.toggle('is-dimmed', si !== i);
    });
    legendEls.forEach(function (l, li) {
      l.classList.toggle('is-active', li === i);
    });

    centerValue.textContent = pct + '%';
    centerLabel.textContent = d.label;
  }

  function reset() {
    segEls.forEach(function (s) {
      s.classList.remove('is-active', 'is-dimmed');
    });
    legendEls.forEach(function (l) {
      l.classList.remove('is-active');
    });
    centerValue.textContent = '100%';
    centerLabel.textContent = 'Total plot';
    tooltip.hidden = true;
  }

  function showTooltip(el, d) {
    var cardBox = card.getBoundingClientRect();
    var elBox = el.getBoundingClientRect();
    var x = elBox.left + elBox.width / 2 - cardBox.left;
    var y = elBox.top - cardBox.top;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.innerHTML = d.label + '<span class="tt-value">' + d.value + ' m&sup2;</span>';
    tooltip.hidden = false;
  }

  segEls.forEach(function (seg, i) {
    seg.addEventListener('pointerenter', function () {
      activate(i);
      showTooltip(seg, data[i]);
    });
    seg.addEventListener('pointerleave', reset);
    seg.addEventListener('touchstart', function (e) {
      e.preventDefault();
      activate(i);
      showTooltip(seg, data[i]);
    }, { passive: false });
  });

  legendEls.forEach(function (li, i) {
    li.addEventListener('mouseenter', function () { activate(i); });
    li.addEventListener('mouseleave', reset);
    li.addEventListener('focus', function () { activate(i); });
    li.addEventListener('blur', reset);
    li.addEventListener('click', function () { activate(i); });
  });

  svg.addEventListener('pointerleave', reset);
  document.addEventListener('touchend', function (e) {
    if (!svg.contains(e.target)) reset();
  });
})();
