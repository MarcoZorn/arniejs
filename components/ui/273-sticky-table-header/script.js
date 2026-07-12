(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var varieties = ['Honeycrisp', 'Gala', 'Fuji', 'Granny Smith', 'Braeburn', 'Golden Delicious', 'Empire', 'Jonagold'];
  var blocks = ['Block A', 'Block B', 'Block C', 'Block D'];
  var healthStates = [
    { key: 'good', label: 'Thriving' },
    { key: 'watch', label: 'Watch' },
    { key: 'stressed', label: 'Stressed' }
  ];

  var rows = [];
  for (var i = 1; i <= 32; i++) {
    var variety = varieties[i % varieties.length];
    var block = blocks[Math.floor(i / 8) % blocks.length];
    var plantedYear = 2016 + (i % 9);
    var height = (6 + (i % 11) * 0.7).toFixed(1);
    var yieldLb = 20 + ((i * 37) % 180);
    var health = healthStates[i % 3];

    rows.push({
      id: 'T-' + String(1000 + i),
      variety: variety,
      block: block,
      planted: plantedYear,
      height: height,
      yieldLb: yieldLb,
      health: health
    });
  }

  var body = document.getElementById('sthBody');
  var scrollEl = document.getElementById('sthScroll');
  if (!body || !scrollEl) return;

  rows.forEach(function (row) {
    var tr = document.createElement('tr');

    var cells = [row.id, row.variety, row.block, String(row.planted), row.height, row.yieldLb.toLocaleString()];
    cells.forEach(function (val) {
      var td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });

    var healthTd = document.createElement('td');
    var span = document.createElement('span');
    span.className = 'sth-health sth-health--' + row.health.key;
    span.textContent = row.health.label;
    healthTd.appendChild(span);
    tr.appendChild(healthTd);

    body.appendChild(tr);
  });

  var ticking = false;

  function updateShadow() {
    var scrolled = scrollEl.scrollTop > 2;
    scrollEl.classList.toggle('sth-head-shadow', scrolled);
    ticking = false;
  }

  scrollEl.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateShadow);
      ticking = true;
    }
  }, { passive: true });

  updateShadow();
})();
