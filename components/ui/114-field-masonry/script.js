(function () {
  var container = document.getElementById('masonry');
  if (!container) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GAP = 18;
  var MIN_COL_WIDTH = 220;

  var swatches = ['#c4622d', '#5a7a3a', '#8fa86e', '#9b6b3a', '#d4a85a', '#a03820'];
  var tags = ['Wheat', 'Barley', 'Rye', 'Oats', 'Clover', 'Flax', 'Millet', 'Sorghum', 'Rice', 'Spelt', 'Hops', 'Chicory'];

  var items = [];
  for (var i = 0; i < 18; i++) {
    var height = 120 + Math.floor(Math.random() * 4) * 40;
    items.push({
      height: height,
      swatch: swatches[i % swatches.length],
      tag: tags[i % tags.length],
      index: i + 1
    });
  }

  var els = items.map(function (item) {
    var el = document.createElement('div');
    el.className = 'masonry-item';
    el.style.setProperty('--swatch', item.swatch);
    el.style.height = item.height + 'px';
    el.innerHTML =
      '<div class="masonry-item-label">Plot ' + item.index + '</div>' +
      '<div class="masonry-item-tag">' + item.tag + '</div>';
    container.appendChild(el);
    return el;
  });

  function layout() {
    var containerWidth = container.clientWidth;
    var columns = Math.max(1, Math.floor((containerWidth + GAP) / (MIN_COL_WIDTH + GAP)));
    var colWidth = (containerWidth - GAP * (columns - 1)) / columns;
    var colHeights = new Array(columns).fill(0);

    items.forEach(function (item, i) {
      var col = colHeights.indexOf(Math.min.apply(null, colHeights));
      var x = col * (colWidth + GAP);
      var y = colHeights[col];

      var el = els[i];
      if (reduceMotion) el.style.transition = 'none';
      el.style.width = colWidth + 'px';
      el.style.left = x + 'px';
      el.style.top = y + 'px';

      colHeights[col] += item.height + GAP;
    });

    container.style.height = Math.max.apply(null, colHeights) - GAP + 'px';
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 100);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layout);
  }

  layout();
})();
