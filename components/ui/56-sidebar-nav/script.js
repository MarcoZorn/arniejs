(function () {
  var sidebar = document.getElementById('sidebar');
  var collapseBtn = document.getElementById('collapseBtn');
  var navItems = document.querySelectorAll('[data-nav]');

  if (!sidebar || !collapseBtn) return;

  collapseBtn.addEventListener('click', function () {
    var collapsed = sidebar.classList.toggle('collapsed');
    collapseBtn.setAttribute('aria-expanded', String(!collapsed));
  });

  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      navItems.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
    });
  });
})();
