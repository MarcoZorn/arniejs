(function () {
  var root = document.querySelector('.cs-card');
  if (!root) return;

  var swatch = root.querySelector('[data-swatch]');
  var native = root.querySelector('.cs-native');
  var hexInput = root.querySelector('.cs-hex');
  var error = root.querySelector('.cs-error');
  var presets = Array.prototype.slice.call(root.querySelectorAll('.cs-preset'));

  var hexPattern = /^#([0-9a-f]{6})$/i;

  function normalize(value) {
    value = value.trim();
    if (value[0] !== '#') value = '#' + value;
    return value;
  }

  function applyColor(hex, opts) {
    opts = opts || {};
    swatch.style.backgroundColor = hex;
    native.value = hex;
    if (!opts.skipInput) hexInput.value = hex.toUpperCase();
    error.textContent = '';
    hexInput.classList.remove('is-invalid');
    presets.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.color.toLowerCase() === hex.toLowerCase());
    });
  }

  hexInput.addEventListener('input', function () {
    var value = normalize(hexInput.value);
    if (hexPattern.test(value)) {
      applyColor(value, { skipInput: true });
    } else {
      hexInput.classList.add('is-invalid');
      error.textContent = value.length >= 4 ? 'Use a 6-digit hex code, like #C4622D.' : '';
    }
  });

  hexInput.addEventListener('blur', function () {
    var value = normalize(hexInput.value);
    if (hexPattern.test(value)) {
      hexInput.value = value.toUpperCase();
    }
  });

  native.addEventListener('input', function () {
    applyColor(native.value);
  });

  presets.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyColor(btn.dataset.color);
    });
  });

  applyColor('#c4622d');
})();
