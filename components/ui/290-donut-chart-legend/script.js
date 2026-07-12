(function () {
  var wrap = document.querySelector('.dcl-wrap');
  if (!wrap) return;

  var segmentsGroup = wrap.querySelector('[data-segments]');
  var legendList = wrap.querySelector('[data-legend]');
  var centerValue = wrap.querySelector('[data-center-value]');
  var centerLabel = wrap.querySelector('[data-center-label]');

  // Real sample data: square footage allocated per crop family this season.
  var categories = [
    { name: 'Leafy greens', value: 340, color: 'var(--accent-moss)' },
    { name: 'Root vegetables', value: 260, color: 'var(--accent-clay)' },
    { name: 'Tomatoes & nightshades', value: 210, color: 'var(--accent-terra)' },
    { name: 'Alliums', value: 130, color: 'var(--accent-sand)' },
    { name: 'Squash & vines', value: 175, color: 'var(--accent-sage)' },
    { name: 'Herbs', value: 95, color: 'var(--accent-rust)' }
  ];

  var total = categories.reduce(function (sum, c) { return sum + c.value; }, 0);

  var RADIUS = 80;
  var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  var STROKE = 26;
  var GAP = 3; // visual gap in px of arc length between segments

  centerValue.textContent = total.toLocaleString('en-US') + ' sq ft';
  centerLabel.textContent = 'total plot area';

  var cumulative = 0;
  var segEls = [];
  var legendEls = [];

  categories.forEach(function (cat, i) {
    var pct = cat.value / total;
    var segLength = Math.max(0, pct * CIRCUMFERENCE - GAP);
    var offset = -(cumulative / CIRCUMFERENCE) * CIRCUMFERENCE;

    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '100');
    circle.setAttribute('cy', '100');
    circle.setAttribute('r', RADIUS);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', cat.color);
    circle.setAttribute('stroke-width', STROKE);
    circle.setAttribute('stroke-dasharray', segLength + ' ' + (CIRCUMFERENCE - segLength));
    circle.setAttribute('stroke-dashoffset', offset);
    circle.style.color = cat.color;
    circle.dataset.index = i;
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('role', 'img');
    circle.setAttribute('aria-label', cat.name + ', ' + ((cat.value / total) * 100).toFixed(1) + '%');
    segmentsGroup.appendChild(circle);
    segEls.push(circle);

    cumulative += pct * CIRCUMFERENCE;

    var li = document.createElement('li');
    li.className = 'dcl-legend-item';
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.dataset.index = i;
    var pctText = (pct * 100).toFixed(1) + '%';
    li.innerHTML =
      '<span class="dcl-legend-swatch" style="background:' + cat.color + '"></span>' +
      '<span class="dcl-legend-name">' + cat.name + '</span>' +
      '<span class="dcl-legend-pct">' + pctText + '</span>';
    li.setAttribute('aria-label', cat.name + ', ' + cat.value + ' square feet, ' + pctText + ' of total');
    legendList.appendChild(li);
    legendEls.push(li);
  });

  function activate(index) {
    segEls.forEach(function (circle, i) {
      circle.classList.toggle('is-active', i === index);
      circle.classList.toggle('is-dim', index !== null && i !== index);
    });
    legendEls.forEach(function (li, i) {
      li.classList.toggle('is-active', i === index);
    });

    if (index === null) {
      centerValue.textContent = total.toLocaleString('en-US') + ' sq ft';
      centerLabel.textContent = 'total plot area';
    } else {
      var cat = categories[index];
      var pctText = ((cat.value / total) * 100).toFixed(1) + '%';
      centerValue.textContent = pctText;
      centerLabel.textContent = cat.name;
    }
  }

  segEls.forEach(function (circle, i) {
    circle.addEventListener('mouseenter', function () { activate(i); });
    circle.addEventListener('mouseleave', function () { activate(null); });
    circle.addEventListener('focus', function () { activate(i); });
    circle.addEventListener('blur', function () { activate(null); });
  });

  legendEls.forEach(function (li, i) {
    li.addEventListener('mouseenter', function () { activate(i); });
    li.addEventListener('mouseleave', function () { activate(null); });
    li.addEventListener('focus', function () { activate(i); });
    li.addEventListener('blur', function () { activate(null); });
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(i);
      }
    });
  });
})();
