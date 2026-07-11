(function () {
  var menus = document.querySelectorAll('.member-row__menu');

  function closeAll(except) {
    menus.forEach(function (menu) {
      if (menu === except) return;
      menu.classList.remove('is-open');
      var btn = menu.querySelector('.member-row__kebab');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  menus.forEach(function (menu) {
    var btn = menu.querySelector('.member-row__kebab');
    var dropdown = menu.querySelector('.member-row__dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !menu.classList.contains('is-open');
      closeAll();
      menu.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      if (willOpen) {
        var firstItem = dropdown.querySelector('button');
        if (firstItem) firstItem.focus();
      }
    });

    dropdown.addEventListener('click', function (e) {
      var item = e.target.closest('button');
      if (!item) return;
      closeAll();
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    });

    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAll();
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  });

  document.addEventListener('click', function () {
    closeAll();
  });
})();
