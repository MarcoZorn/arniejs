(function () {
  var dock = document.getElementById('dock');
  if (!dock) return;

  var items = Array.prototype.slice.call(dock.querySelectorAll('.dock__item'));

  // Touch devices don't have hover, so tap toggles the preview instead.
  items.forEach(function (item) {
    item.addEventListener('click', function (e) {
      var isActive = item.classList.contains('is-active');
      items.forEach(function (other) {
        other.classList.remove('is-active');
      });
      if (!isActive) {
        item.classList.add('is-active');
        e.preventDefault();
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!dock.contains(e.target)) {
      items.forEach(function (item) { item.classList.remove('is-active'); });
    }
  });
})();
