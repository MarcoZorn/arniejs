(function () {
  var valueInput = document.getElementById('unc-value');
  var fromSelect = document.getElementById('unc-from');
  var toSelect = document.getElementById('unc-to');
  var swapBtn = document.getElementById('unc-swap');
  var resultEl = document.getElementById('unc-result');

  // Meters-per-unit factors: multiply a quantity by its factor to get meters.
  var units = [
    { id: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
    { id: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
    { id: 'm', label: 'Meters (m)', factor: 1 },
    { id: 'km', label: 'Kilometers (km)', factor: 1000 },
    { id: 'in', label: 'Inches (in)', factor: 0.0254 },
    { id: 'ft', label: 'Feet (ft)', factor: 0.3048 },
    { id: 'yd', label: 'Yards (yd)', factor: 0.9144 },
    { id: 'mi', label: 'Miles (mi)', factor: 1609.344 }
  ];

  function populateSelect(select, defaultId) {
    units.forEach(function (u) {
      var opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = u.label;
      if (u.id === defaultId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  populateSelect(fromSelect, 'm');
  populateSelect(toSelect, 'ft');

  function unitById(id) {
    for (var i = 0; i < units.length; i++) {
      if (units[i].id === id) return units[i];
    }
    return units[0];
  }

  function formatNumber(n) {
    if (!isFinite(n)) return '—';
    var abs = Math.abs(n);
    var fixed;
    if (abs !== 0 && (abs < 0.0001 || abs >= 1e9)) {
      fixed = n.toExponential(4);
    } else {
      fixed = n.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
      if (fixed === '' || fixed === '-') fixed = '0';
    }
    return fixed;
  }

  function convert() {
    var raw = valueInput.value;
    var value = parseFloat(raw);
    var fromUnit = unitById(fromSelect.value);
    var toUnit = unitById(toSelect.value);

    if (raw === '' || isNaN(value)) {
      resultEl.innerHTML = '<span>Enter a value</span><small>Waiting for a number to convert.</small>';
      return;
    }

    var meters = value * fromUnit.factor;
    var converted = meters / toUnit.factor;

    resultEl.innerHTML = formatNumber(converted) + ' ' + toUnit.id +
      '<small>' + formatNumber(value) + ' ' + fromUnit.id + ' = ' + formatNumber(converted) + ' ' + toUnit.id + '</small>';
  }

  swapBtn.addEventListener('click', function () {
    var fromVal = fromSelect.value;
    var toVal = toSelect.value;
    fromSelect.value = toVal;
    toSelect.value = fromVal;
    convert();
  });

  valueInput.addEventListener('input', convert);
  fromSelect.addEventListener('change', convert);
  toSelect.addEventListener('change', convert);

  convert();
})();
