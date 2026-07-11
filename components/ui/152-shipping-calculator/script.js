(function () {
  var card = document.querySelector('.sc-card');
  if (!card) return;

  var form = card.querySelector('.sc-form');
  var input = card.querySelector('.sc-input');
  var errorEl = card.querySelector('.sc-error');
  var resultEl = card.querySelector('.sc-result');
  var costEl = card.querySelector('.sc-cost');
  var dateEl = card.querySelector('.sc-date');

  var DAY_MS = 24 * 60 * 60 * 1000;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function digitSum(str) {
    var sum = 0;
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      sum += code >= 48 && code <= 57 ? code - 48 : (code % 9) + 1;
    }
    return sum;
  }

  function formatDate(date) {
    return MONTHS[date.getMonth()] + ' ' + date.getDate();
  }

  function calculate(zip) {
    var clean = zip.trim();
    var seed = digitSum(clean);
    var minDays = 3 + (seed % 4);
    var maxDays = minDays + 2 + (seed % 3);
    var cost = (4.5 + (seed % 12) * 0.85).toFixed(2);

    var now = new Date();
    var start = new Date(now.getTime() + minDays * DAY_MS);
    var end = new Date(now.getTime() + maxDays * DAY_MS);

    return {
      cost: cost,
      range: formatDate(start) + ' – ' + formatDate(end)
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = input.value.trim();
    var valid = value.length >= 3 && value.length <= 8;

    if (!valid) {
      input.classList.add('is-invalid');
      errorEl.hidden = false;
      resultEl.hidden = true;
      return;
    }

    input.classList.remove('is-invalid');
    errorEl.hidden = true;

    var estimate = calculate(value);
    costEl.textContent = '$' + estimate.cost;
    dateEl.textContent = estimate.range;
    resultEl.hidden = false;
  });

  input.addEventListener('input', function () {
    if (input.classList.contains('is-invalid')) {
      input.classList.remove('is-invalid');
      errorEl.hidden = true;
    }
  });
})();
