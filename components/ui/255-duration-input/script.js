(function () {
  var panel = document.querySelector('.dur-panel');
  if (!panel) return;

  var summary = panel.querySelector('.dur-summary');

  var LIMITS = {
    hours: { min: 0, max: 99 },
    minutes: { min: 0, max: 59 },
    seconds: { min: 0, max: 59 }
  };

  var UNIT_ORDER = ['hours', 'minutes', 'seconds'];

  function getInput(unit) {
    return panel.querySelector('.dur-value[data-unit="' + unit + '"]');
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function getValue(unit) {
    var input = getInput(unit);
    var n = parseInt(input.value, 10);
    return isNaN(n) ? 0 : n;
  }

  function setValue(unit, value) {
    var limits = LIMITS[unit];
    var clamped = Math.max(limits.min, Math.min(limits.max, value));
    getInput(unit).value = pad(clamped);
    updateSummary();
  }

  function updateSummary() {
    var h = getValue('hours');
    var m = getValue('minutes');
    var s = getValue('seconds');
    var parts = [];
    if (h > 0) parts.push(h + 'h');
    parts.push(pad(m) + 'm');
    parts.push(pad(s) + 's');
    summary.textContent = 'Total: ' + parts.join(' ');
  }

  function focusNext(unit) {
    var idx = UNIT_ORDER.indexOf(unit);
    var nextUnit = UNIT_ORDER[idx + 1];
    if (nextUnit) {
      var el = getInput(nextUnit);
      el.focus();
      el.select();
    }
  }

  // Stepper buttons.
  Array.prototype.forEach.call(panel.querySelectorAll('.dur-step'), function (btn) {
    btn.addEventListener('click', function () {
      var unit = btn.getAttribute('data-unit');
      var dir = parseInt(btn.getAttribute('data-dir'), 10);
      setValue(unit, getValue(unit) + dir);
    });
  });

  // Segmented text inputs: typing, arrow keys, auto-advance.
  UNIT_ORDER.forEach(function (unit) {
    var input = getInput(unit);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setValue(unit, getValue(unit) + 1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setValue(unit, getValue(unit) - 1);
      } else if (e.key === ':' || e.key === ' ') {
        e.preventDefault();
        focusNext(unit);
      }
    });

    input.addEventListener('input', function () {
      var digits = input.value.replace(/[^0-9]/g, '').slice(0, 2);
      input.value = digits;

      if (digits.length >= 2) {
        setValue(unit, parseInt(digits, 10));
        focusNext(unit);
      } else {
        updateSummary();
      }
    });

    input.addEventListener('blur', function () {
      setValue(unit, getValue(unit));
    });

    input.addEventListener('focus', function () {
      input.select();
    });

    input.addEventListener('wheel', function (e) {
      e.preventDefault();
      setValue(unit, getValue(unit) + (e.deltaY < 0 ? 1 : -1));
    }, { passive: false });
  });

  updateSummary();
})();
