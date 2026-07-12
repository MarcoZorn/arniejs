(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var trigger = document.getElementById('crumb-more-trigger');
  var menu = document.getElementById('crumb-more-menu');
  if (!trigger || !menu) return;

  var menuItems = Array.prototype.slice.call(menu.querySelectorAll('.crumb-menu-link'));

  function openMenu() {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    menuItems.forEach(function (item) {
      item.tabIndex = 0;
    });
    document.addEventListener('click', handleOutsideClick, true);
    document.addEventListener('keydown', handleKeydown, true);
  }

  function closeMenu(focusTrigger) {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    menuItems.forEach(function (item) {
      item.tabIndex = -1;
    });
    document.removeEventListener('click', handleOutsideClick, true);
    document.removeEventListener('keydown', handleKeydown, true);
    if (focusTrigger) trigger.focus();
  }

  function isOpen() {
    return trigger.getAttribute('aria-expanded') === 'true';
  }

  function handleOutsideClick(event) {
    if (!menu.contains(event.target) && event.target !== trigger) {
      closeMenu(false);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      var current = menuItems.indexOf(document.activeElement);
      var next;
      if (event.key === 'ArrowDown') {
        next = current === -1 ? 0 : (current + 1) % menuItems.length;
      } else {
        next = current === -1 ? menuItems.length - 1 : (current - 1 + menuItems.length) % menuItems.length;
      }
      menuItems[next].focus();
    }
  }

  trigger.addEventListener('click', function () {
    if (isOpen()) {
      closeMenu(false);
    } else {
      openMenu();
      if (menuItems[0]) menuItems[0].focus();
    }
  });

  menuItems.forEach(function (item) {
    item.tabIndex = -1;
    item.addEventListener('click', function () {
      closeMenu(true);
    });
  });
})();
