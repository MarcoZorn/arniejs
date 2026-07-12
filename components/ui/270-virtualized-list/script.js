(function () {
  var plants = ['Tomato', 'Basil', 'Carrot', 'Kale', 'Pepper', 'Squash', 'Cucumber', 'Radish', 'Beet', 'Lettuce', 'Spinach', 'Pea', 'Bean', 'Corn', 'Pumpkin', 'Sunflower', 'Marigold', 'Zinnia', 'Rosemary', 'Thyme', 'Sage', 'Mint', 'Lavender', 'Chive', 'Cilantro', 'Dill', 'Parsley', 'Fennel', 'Melon', 'Watermelon'];
  var varieties = ['Early', 'Heirloom', 'Cherokee', 'Golden', 'Sweet', 'Purple', 'Winter', 'Summer', 'Dwarf', 'Giant', 'Compact', 'Rainbow', 'Classic', 'Wild', 'Hardy', 'Miniature'];
  var icons = { seed: '🌱', herb: '🌿', flower: '🌼', fruit: '🍉' };
  var categories = [
    { key: 'seed', label: 'Vegetable seed' },
    { key: 'herb', label: 'Herb seed' },
    { key: 'flower', label: 'Flower seed' },
    { key: 'fruit', label: 'Fruit seed' }
  ];

  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  var TOTAL = 520;
  var items = [];
  for (var i = 0; i < TOTAL; i++) {
    var plant = plants[i % plants.length];
    var variety = varieties[Math.floor(i / plants.length) % varieties.length];
    var cat = categories[i % categories.length];
    var qty = Math.floor(seededRandom(i + 1) * 480) + 20;
    items.push({
      index: i,
      name: variety + ' ' + plant,
      meta: cat.label + ' · Lot #' + (4000 + i),
      icon: icons[cat.key],
      qty: qty + ' pkts'
    });
  }

  var scrollEl = document.querySelector('.virt-list-scroll');
  var spacer = document.querySelector('.virt-list-spacer');
  var viewport = document.querySelector('.virt-list-viewport');
  var status = document.querySelector('.virt-list-status');
  if (!scrollEl || !spacer || !viewport) return;

  var ROW_HEIGHT = 64;
  var BUFFER = 6;

  spacer.style.height = (TOTAL * ROW_HEIGHT) + 'px';

  var renderedStart = -1;
  var renderedEnd = -1;

  function rowHtml(item) {
    return (
      '<div class="virt-list-row" style="height:' + ROW_HEIGHT + 'px">' +
      '<span class="virt-list-index">#' + (item.index + 1) + '</span>' +
      '<span class="virt-list-icon" aria-hidden="true">' + item.icon + '</span>' +
      '<span class="virt-list-body">' +
      '<span class="virt-list-name">' + item.name + '</span><br>' +
      '<span class="virt-list-meta">' + item.meta + '</span>' +
      '</span>' +
      '<span class="virt-list-qty">' + item.qty + '</span>' +
      '</div>'
    );
  }

  function update() {
    var scrollTop = scrollEl.scrollTop;
    var viewportHeight = scrollEl.clientHeight;

    var visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT);
    var startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
    var endIndex = Math.min(TOTAL, startIndex + visibleCount + BUFFER * 2);

    if (startIndex === renderedStart && endIndex === renderedEnd) return;
    renderedStart = startIndex;
    renderedEnd = endIndex;

    var html = '';
    for (var i = startIndex; i < endIndex; i++) {
      html += rowHtml(items[i]);
    }
    viewport.innerHTML = html;
    viewport.style.transform = 'translateY(' + (startIndex * ROW_HEIGHT) + 'px)';

    if (status) {
      status.textContent = 'Showing rows ' + (startIndex + 1) + '–' + endIndex + ' of ' + TOTAL + ' in the DOM.';
    }
  }

  scrollEl.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  update();
})();
