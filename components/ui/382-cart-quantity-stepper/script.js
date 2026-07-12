(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stepper = document.querySelector('.step-stepper');
  if (!stepper) return;

  var min = parseInt(stepper.getAttribute('data-min'), 10) || 1;
  var max = parseInt(stepper.getAttribute('data-max'), 10) || 1;
  var decBtn = stepper.querySelector('[data-step-dec]');
  var incBtn = stepper.querySelector('[data-step-inc]');
  var input = stepper.querySelector('[data-step-input]');
  var stockMsg = document.querySelector('[data-stock-msg]');
  var totalEl = document.querySelector('[data-total]');
  var unitPrice = 6.5;

  var qty = clamp(parseInt(input.value, 10) || min, min, max);

  function clamp(value, lo, hi) {
    if (isNaN(value)) return lo;
    return Math.min(hi, Math.max(lo, value));
  }

  function render() {
    input.value = String(qty);
    decBtn.disabled = qty <= min;
    incBtn.disabled = qty >= max;

    var remaining = max - qty;
    if (stockMsg) {
      if (qty >= max) {
        stockMsg.textContent = 'That is all we have — ' + max + ' in stock.';
      } else if (remaining <= 2) {
        stockMsg.textContent = 'Only ' + remaining + ' more available after this order.';
      } else {
        stockMsg.textContent = remaining + ' left in stock after this order.';
      }
      stockMsg.classList.toggle('is-low', remaining <= 2);
    }

    if (totalEl) {
      totalEl.textContent = '$' + (qty * unitPrice).toFixed(2);
    }
  }

  function bump(el) {
    if (reduceMotion || !el) return;
    el.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.94)' },
        { transform: 'scale(1)' }
      ],
      { duration: 160, easing: 'ease-out' }
    );
  }

  decBtn.addEventListener('click', function () {
    if (qty <= min) return;
    qty -= 1;
    render();
    bump(decBtn);
  });

  incBtn.addEventListener('click', function () {
    if (qty >= max) return;
    qty += 1;
    render();
    bump(incBtn);
  });

  input.addEventListener('change', function () {
    var parsed = parseInt(input.value, 10);
    qty = clamp(parsed, min, max);
    render();
  });

  input.addEventListener('blur', function () {
    var parsed = parseInt(input.value, 10);
    qty = clamp(parsed, min, max);
    render();
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      input.blur();
    }
  });

  render();
})();
