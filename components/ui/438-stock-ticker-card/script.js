(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.stock-tab'));
  var priceEl = document.querySelector('#stockPrice');
  var changeEl = document.querySelector('#stockChange');
  var changeValueEl = document.querySelector('#stockChangeValue');
  var polyline = document.querySelector('#stockPolyline');
  if (!tabs.length || !priceEl || !changeEl || !changeValueEl || !polyline) return;

  var datasets = {
    '1D': {
      price: '$142.87',
      change: '+2.34%',
      up: true,
      points: '0,55 30,50 60,58 90,42 120,45 150,30 180,35 210,20 240,25 270,10 300,15'
    },
    '1W': {
      price: '$138.20',
      change: '-3.71%',
      up: false,
      points: '0,15 30,22 60,18 90,30 120,28 150,40 180,36 210,50 240,46 270,60 300,58'
    }
  };

  function applyRange(range) {
    var data = datasets[range];
    if (!data) return;

    priceEl.textContent = data.price;
    changeValueEl.textContent = data.change;
    changeEl.classList.toggle('is-up', data.up);
    changeEl.classList.toggle('is-down', !data.up);

    var color = data.up ? 'var(--accent-moss)' : 'var(--accent-rust)';
    polyline.setAttribute('stroke', color);

    if (reduceMotion) {
      polyline.setAttribute('points', data.points);
      return;
    }

    polyline.style.transition = 'opacity 0.15s ease';
    polyline.style.opacity = '0';
    window.setTimeout(function () {
      polyline.setAttribute('points', data.points);
      polyline.style.opacity = '1';
    }, 150);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      applyRange(tab.getAttribute('data-range'));
    });
  });
})();
