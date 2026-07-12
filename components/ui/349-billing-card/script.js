(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var upgradeBtn = document.querySelector('[data-upgrade-toggle]');
  var picker = document.querySelector('[data-picker]');
  var radios = Array.prototype.slice.call(document.querySelectorAll('[data-plan-radio]'));
  var confirmBtn = document.querySelector('[data-confirm]');
  var cancelBtn = document.querySelector('[data-cancel-picker]');
  var statusEl = document.querySelector('[data-status]');
  var planNameEl = document.querySelector('.bic-plan-name');
  var planPriceEl = document.querySelector('.bic-plan-price');

  if (!upgradeBtn || !picker) return;

  var statusTimer = null;
  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    window.clearTimeout(statusTimer);
    if (msg) {
      statusTimer = window.setTimeout(function () { statusEl.textContent = ''; }, 4000);
    }
  }

  upgradeBtn.addEventListener('click', function () {
    var isHidden = picker.hidden;
    picker.hidden = !isHidden;
    upgradeBtn.textContent = isHidden ? 'Hide plan options' : 'Upgrade plan';
    if (isHidden && !reduceMotion) {
      picker.animate(
        [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 200, easing: 'ease-out' }
      );
    }
  });

  cancelBtn.addEventListener('click', function () {
    picker.hidden = true;
    upgradeBtn.textContent = 'Upgrade plan';
    radios.forEach(function (r) { r.checked = false; });
    confirmBtn.disabled = true;
    setStatus('');
  });

  radios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      confirmBtn.disabled = !radios.some(function (r) { return r.checked; });
    });
  });

  confirmBtn.addEventListener('click', function () {
    var chosen = radios.filter(function (r) { return r.checked; })[0];
    if (!chosen) return;

    planNameEl.textContent = chosen.value + ' plan';
    var priceText = chosen.value.indexOf('Annual') !== -1 ? '$470<small>/yr</small>' : '$49<small>/mo</small>';
    planPriceEl.innerHTML = priceText;

    picker.hidden = true;
    upgradeBtn.textContent = 'Upgrade plan';
    radios.forEach(function (r) { r.checked = false; });
    confirmBtn.disabled = true;

    setStatus('Switched to the ' + chosen.value + ' plan');

    if (!reduceMotion) {
      document.querySelector('.bic-current').animate(
        [{ backgroundColor: 'rgba(212,168,90,0.25)' }, { backgroundColor: '' }],
        { duration: 600, easing: 'ease-out' }
      );
    }
  });
})();
