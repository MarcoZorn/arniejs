(function () {
  var colorInput = document.getElementById('cpg-color');
  var hexInput = document.getElementById('cpg-hex');
  var generateBtn = document.getElementById('cpg-generate');
  var tintsRow = document.getElementById('cpg-tints');
  var shadesRow = document.getElementById('cpg-shades');
  var complementRow = document.getElementById('cpg-complement');

  function isValidHex(hex) {
    return /^#[0-9a-fA-F]{6}$/.test(hex);
  }

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return { r: r, g: g, b: b };
  }

  function rgbToHex(r, g, b) {
    function toHex(n) {
      var clamped = Math.max(0, Math.min(255, Math.round(n)));
      var s = clamped.toString(16);
      return s.length === 1 ? '0' + s : s;
    }
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    s /= 100;
    l /= 100;
    var r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }

  function hslToHex(h, s, l) {
    var rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  function textColorFor(hex) {
    var rgb = hexToRgb(hex);
    var luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.55 ? '#1a1208' : '#f0e6d3';
  }

  function makeCard(hex, label) {
    var card = document.createElement('div');
    card.className = 'cpg-card';

    var swatch = document.createElement('div');
    swatch.className = 'cpg-card-swatch';
    swatch.style.background = hex;
    card.appendChild(swatch);

    var body = document.createElement('div');
    body.className = 'cpg-card-body';

    var hexLabel = document.createElement('div');
    hexLabel.className = 'cpg-card-hex';
    hexLabel.textContent = (label ? label + ' · ' : '') + hex.toUpperCase();
    body.appendChild(hexLabel);

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'cpg-copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function () {
      var finish = function () {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('is-copied');
        setTimeout(function () {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('is-copied');
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex.toUpperCase()).then(finish, finish);
      } else {
        finish();
      }
    });
    body.appendChild(copyBtn);

    card.appendChild(body);
    return card;
  }

  function generate(hex) {
    if (!isValidHex(hex)) return;

    var rgb = hexToRgb(hex);
    var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    tintsRow.innerHTML = '';
    shadesRow.innerHTML = '';
    complementRow.innerHTML = '';

    // Tints: mix toward white by raising lightness in steps.
    var tintSteps = [0.15, 0.3, 0.45, 0.6, 0.75];
    tintSteps.forEach(function (amount) {
      var l = hsl.l + (100 - hsl.l) * amount;
      var tintHex = hslToHex(hsl.h, hsl.s, l);
      tintsRow.appendChild(makeCard(tintHex));
    });

    // Shades: mix toward black by lowering lightness in steps.
    var shadeSteps = [0.15, 0.3, 0.45, 0.6, 0.75];
    shadeSteps.forEach(function (amount) {
      var l = hsl.l * (1 - amount);
      var shadeHex = hslToHex(hsl.h, hsl.s, l);
      shadesRow.appendChild(makeCard(shadeHex));
    });

    // Complement: rotate hue 180deg, plus two lightness variants of it.
    var compHue = hsl.h + 180;
    var compBase = hslToHex(compHue, hsl.s, hsl.l);
    var compLight = hslToHex(compHue, hsl.s, Math.min(90, hsl.l + 20));
    var compDark = hslToHex(compHue, hsl.s, Math.max(10, hsl.l - 20));
    complementRow.appendChild(makeCard(compBase, 'base'));
    complementRow.appendChild(makeCard(compLight, 'light'));
    complementRow.appendChild(makeCard(compDark, 'dark'));

    colorInput.value = hex;
    hexInput.value = hex.toUpperCase();
  }

  colorInput.addEventListener('input', function () {
    generate(colorInput.value);
  });

  hexInput.addEventListener('change', function () {
    var val = hexInput.value.trim();
    if (val[0] !== '#') val = '#' + val;
    if (isValidHex(val)) {
      generate(val);
    } else {
      hexInput.value = colorInput.value.toUpperCase();
    }
  });

  generateBtn.addEventListener('click', function () {
    generate(colorInput.value);
  });

  generate(colorInput.value);
})();
