(function () {
  var toggleBtn = document.getElementById('dbgToggle');
  var closeBtn = document.getElementById('dbgClose');
  var panel = document.getElementById('dbgPanel');
  var mouseEl = document.getElementById('dbgMouse');
  var windowEl = document.getElementById('dbgWindow');
  var scrollEl = document.getElementById('dbgScroll');

  var isOpen = false;

  function openPanel() {
    isOpen = true;
    panel.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    updateWindow();
    updateScroll();
  }

  function closePanel() {
    isOpen = false;
    panel.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', function () {
    if (isOpen) { closePanel(); } else { openPanel(); }
  });
  closeBtn.addEventListener('click', closePanel);

  function updateMouse(x, y) {
    mouseEl.textContent = Math.round(x) + ', ' + Math.round(y);
  }

  function updateWindow() {
    windowEl.textContent = window.innerWidth + ' × ' + window.innerHeight;
  }

  function updateScroll() {
    scrollEl.textContent = 'x: ' + Math.round(window.scrollX) + ', y: ' + Math.round(window.scrollY);
  }

  window.addEventListener('pointermove', function (e) {
    if (!isOpen) return;
    updateMouse(e.clientX, e.clientY);
  });

  window.addEventListener('resize', function () {
    if (!isOpen) return;
    updateWindow();
  });

  window.addEventListener('scroll', function () {
    if (!isOpen) return;
    updateScroll();
  }, { passive: true });
})();
