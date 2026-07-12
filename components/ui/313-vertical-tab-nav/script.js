(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tablist = document.getElementById('vtabList');
  if (!tablist) return;

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('.vtab-tab'));

  function selectTab(tab, moveFocus) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;

      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });

    if (moveFocus) tab.focus();
  }

  tablist.addEventListener('click', function (e) {
    var tab = e.target.closest('.vtab-tab');
    if (!tab) return;
    selectTab(tab, false);
  });

  tablist.addEventListener('keydown', function (e) {
    var currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    var newIndex = null;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    selectTab(tabs[newIndex], true);
  });
})();
