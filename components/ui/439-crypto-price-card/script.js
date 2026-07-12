(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.crypto-card');
  var refreshBtn = document.querySelector('.crypto-refresh');
  var priceEl = document.querySelector('#cryptoPrice');
  var changeEl = document.querySelector('#cryptoChange');
  var changeValueEl = document.querySelector('#cryptoChangeValue');
  var polyline = document.querySelector('#cryptoPolyline');
  if (!card || !refreshBtn || !priceEl || !changeEl || !changeValueEl || !polyline) return;

  var lastPrice = 4218.62;

  function randomPoints() {
    var points = [];
    var y = 35 + (Math.random() * 20 - 10);
    for (var i = 0; i <= 12; i++) {
      y += (Math.random() * 24 - 12);
      y = Math.max(4, Math.min(64, y));
      points.push((i * 25) + ',' + y.toFixed(1));
    }
    return points.join(' ');
  }

  function refresh() {
    var deltaPct = (Math.random() * 12 - 6);
    var up = deltaPct >= 0;
    var newPrice = Math.max(50, lastPrice * (1 + deltaPct / 100));
    lastPrice = newPrice;

    var priceText = '$' + newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    var changeText = (up ? '+' : '') + deltaPct.toFixed(2) + '%';
    var color = up ? 'var(--accent-moss)' : 'var(--accent-rust)';
    var newPoints = randomPoints();

    function apply() {
      priceEl.textContent = priceText;
      changeValueEl.textContent = changeText;
      changeEl.classList.toggle('is-up', up);
      changeEl.classList.toggle('is-down', !up);
      polyline.setAttribute('stroke', color);
      polyline.setAttribute('points', newPoints);
    }

    if (reduceMotion) {
      apply();
      return;
    }

    card.classList.add('is-updating');
    refreshBtn.classList.add('is-spinning');

    priceEl.style.opacity = '0.35';
    polyline.style.opacity = '0.2';

    window.setTimeout(function () {
      apply();
      priceEl.style.opacity = '1';
      polyline.style.opacity = '1';
      window.setTimeout(function () {
        card.classList.remove('is-updating');
      }, 350);
    }, 220);

    window.setTimeout(function () {
      refreshBtn.classList.remove('is-spinning');
    }, 620);
  }

  refreshBtn.addEventListener('click', refresh);
})();
