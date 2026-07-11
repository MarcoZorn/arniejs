(function () {
  var picker = document.getElementById('swatchPicker');
  var label = document.getElementById('selectedLabel');

  if (!picker || !label) return;

  var swatches = Array.prototype.slice.call(picker.querySelectorAll('.swatch'));

  function selectSwatch(swatch) {
    swatches.forEach(function (s) {
      var isTarget = s === swatch;
      s.classList.toggle('is-selected', isTarget);
      s.setAttribute('aria-checked', isTarget ? 'true' : 'false');
    });
    label.textContent = swatch.getAttribute('data-name');
  }

  swatches.forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      selectSwatch(swatch);
    });
  });

  picker.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var current = picker.querySelector('.is-selected');
    var idx = swatches.indexOf(current);
    if (idx === -1) return;
    var nextIdx = e.key === 'ArrowRight'
      ? (idx + 1) % swatches.length
      : (idx - 1 + swatches.length) % swatches.length;
    selectSwatch(swatches[nextIdx]);
    swatches[nextIdx].focus();
    e.preventDefault();
  });
})();
