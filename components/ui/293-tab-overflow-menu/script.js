(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar = document.querySelector('.tabov-bar');
  var list = document.getElementById('tabovList');
  var moreTrigger = document.getElementById('tabovMoreTrigger');
  var moreMenu = document.getElementById('tabovMoreMenu');
  var panels = Array.prototype.slice.call(document.querySelectorAll('.tabov-panel'));
  if (!bar || !list || !moreTrigger || !moreMenu) return;

  var tabs = Array.prototype.slice.call(list.querySelectorAll('.tabov-tab'));
  var resizeTimer = null;

  function activateTab(tab, focusIt) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.id !== tab.getAttribute('aria-controls');
    });
    updateMoreState();
    if (focusIt) tab.focus();
  }

  function updateMoreState() {
    var activeTab = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0];
    var activeIsHidden = activeTab && activeTab.classList.contains('tabov-tab--hidden');
    moreTrigger.classList.toggle('has-active', !!activeIsHidden);
  }

  function closeMenu(focusTrigger) {
    moreMenu.hidden = true;
    moreTrigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onOutsideClick, true);
    document.removeEventListener('keydown', onMenuKeydown, true);
    if (focusTrigger) moreTrigger.focus();
  }

  function openMenu() {
    moreMenu.hidden = false;
    moreTrigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onOutsideClick, true);
    document.addEventListener('keydown', onMenuKeydown, true);
    var firstItem = moreMenu.querySelector('.tabov-menu-item');
    if (firstItem) firstItem.focus();
  }

  function onOutsideClick(event) {
    if (!moreMenu.contains(event.target) && event.target !== moreTrigger) {
      closeMenu(false);
    }
  }

  function onMenuKeydown(event) {
    var items = Array.prototype.slice.call(moreMenu.querySelectorAll('.tabov-menu-item'));
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      var current = items.indexOf(document.activeElement);
      var next;
      if (event.key === 'ArrowDown') {
        next = current === -1 ? 0 : (current + 1) % items.length;
      } else {
        next = current === -1 ? items.length - 1 : (current - 1 + items.length) % items.length;
      }
      items[next].focus();
    }
  }

  moreTrigger.addEventListener('click', function () {
    if (moreMenu.hidden) {
      openMenu();
    } else {
      closeMenu(false);
    }
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab, false);
    });
  });

  list.addEventListener('keydown', function (event) {
    var visibleTabs = tabs.filter(function (t) { return !t.classList.contains('tabov-tab--hidden'); });
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    var current = visibleTabs.indexOf(document.activeElement);
    if (current === -1) return;
    var next = event.key === 'ArrowRight'
      ? (current + 1) % visibleTabs.length
      : (current - 1 + visibleTabs.length) % visibleTabs.length;
    activateTab(visibleTabs[next], true);
  });

  function rebuildMenu(hiddenTabs) {
    moreMenu.innerHTML = '';
    hiddenTabs.forEach(function (tab) {
      var li = document.createElement('li');
      li.setAttribute('role', 'none');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tabov-menu-item';
      btn.setAttribute('role', 'menuitem');
      btn.textContent = tab.textContent;
      if (tab.classList.contains('is-active')) btn.classList.add('is-active');
      btn.addEventListener('click', function () {
        activateTab(tab, false);
        closeMenu(true);
      });
      li.appendChild(btn);
      moreMenu.appendChild(li);
    });
  }

  function layout() {
    // Reset so we can measure the full natural width of every tab.
    tabs.forEach(function (tab) {
      tab.classList.remove('tabov-tab--hidden');
    });
    moreTrigger.hidden = true;

    var barWidth = bar.clientWidth;
    var moreWidth = moreTrigger.offsetWidth || 96;
    var available = barWidth;
    var used = 0;
    var hiddenTabs = [];
    var willOverflow = false;

    var widths = tabs.map(function (tab) { return tab.offsetWidth; });
    var total = widths.reduce(function (sum, w) { return sum + w; }, 0);

    if (total > available) {
      willOverflow = true;
      available -= moreWidth;
    }

    tabs.forEach(function (tab, i) {
      used += widths[i];
      if (willOverflow && used > available) {
        tab.classList.add('tabov-tab--hidden');
        hiddenTabs.push(tab);
      }
    });

    moreTrigger.hidden = !willOverflow;
    rebuildMenu(hiddenTabs);
    updateMoreState();
  }

  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layout, 120);
  });

  layout();
})();
