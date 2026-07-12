(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var sidebar = document.querySelector('.pfs-sidebar');
  var grid = document.querySelector('[data-grid]');
  if (!sidebar || !grid) return;

  var products = [
    { name: 'Echeveria Blue Curls', category: 'succulents', price: 14, hue: '#5a7a3a' },
    { name: 'Zebra Haworthia', category: 'succulents', price: 9, hue: '#8fa86e' },
    { name: 'String of Pearls', category: 'succulents', price: 18, hue: '#5a7a3a' },
    { name: 'Genovese Basil', category: 'herbs', price: 5, hue: '#8fa86e' },
    { name: 'French Thyme', category: 'herbs', price: 6, hue: '#5a7a3a' },
    { name: 'Curled Parsley', category: 'herbs', price: 4, hue: '#8fa86e' },
    { name: 'Rosemary Standard', category: 'herbs', price: 12, hue: '#5a7a3a' },
    { name: 'Coneflower Mix', category: 'perennials', price: 16, hue: '#9b6b3a' },
    { name: 'Russian Sage', category: 'perennials', price: 22, hue: '#8fa86e' },
    { name: 'Daylily Stella', category: 'perennials', price: 15, hue: '#9b6b3a' },
    { name: 'Dwarf Boxwood', category: 'shrubs', price: 34, hue: '#5a7a3a' },
    { name: 'Hydrangea Blue', category: 'shrubs', price: 42, hue: '#9b6b3a' },
    { name: 'Weigela Wine', category: 'shrubs', price: 28, hue: '#a03820' },
    { name: 'Heirloom Tomato Seeds', category: 'seeds', price: 3, hue: '#c4622d' },
    { name: 'Wildflower Meadow Mix', category: 'seeds', price: 7, hue: '#d4a85a' },
    { name: 'Sunflower Giant Seeds', category: 'seeds', price: 4, hue: '#d4a85a' }
  ];

  products.forEach(function (p, i) {
    var card = document.createElement('div');
    card.className = 'pfs-card';
    card.dataset.category = p.category;
    card.dataset.price = p.price;
    card.innerHTML =
      '<div class="pfs-card-thumb" style="background: linear-gradient(135deg,' + p.hue + ',#241a0e);"></div>' +
      '<p class="pfs-card-name">' + p.name + '</p>' +
      '<p class="pfs-card-cat">' + p.category + '</p>' +
      '<p class="pfs-card-price">$' + p.price + '</p>';
    grid.appendChild(card);
  });

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.pfs-card'));
  var checkboxes = Array.prototype.slice.call(sidebar.querySelectorAll('[data-category]'));
  var range = sidebar.querySelector('[data-price]');
  var priceOut = sidebar.querySelector('[data-price-out]');
  var countBadge = sidebar.querySelector('[data-count-badge]');
  var resultsCount = document.querySelector('[data-results-count]');
  var clearBtn = sidebar.querySelector('[data-clear]');

  function bumpBadge() {
    if (reduceMotion || !countBadge) return;
    countBadge.classList.add('is-bump');
    window.setTimeout(function () {
      countBadge.classList.remove('is-bump');
    }, 150);
  }

  function applyFilters() {
    var checkedCats = checkboxes
      .filter(function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });

    var maxPrice = parseInt(range.value, 10);
    priceOut.textContent = 'Up to $' + maxPrice;

    var visibleCount = 0;
    cards.forEach(function (card) {
      var matchesCategory = checkedCats.length === 0 || checkedCats.indexOf(card.dataset.category) !== -1;
      var matchesPrice = parseInt(card.dataset.price, 10) <= maxPrice;
      var visible = matchesCategory && matchesPrice;
      card.classList.toggle('is-hidden', !visible);
      if (visible) visibleCount += 1;
    });

    var activeFilterCount = checkedCats.length + (maxPrice < 100 ? 1 : 0);
    countBadge.textContent = activeFilterCount;
    resultsCount.innerHTML = '<strong>' + visibleCount + '</strong> plant' + (visibleCount === 1 ? '' : 's') + ' found';

    var existingEmpty = grid.querySelector('.pfs-empty');
    if (visibleCount === 0) {
      if (!existingEmpty) {
        var empty = document.createElement('p');
        empty.className = 'pfs-empty';
        empty.textContent = 'No plants match those filters yet. Try widening your search.';
        grid.appendChild(empty);
      }
    } else if (existingEmpty) {
      existingEmpty.remove();
    }
  }

  checkboxes.forEach(function (cb) {
    cb.addEventListener('change', function () {
      bumpBadge();
      applyFilters();
    });
  });

  range.addEventListener('input', applyFilters);

  clearBtn.addEventListener('click', function () {
    checkboxes.forEach(function (cb) { cb.checked = false; });
    range.value = 100;
    applyFilters();
    bumpBadge();
  });

  applyFilters();
})();
