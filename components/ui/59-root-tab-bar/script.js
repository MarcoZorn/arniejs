(function () {
  var tabBar = document.getElementById('tabBar');
  var indicator = document.getElementById('tabIndicator');
  if (!tabBar || !indicator) return;

  var tabs = Array.prototype.slice.call(tabBar.querySelectorAll('.tab-item'));

  function moveIndicator(target, instant) {
    var barRect = tabBar.getBoundingClientRect();
    var rect = target.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2 - barRect.left - indicator.offsetWidth / 2;
    if (instant) indicator.style.transition = 'none';
    indicator.style.left = centerX + 'px';
    if (instant) {
      indicator.offsetHeight; // reflow
      indicator.style.transition = '';
    }
  }

  function setActive(tab) {
    tabs.forEach(function (t) {
      t.classList.remove('active');
      t.removeAttribute('aria-current');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-current', 'page');
    moveIndicator(tab, false);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      setActive(tab);
    });
  });

  var initial = tabBar.querySelector('.tab-item.active') || tabs[0];
  if (initial) {
    // position without transition on load
    requestAnimationFrame(function () {
      moveIndicator(initial, true);
    });
  }

  window.addEventListener('resize', function () {
    var active = tabBar.querySelector('.tab-item.active');
    if (active) moveIndicator(active, true);
  });
})();
