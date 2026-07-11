(function () {
  var map = document.querySelector('.map');
  var initialPin = document.querySelector('.pin--initial');
  if (!map) return;

  function dropPinAt(xPercent, yPercent) {
    var existing = map.querySelectorAll('.pin');
    existing.forEach(function (p) { p.remove(); });

    var pin = document.createElement('div');
    pin.className = 'pin is-dropping';
    pin.style.left = xPercent + '%';
    pin.style.top = yPercent + '%';
    pin.innerHTML = '<span class="pin__body"></span><span class="pin__shadow"></span>';
    map.appendChild(pin);
  }

  map.addEventListener('click', function (e) {
    var rect = map.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.min(96, Math.max(4, x));
    y = Math.min(96, Math.max(8, y));
    dropPinAt(x, y);
  });

  map.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      dropPinAt(50, 50);
    }
  });

  if (initialPin) {
    initialPin.classList.add('is-dropping');
  }
})();
