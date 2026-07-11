(function () {
  var btn = document.getElementById('geoBtn');
  var label = document.getElementById('geoBtnLabel');
  var result = document.getElementById('geoResult');

  if (!btn || !label || !result) return;

  var defaultLabel = label.textContent;

  function setResult(text, isError) {
    result.textContent = text;
    result.classList.toggle('is-error', !!isError);
  }

  btn.addEventListener('click', function () {
    if (!('geolocation' in navigator)) {
      setResult('Geolocation is not supported in this browser.', true);
      return;
    }

    btn.disabled = true;
    btn.classList.add('is-locating');
    label.textContent = 'Locating…';
    setResult('');

    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat = position.coords.latitude.toFixed(5);
        var lon = position.coords.longitude.toFixed(5);
        var accuracy = Math.round(position.coords.accuracy);
        result.innerHTML =
          'Lat <strong>' + lat + '</strong>, Lon <strong>' + lon + '</strong>' +
          ' (&plusmn;' + accuracy + 'm)';
        result.classList.remove('is-error');
        reset();
      },
      function (error) {
        var messages = {
          1: 'Permission denied. Enable location access to try again.',
          2: 'Position unavailable. Try again in a moment.',
          3: 'Request timed out. Try again.'
        };
        setResult(messages[error.code] || 'Unable to retrieve your location.', true);
        reset();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    function reset() {
      btn.disabled = false;
      btn.classList.remove('is-locating');
      label.textContent = defaultLabel;
    }
  });
})();
