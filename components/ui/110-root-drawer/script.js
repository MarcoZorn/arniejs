(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var openBtn = document.getElementById('openDrawer');
  var closeBtn = document.getElementById('drawerClose');
  var drawer = document.getElementById('drawer');
  var backdrop = document.getElementById('drawerBackdrop');

  function open() {
    drawer.classList.add('open');
    backdrop.classList.add('visible');
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  if (reduceMotion) {
    drawer.style.transition = 'none';
    backdrop.style.transition = 'none';
  }
})();
