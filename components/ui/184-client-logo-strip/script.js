(function () {
  var items = document.querySelectorAll('.logo-strip__item');
  if (!items.length) return;

  items.forEach(function (item) {
    item.setAttribute('tabindex', '0');
  });
})();
