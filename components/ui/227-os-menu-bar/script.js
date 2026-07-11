(function () {
  var menubar = document.getElementById('menubar');
  var clock = document.getElementById('menubarClock');
  if (!menubar) return;

  var menus = Array.prototype.slice.call(menubar.querySelectorAll('.menu'));

  function closeAll(except) {
    menus.forEach(function (menu) {
      if (menu === except) return;
      menu.classList.remove('is-open');
      menu.querySelector('.menu__trigger').setAttribute('aria-expanded', 'false');
    });
  }

  menus.forEach(function (menu) {
    var trigger = menu.querySelector('.menu__trigger');

    trigger.addEventListener('click', function () {
      var isOpen = menu.classList.contains('is-open');
      closeAll();
      if (!isOpen) {
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    menu.addEventListener('mouseenter', function () {
      var anyOpen = menus.some(function (m) { return m.classList.contains('is-open'); });
      if (anyOpen && !menu.classList.contains('is-open')) {
        closeAll();
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    menu.querySelectorAll('.menu__item').forEach(function (item) {
      item.addEventListener('click', function () {
        closeAll();
      });
    });
  });

  document.addEventListener('click', function (e) {
    if (!menubar.contains(e.target)) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  if (clock) {
    function updateClock() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      var minStr = minutes < 10 ? '0' + minutes : String(minutes);
      clock.textContent = hours + ':' + minStr + ' ' + period;
    }
    updateClock();
    setInterval(updateClock, 30000);
  }
})();
