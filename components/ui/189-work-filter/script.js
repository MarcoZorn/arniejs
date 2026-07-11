(function () {
  var filterBtns = document.querySelectorAll('.filter-btn');
  var grid = document.getElementById('workGrid');
  if (!filterBtns.length || !grid) return;

  var items = grid.querySelectorAll('.grid-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');

      items.forEach(function (item) {
        var category = item.getAttribute('data-category');
        var match = filter === 'all' || category === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });
})();
