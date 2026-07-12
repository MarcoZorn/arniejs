(function () {
  var seeds = [
    { name: 'Cherokee Purple Tomato', category: 'Vegetable', supplier: 'Ridgeline Seed Co.', germination: '85%', price: '$3.50' },
    { name: 'Genovese Basil', category: 'Herb', supplier: 'Loamhouse Botanicals', germination: '92%', price: '$2.25' },
    { name: 'Black Krim Tomato', category: 'Vegetable', supplier: 'Ridgeline Seed Co.', germination: '80%', price: '$3.75' },
    { name: 'Zinnia Cactus Mix', category: 'Flower', supplier: 'Bramblewood Growers', germination: '75%', price: '$2.90' },
    { name: 'Detroit Dark Red Beet', category: 'Vegetable', supplier: 'Furrow & Field', germination: '88%', price: '$2.10' },
    { name: 'Rosemary, Common', category: 'Herb', supplier: 'Loamhouse Botanicals', germination: '65%', price: '$3.00' },
    { name: 'Sugar Baby Watermelon', category: 'Fruit', supplier: 'Sunridge Orchards', germination: '78%', price: '$4.20' },
    { name: 'Sunflower, Mammoth', category: 'Flower', supplier: 'Bramblewood Growers', germination: '90%', price: '$1.75' },
    { name: 'Bloody Butcher Corn', category: 'Grain', supplier: 'Furrow & Field', germination: '82%', price: '$3.10' },
    { name: 'Thai Basil', category: 'Herb', supplier: 'Loamhouse Botanicals', germination: '89%', price: '$2.40' },
    { name: 'Scarlet Nantes Carrot', category: 'Vegetable', supplier: 'Ridgeline Seed Co.', germination: '84%', price: '$1.95' },
    { name: 'Cosmos, Sensation Mix', category: 'Flower', supplier: 'Bramblewood Growers', germination: '81%', price: '$2.60' },
    { name: 'Charentais Melon', category: 'Fruit', supplier: 'Sunridge Orchards', germination: '70%', price: '$4.60' },
    { name: 'Hard Red Winter Wheat', category: 'Grain', supplier: 'Furrow & Field', germination: '91%', price: '$2.80' },
    { name: 'Lemon Balm', category: 'Herb', supplier: 'Loamhouse Botanicals', germination: '73%', price: '$2.15' },
    { name: 'Marigold, French Dwarf', category: 'Flower', supplier: 'Bramblewood Growers', germination: '86%', price: '$1.85' },
    { name: 'Honeycrisp Apple (rootstock)', category: 'Fruit', supplier: 'Sunridge Orchards', germination: '60%', price: '$6.90' },
    { name: 'Purple Hull Pea', category: 'Vegetable', supplier: 'Ridgeline Seed Co.', germination: '87%', price: '$2.55' }
  ];

  var searchInput = document.querySelector('.filt-tbl-search-input');
  var selectInput = document.querySelector('.filt-tbl-select');
  var tbody = document.querySelector('.filt-tbl-body');
  var empty = document.querySelector('.filt-tbl-empty');
  var table = document.querySelector('.filt-tbl-table');
  var count = document.querySelector('.filt-tbl-count');
  if (!tbody) return;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    var idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx)) + '<mark class="filt-tbl-hit">' + escapeHtml(text.slice(idx, idx + query.length)) + '</mark>' + escapeHtml(text.slice(idx + query.length));
  }

  function render() {
    var query = searchInput.value.trim().toLowerCase();
    var category = selectInput.value;

    var matches = seeds.filter(function (seed) {
      var matchesQuery = !query ||
        seed.name.toLowerCase().indexOf(query) !== -1 ||
        seed.supplier.toLowerCase().indexOf(query) !== -1;
      var matchesCategory = !category || seed.category === category;
      return matchesQuery && matchesCategory;
    });

    tbody.innerHTML = '';
    matches.forEach(function (seed) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + highlight(seed.name, query) + '</td>' +
        '<td><span class="filt-tbl-cat" data-cat="' + seed.category + '">' + seed.category + '</span></td>' +
        '<td class="filt-tbl-cell-supplier">' + highlight(seed.supplier, query) + '</td>' +
        '<td>' + seed.germination + '</td>' +
        '<td>' + seed.price + '</td>';
      tbody.appendChild(tr);
    });

    var hasResults = matches.length > 0;
    table.hidden = !hasResults;
    empty.hidden = hasResults;

    if (count) {
      count.textContent = matches.length + ' of ' + seeds.length + ' varieties shown.';
    }
  }

  searchInput.addEventListener('input', render);
  selectInput.addEventListener('change', render);

  render();
})();
