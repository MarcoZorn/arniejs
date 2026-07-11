(function () {
  var menu = document.getElementById('radialMenu');
  var center = document.getElementById('radialCenter');
  if (!menu || !center) return;

  var items = Array.prototype.slice.call(menu.querySelectorAll('.radial-item'));
  var radius = 118;
  var count = items.length;

  items.forEach(function (item, i) {
    var angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    var tx = Math.cos(angle) * radius;
    var ty = Math.sin(angle) * radius;
    item.style.setProperty('--tx', tx.toFixed(1) + 'px');
    item.style.setProperty('--ty', ty.toFixed(1) + 'px');
    item.style.transitionDelay = menu.classList.contains('open') ? '0ms' : (i * 25) + 'ms';
  });

  function setOpen(open) {
    menu.classList.toggle('open', open);
    center.setAttribute('aria-expanded', String(open));
    items.forEach(function (item, i) {
      item.tabIndex = open ? 0 : -1;
      item.style.transitionDelay = open ? (i * 30) + 'ms' : '0ms';
    });
  }

  center.addEventListener('click', function () {
    setOpen(!menu.classList.contains('open'));
  });

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      setOpen(false);
      center.focus();
    });
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
