(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var plot = document.getElementById('cmenuPlot');
  var trigger = document.getElementById('cmenuTrigger');
  var menu = document.getElementById('cmenuMenu');
  var note = document.getElementById('cmenuNote') || document.querySelector('.cmenu-note');
  if (!plot || !trigger || !menu) return;

  var items = Array.prototype.slice.call(menu.querySelectorAll('.cmenu-item'));
  var lastFocused = null;
  var noteTimer = null;

  function openMenu(x, y, opener) {
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.hidden = false;

    // Clamp position so the menu stays inside the viewport.
    var rect = menu.getBoundingClientRect();
    var maxX = window.innerWidth - rect.width - 8;
    var maxY = window.innerHeight - rect.height - 8;
    var left = Math.min(x, Math.max(8, maxX));
    var top = Math.min(y, Math.max(8, maxY));
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    trigger.setAttribute('aria-expanded', 'true');
    lastFocused = opener || document.activeElement;
    focusItem(0);

    document.addEventListener('mousedown', onOutsideClick, true);
    document.addEventListener('keydown', onKeydown, true);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);
  }

  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onOutsideClick, true);
    document.removeEventListener('keydown', onKeydown, true);
    window.removeEventListener('scroll', closeMenu, true);
    window.removeEventListener('resize', closeMenu);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function onOutsideClick(e) {
    if (!menu.contains(e.target) && e.target !== trigger) {
      closeMenu();
    }
  }

  function focusItem(index) {
    if (!items.length) return;
    var clamped = (index + items.length) % items.length;
    items.forEach(function (item, i) {
      item.classList.toggle('is-active', i === clamped);
    });
    items[clamped].focus();
  }

  function currentIndex() {
    var active = document.activeElement;
    var idx = items.indexOf(active);
    return idx === -1 ? 0 : idx;
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItem(currentIndex() + 1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(currentIndex() - 1);
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      focusItem(0);
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      focusItem(items.length - 1);
      return;
    }
    if (e.key === 'Tab') {
      closeMenu();
    }
  }

  plot.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    openMenu(e.clientX, e.clientY, plot);
  });

  trigger.addEventListener('click', function () {
    if (!menu.hidden) {
      closeMenu();
      return;
    }
    var rect = trigger.getBoundingClientRect();
    openMenu(rect.left, rect.bottom + 6, trigger);
  });

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      var action = item.getAttribute('data-action') || 'action';
      if (note) {
        note.textContent = 'You chose "' + action + '". Nothing here is wired to real data — just tending the demo.';
        window.clearTimeout(noteTimer);
        noteTimer = window.setTimeout(function () {
          note.textContent = '';
        }, 4000);
      }
      closeMenu();
    });
    item.addEventListener('mouseenter', function () {
      items.forEach(function (i) { i.classList.remove('is-active'); });
      item.classList.add('is-active');
      item.focus();
    });
  });
})();
