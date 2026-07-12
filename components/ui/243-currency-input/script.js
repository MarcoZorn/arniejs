(function () {
  var input = document.getElementById('cui-input');
  var rawOut = document.getElementById('cui-raw');
  if (!input) return;

  var MAX_DIGITS = 12;

  function digitsFromValue(value) {
    return value.replace(/[^\d]/g, '');
  }

  function formatFromDigits(digits) {
    digits = digits.replace(/^0+(?=\d)/, '');
    if (digits.length === 0) digits = '0';
    while (digits.length < 3) digits = '0' + digits;

    var cents = digits.slice(-2);
    var whole = digits.slice(0, -2).replace(/^0+(?=\d)/, '') || '0';

    var withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return { display: withCommas + '.' + cents, whole: whole, cents: cents };
  }

  function applyDigits(digits) {
    digits = digits.slice(0, MAX_DIGITS);
    var result = formatFromDigits(digits);
    input.value = result.display;
    var rawValue = (result.whole + '.' + result.cents);
    input.setAttribute('data-raw', rawValue);
    rawOut.textContent = rawValue;
    // caret always at end — natural for a right-growing amount field
    requestAnimationFrame(function () {
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }

  input.addEventListener('input', function () {
    var digits = digitsFromValue(input.value);
    applyDigits(digits);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      var current = digitsFromValue(input.value).replace(/^0+(?=\d)/, '');
      current = current.slice(0, -1);
      applyDigits(current);
    } else if (e.key === 'Delete') {
      e.preventDefault();
    } else if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      var digitsNow = digitsFromValue(input.value).replace(/^0+(?=\d)/, '');
      applyDigits(digitsNow + e.key);
    } else if (
      e.key.length === 1 &&
      !e.ctrlKey && !e.metaKey && !e.altKey
    ) {
      // block any other printable character (letters, symbols, extra dots)
      e.preventDefault();
    }
  });

  input.addEventListener('paste', function (e) {
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData('text');
    var digits = digitsFromValue(text);
    applyDigits(digits);
  });

  input.addEventListener('focus', function () {
    requestAnimationFrame(function () {
      input.setSelectionRange(input.value.length, input.value.length);
    });
  });

  // initialize display from starting value
  applyDigits(digitsFromValue(input.value));
})();
