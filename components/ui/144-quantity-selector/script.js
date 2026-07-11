(function () {
  var selector = document.getElementById('qtySelector');
  var decBtn = document.getElementById('qtyDec');
  var incBtn = document.getElementById('qtyInc');
  var valueEl = document.getElementById('qtyValue');

  if (!selector || !decBtn || !incBtn || !valueEl) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var min = parseInt(selector.getAttribute('data-min'), 10) || 1;
  var max = parseInt(selector.getAttribute('data-max'), 10) || 99;
  var value = parseInt(valueEl.textContent, 10) || min;

  function bump() {
    if (reduceMotion) return;
    valueEl.classList.remove('is-bump');
    void valueEl.offsetWidth;
    valueEl.classList.add('is-bump');
  }

  function render() {
    valueEl.textContent = value;
    decBtn.disabled = value <= min;
    incBtn.disabled = value >= max;
  }

  decBtn.addEventListener('click', function () {
    if (value <= min) return;
    value -= 1;
    render();
    bump();
  });

  incBtn.addEventListener('click', function () {
    if (value >= max) return;
    value += 1;
    render();
    bump();
  });

  render();
})();
