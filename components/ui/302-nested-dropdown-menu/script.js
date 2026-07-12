(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nav = document.querySelector('.ndrop-nav');
  var menubar = document.querySelector('.ndrop-menu');
  var note = document.querySelector('.ndrop-note');
  if (!nav || !menubar) return;

  var topItems = Array.prototype.slice.call(menubar.children);
  var noteTimer = null;

  function getSub(menuItem) {
    return menuItem.querySelector(':scope > .ndrop-sub');
  }

  function getTrigger(menuItem) {
    return menuItem.querySelector(':scope > .ndrop-trigger');
  }

  function isOpen(menuItem) {
    var sub = getSub(menuItem);
    return sub && !sub.hidden;
  }

  function openItem(menuItem) {
    var sub = getSub(menuItem);
    var trigger = getTrigger(menuItem);
    if (!sub || !trigger) return;
    sub.hidden = false;
    menuItem.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeItem(menuItem, keepFocus) {
    var sub = getSub(menuItem);
    var trigger = getTrigger(menuItem);
    if (!sub || !trigger) return;
    // Close any nested submenus first.
    Array.prototype.slice.call(sub.querySelectorAll('.ndrop-menu-item')).forEach(function (nested) {
      closeItem(nested, false);
    });
    sub.hidden = true;
    menuItem.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (keepFocus) trigger.focus();
  }

  function closeAll(keepFocus) {
    topItems.forEach(function (item) { closeItem(item, false); });
    if (keepFocus) {
      var firstTrigger = getTrigger(topItems[0]);
      if (firstTrigger) firstTrigger.focus();
    }
  }

  function closeSiblings(menuItem) {
    var parent = menuItem.parentElement.closest('.ndrop-menu, .ndrop-sub');
    if (!parent) return;
    Array.prototype.slice.call(parent.children).forEach(function (child) {
      var candidate = child.classList && child.classList.contains('ndrop-menu-item') ? child : null;
      if (candidate && candidate !== menuItem) closeItem(candidate, false);
    });
  }

  function itemsIn(container) {
    return Array.prototype.slice.call(container.children).map(function (li) {
      return li.querySelector(':scope > .ndrop-trigger, :scope > .ndrop-item');
    }).filter(Boolean);
  }

  // Wire every trigger (top-level and nested) for click + keyboard.
  Array.prototype.slice.call(nav.querySelectorAll('.ndrop-menu-item')).forEach(function (menuItem) {
    var trigger = getTrigger(menuItem);
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = isOpen(menuItem);
      closeSiblings(menuItem);
      if (wasOpen) {
        closeItem(menuItem, false);
      } else {
        openItem(menuItem);
        var sub = getSub(menuItem);
        var first = sub && itemsIn(sub)[0];
        if (first) first.focus();
      }
    });

    // Hover support for pointer/mouse users; click still works for touch.
    menuItem.addEventListener('mouseenter', function () {
      if (window.matchMedia('(hover: hover)').matches) {
        closeSiblings(menuItem);
        openItem(menuItem);
      }
    });

    trigger.addEventListener('keydown', function (e) {
      var container = trigger.closest('.ndrop-menu, .ndrop-sub');
      var siblingItems = itemsIn(container);
      var idx = siblingItems.indexOf(trigger);
      var horizontal = container.classList.contains('ndrop-menu');

      if ((horizontal && e.key === 'ArrowRight') || (!horizontal && e.key === 'ArrowDown')) {
        e.preventDefault();
        var next = siblingItems[(idx + 1) % siblingItems.length];
        if (next) next.focus();
        return;
      }
      if ((horizontal && e.key === 'ArrowLeft') || (!horizontal && e.key === 'ArrowUp')) {
        e.preventDefault();
        var prev = siblingItems[(idx - 1 + siblingItems.length) % siblingItems.length];
        if (prev) prev.focus();
        return;
      }
      if (!horizontal && e.key === 'ArrowRight') {
        e.preventDefault();
        closeSiblings(menuItem);
        openItem(menuItem);
        var sub2 = getSub(menuItem);
        var first2 = sub2 && itemsIn(sub2)[0];
        if (first2) first2.focus();
        return;
      }
      if (!horizontal && e.key === 'ArrowLeft') {
        e.preventDefault();
        var parentLi = menuItem.parentElement.closest('.ndrop-menu-item');
        if (parentLi) {
          closeItem(menuItem, false);
          var parentTrigger = getTrigger(parentLi);
          if (parentTrigger) parentTrigger.focus();
        }
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeAll(true);
        return;
      }
    });
  });

  // Leaf items (no submenu): click selects and closes everything.
  Array.prototype.slice.call(nav.querySelectorAll('.ndrop-item:not(.ndrop-trigger)')).forEach(function (leaf) {
    leaf.addEventListener('click', function (e) {
      e.stopPropagation();
      var label = leaf.textContent.trim();
      if (note) {
        note.textContent = 'You picked "' + label + '" from the catalog.';
        window.clearTimeout(noteTimer);
        noteTimer = window.setTimeout(function () { note.textContent = ''; }, 4000);
      }
      closeAll(true);
    });

    leaf.addEventListener('keydown', function (e) {
      var container = leaf.closest('.ndrop-sub');
      var siblingItems = itemsIn(container);
      var idx = siblingItems.indexOf(leaf);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = siblingItems[(idx + 1) % siblingItems.length];
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = siblingItems[(idx - 1 + siblingItems.length) % siblingItems.length];
        if (prev) prev.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        var parentLi = leaf.parentElement.closest('.ndrop-menu-item');
        if (parentLi) {
          closeItem(parentLi, false);
          var parentTrigger = getTrigger(parentLi);
          if (parentTrigger) parentTrigger.focus();
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        leaf.click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeAll(true);
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeAll(false);
  });

  document.addEventListener('focusin', function (e) {
    if (!nav.contains(e.target)) closeAll(false);
  });
})();
