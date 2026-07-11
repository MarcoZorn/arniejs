(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var overlay = document.getElementById('soilOverlay');
  var openBtn = document.getElementById('openOverlay');
  var closeBtn = document.getElementById('closeOverlay');

  function open() {
    overlay.classList.add('visible');
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    overlay.classList.remove('visible');
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  if (reduceMotion) {
    overlay.style.transition = 'none';
    overlay.querySelector('.modal').style.transition = 'none';
  }
})();
