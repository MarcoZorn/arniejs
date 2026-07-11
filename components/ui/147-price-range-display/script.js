(function () {
  var displays = document.querySelectorAll('.price-display[data-original]');

  displays.forEach(function (display) {
    var original = parseFloat(display.getAttribute('data-original'));
    var currentEl = display.querySelector('[data-current]');
    var badgeEl = display.querySelector('[data-badge]');
    if (!currentEl || !badgeEl || !original) return;

    var current = parseFloat(currentEl.getAttribute('data-current'));
    var pct = Math.round(((original - current) / original) * 100);
    badgeEl.textContent = '−' + pct + '%';
  });
})();
