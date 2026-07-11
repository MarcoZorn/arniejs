(function () {
  var card = document.querySelector('.cp-card');
  if (!card) return;

  var form = card.querySelector('.cp-form');
  var input = card.querySelector('.cp-input');
  var successEl = card.querySelector('.cp-message-success');
  var errorEl = card.querySelector('.cp-message-error');
  var discountAmountEl = card.querySelector('.cp-discount-amount');

  var CODES = {
    SAVE15: '15%',
    WELCOME10: '10%'
  };

  function reset() {
    card.classList.remove('is-success', 'is-error');
    successEl.hidden = true;
    errorEl.hidden = true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = input.value.trim().toUpperCase();
    reset();

    if (CODES[code]) {
      card.classList.add('is-success');
      discountAmountEl.textContent = CODES[code];
      successEl.hidden = false;
    } else {
      card.classList.add('is-error');
      errorEl.hidden = false;
    }
  });

  input.addEventListener('input', function () {
    if (card.classList.contains('is-success') || card.classList.contains('is-error')) {
      reset();
    }
  });
})();
