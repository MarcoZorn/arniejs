(function () {
  var map = document.getElementById('map');
  var pin = map ? map.querySelector('.map__pin') : null;
  var openMaps = document.getElementById('openMaps');

  if (!map || !pin || !openMaps) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  map.addEventListener('mouseenter', function () {
    if (reduceMotion) return;
    pin.style.animation = 'none';
    void pin.offsetWidth;
    pin.style.animation = '';
  });

  openMaps.addEventListener('click', function () {
    openMaps.classList.add('is-visited');
  });
})();
