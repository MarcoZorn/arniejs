(function () {
  var tablist = document.querySelector('.pt-tablist');
  if (!tablist) return;

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('.pt-tab'));
  var indicator = tablist.querySelector('.pt-indicator');
  var panels = tabs.map(function (tab) {
    return document.getElementById(tab.getAttribute('aria-controls'));
  });

  function moveIndicator(tab) {
    if (!indicator) return;
    indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    indicator.style.width = tab.offsetWidth + 'px';
  }

  function activate(index, focusTab) {
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    moveIndicator(tabs[index]);
    if (focusTab) tabs[index].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      activate(i, false);
    });

    tab.addEventListener('keydown', function (e) {
      var newIndex = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        newIndex = (i + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        newIndex = (i - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      }
      if (newIndex !== null) {
        e.preventDefault();
        activate(newIndex, true);
      }
    });
  });

  window.addEventListener('resize', function () {
    var current = tabs.findIndex(function (t) {
      return t.getAttribute('aria-selected') === 'true';
    });
    if (current > -1) moveIndicator(tabs[current]);
  });

  moveIndicator(tabs[0]);
})();
