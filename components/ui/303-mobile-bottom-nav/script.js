(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.mbnav-tab'));
  if (!tabs.length) return;

  function activate(tab) {
    tabs.forEach(function (t) {
      var isTarget = t === tab;
      t.classList.toggle('is-active', isTarget);
      if (isTarget) {
        t.setAttribute('aria-current', 'page');
      } else {
        t.removeAttribute('aria-current');
      }
      var panel = document.getElementById(t.getAttribute('data-panel'));
      if (panel) panel.hidden = !isTarget;
    });

    if (!reduceMotion) {
      var panel = document.getElementById(tab.getAttribute('data-panel'));
      if (panel) {
        panel.animate(
          [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 180, easing: 'ease-out' }
        );
      }
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activate(tab);
    });

    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        var next = tabs[(index + 1) % tabs.length];
        next.focus();
        activate(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        var prev = tabs[(index - 1 + tabs.length) % tabs.length];
        prev.focus();
        activate(prev);
      }
    });
  });
})();
