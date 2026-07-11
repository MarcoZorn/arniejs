(function () {
  var spikeBtn = document.getElementById('spikeBtn');
  if (!spikeBtn) return;

  var bars = [
    {
      el: document.querySelector('.usage-bar[data-level]:nth-of-type(1)') || document.getElementsByClassName('usage-bar')[0],
      fill: document.getElementById('storageFill'),
      value: document.getElementById('storageValue'),
      used: 7.2, limit: 10, unit: 'GB', suffix: ' used',
      format: function (used, limit) { return used.toFixed(1) + 'GB / ' + limit + 'GB used'; }
    },
    {
      el: document.getElementsByClassName('usage-bar')[1],
      fill: document.getElementById('apiFill'),
      value: document.getElementById('apiValue'),
      used: 86400, limit: 100000, unit: '', suffix: '',
      format: function (used, limit) {
        return Math.round(used).toLocaleString() + ' / ' + limit.toLocaleString() + ' calls';
      }
    }
  ];

  function levelFor(pct) {
    if (pct >= 95) return 'crit';
    if (pct >= 80) return 'warn';
    return 'ok';
  }

  function render(bar) {
    var pct = Math.min(100, (bar.used / bar.limit) * 100);
    if (bar.fill) bar.fill.style.width = pct + '%';
    if (bar.value) bar.value.textContent = bar.format(bar.used, bar.limit);
    if (bar.el) bar.el.setAttribute('data-level', levelFor(pct));
  }

  bars.forEach(render);

  spikeBtn.addEventListener('click', function () {
    bars.forEach(function (bar) {
      var remaining = bar.limit - bar.used;
      var bump = remaining * (0.35 + Math.random() * 0.3);
      bar.used = Math.min(bar.limit, bar.used + bump);
      render(bar);
    });

    var allMaxed = bars.every(function (bar) { return bar.used >= bar.limit * 0.98; });
    spikeBtn.disabled = allMaxed;
    if (allMaxed) spikeBtn.textContent = 'Limit reached';
  });
})();
