(function () {
  var items = document.querySelectorAll('[data-menu-item]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverCapable = window.matchMedia('(hover: hover)').matches;
  var closeTimers = new WeakMap();

  function closeAll(except) {
    items.forEach(function (item) {
      if (item !== except) {
        item.classList.remove('open');
        var trigger = item.querySelector('[data-trigger]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('[data-trigger]');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = item.classList.contains('open');
      closeAll(item);
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });

    if (hoverCapable) {
      item.addEventListener('mouseenter', function () {
        var t = closeTimers.get(item);
        if (t) clearTimeout(t);
        closeAll(item);
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      });
      item.addEventListener('mouseleave', function () {
        var timer = setTimeout(function () {
          item.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }, reduceMotion ? 0 : 150);
        closeTimers.set(item, timer);
      });
    }
  });

  document.addEventListener('click', function (e) {
    var insideAny = Array.prototype.some.call(items, function (item) {
      return item.contains(e.target);
    });
    if (!insideAny) closeAll(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
