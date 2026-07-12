(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.buc-card');
  if (!card) return;

  var checks = Array.prototype.slice.call(card.querySelectorAll('.buc-check'));
  var totalEl = document.getElementById('buc-total');
  var countEl = document.getElementById('buc-count');
  var cta = card.querySelector('.buc-cta');
  var confirm = card.querySelector('.buc-confirm');
  var confirmTimer = null;

  function recalc() {
    var total = 0;
    var count = 0;
    checks.forEach(function (input) {
      if (input.checked) {
        total += Number(input.getAttribute('data-price')) || 0;
        count += 1;
      }
    });
    totalEl.textContent = total;
    countEl.textContent = count;
  }

  checks.forEach(function (input) {
    input.addEventListener('change', recalc);
  });

  cta.addEventListener('click', function () {
    var names = checks.filter(function (input) { return input.checked; })
      .map(function (input) { return input.getAttribute('data-name'); });

    confirm.textContent = 'Added ' + names.length + ' item' + (names.length === 1 ? '' : 's') + ' to your cart.';
    window.clearTimeout(confirmTimer);
    confirmTimer = window.setTimeout(function () {
      confirm.textContent = '';
    }, 3500);

    if (reduceMotion) return;

    cta.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.97)' },
        { transform: 'scale(1)' }
      ],
      { duration: 200, easing: 'ease-out' }
    );
  });

  recalc();
})();
