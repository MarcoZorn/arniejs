(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.htab-tab'));
  if (!tabs.length) return;

  var defaultHash = tabs[0].getAttribute('data-hash');

  function panelFor(tab) {
    return document.getElementById(tab.getAttribute('aria-controls'));
  }

  function activate(hash, updateHistory) {
    var match = tabs.filter(function (t) { return t.getAttribute('data-hash') === hash; })[0];
    if (!match) match = tabs[0];

    tabs.forEach(function (tab) {
      var selected = tab === match;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
      var panel = panelFor(tab);
      if (panel) panel.hidden = !selected;
    });

    if (updateHistory) {
      var targetHash = '#' + match.getAttribute('data-hash');
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }

    if (!reduceMotion) {
      var activePanel = panelFor(match);
      if (activePanel) {
        activePanel.animate(
          [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 160, easing: 'ease-out' }
        );
      }
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activate(tab.getAttribute('data-hash'), true);
    });

    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var next = tabs[(index + 1) % tabs.length];
        next.focus();
        activate(next.getAttribute('data-hash'), true);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = tabs[(index - 1 + tabs.length) % tabs.length];
        prev.focus();
        activate(prev.getAttribute('data-hash'), true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        tabs[0].focus();
        activate(tabs[0].getAttribute('data-hash'), true);
      } else if (e.key === 'End') {
        e.preventDefault();
        var last = tabs[tabs.length - 1];
        last.focus();
        activate(last.getAttribute('data-hash'), true);
      }
    });
  });

  function syncFromHash() {
    var hash = window.location.hash.replace('#', '') || defaultHash;
    activate(hash, false);
  }

  window.addEventListener('hashchange', syncFromHash);
  window.addEventListener('popstate', syncFromHash);

  syncFromHash();
})();
