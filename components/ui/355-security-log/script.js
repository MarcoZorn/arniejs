(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.seclog-filter-btn'));
  var items = Array.prototype.slice.call(document.querySelectorAll('.seclog-item'));
  var emptyMsg = document.querySelector('.seclog-empty');

  if (!filterBtns.length || !items.length) return;

  function applyFilter(filter) {
    var visibleCount = 0;

    items.forEach(function (item) {
      var type = item.getAttribute('data-type');
      var matches = filter === 'all' || type === filter;
      item.hidden = !matches;
      if (matches) visibleCount++;
    });

    if (emptyMsg) {
      emptyMsg.hidden = visibleCount !== 0;
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });

      applyFilter(filter);

      if (reduceMotion) return;

      btn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.95)' },
          { transform: 'scale(1)' }
        ],
        { duration: 160, easing: 'ease-out' }
      );
    });
  });

  applyFilter('all');
})();
