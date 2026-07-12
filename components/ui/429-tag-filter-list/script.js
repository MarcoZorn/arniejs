(function () {
  var pills = Array.prototype.slice.call(document.querySelectorAll('.tagf-pill'));
  var items = Array.prototype.slice.call(document.querySelectorAll('.tagf-item'));
  var emptyState = document.querySelector('.tagf-empty');
  if (!pills.length || !items.length) return;

  var activeTags = [];

  function applyFilter() {
    var visibleCount = 0;

    items.forEach(function (item) {
      var itemTags = (item.getAttribute('data-tags') || '').split(' ');
      var matches = activeTags.length === 0 || activeTags.some(function (tag) {
        return itemTags.indexOf(tag) !== -1;
      });

      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var tag = pill.getAttribute('data-tag');
      var isActive = pill.classList.toggle('is-active');

      if (isActive) {
        activeTags.push(tag);
      } else {
        activeTags = activeTags.filter(function (t) { return t !== tag; });
      }

      applyFilter();
    });
  });

  applyFilter();
})();
