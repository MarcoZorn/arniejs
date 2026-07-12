(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nav = document.getElementById('sideNav');
  var toggle = document.getElementById('sideToggle');
  if (!nav || !toggle) return;

  var STORAGE_KEY = 'arniejs-sidebar-collapsed';

  function setCollapsed(collapsed) {
    nav.dataset.collapsed = collapsed ? 'true' : 'false';
    toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    var label = toggle.querySelector('.side-toggle-label');
    if (label) label.textContent = collapsed ? 'Expand' : 'Collapse';
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch (e) {
      /* storage unavailable, ignore */
    }
  }

  toggle.addEventListener('click', function () {
    var isCollapsed = nav.dataset.collapsed === 'true';
    setCollapsed(!isCollapsed);
  });

  // Restore prior preference if available.
  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === '1') setCollapsed(true);
  } catch (e) {
    /* storage unavailable, ignore */
  }
})();
