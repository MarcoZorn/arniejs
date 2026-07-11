(function () {
  var dock = document.getElementById('dock');
  if (!dock) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(dock.querySelectorAll('.dock-item'));

  if (reduceMotion) return;

  var MAX_SCALE = 1.55;
  var MAX_LIFT = -14;
  var RANGE = 110;

  function applyMagnify(mouseX) {
    items.forEach(function (item) {
      var rect = item.getBoundingClientRect();
      var center = rect.left + rect.width / 2;
      var dist = Math.abs(mouseX - center);
      var influence = Math.max(0, 1 - dist / RANGE);
      var scale = 1 + influence * (MAX_SCALE - 1);
      var lift = influence * MAX_LIFT;
      item.style.transform = 'scale(' + scale.toFixed(3) + ') translateY(' + lift.toFixed(1) + 'px)';
      item.classList.toggle('magnified', influence > 0.6);
    });
  }

  function reset() {
    items.forEach(function (item) {
      item.style.transform = 'scale(1) translateY(0)';
      item.classList.remove('magnified');
    });
  }

  dock.addEventListener('mousemove', function (e) {
    applyMagnify(e.clientX);
  });

  dock.addEventListener('mouseleave', reset);

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      item.animate(
        [{ transform: item.style.transform }, { transform: 'scale(1.7) translateY(-18px)' }, { transform: item.style.transform }],
        { duration: 260, easing: 'ease-out' }
      );
    });
  });
})();
