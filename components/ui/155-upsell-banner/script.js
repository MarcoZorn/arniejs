(function () {
  var banner = document.querySelector('.ub-banner');
  var stage = document.querySelector('.ub-demo-stage');
  if (!banner || !stage) return;

  var threshold = parseFloat(banner.dataset.threshold) || 60;
  var track = banner.querySelector('.ub-track');
  var fill = banner.querySelector('.ub-fill');
  var remainingEl = banner.querySelector('.ub-remaining');
  var msgEl = banner.querySelector('.ub-banner-msg');
  var totalEl = stage.querySelector('.ub-cart-total');

  var total = 26;

  function render() {
    var pct = Math.min(100, (total / threshold) * 100);
    fill.style.width = pct + '%';
    track.setAttribute('aria-valuenow', Math.min(total, threshold).toFixed(2));
    totalEl.textContent = '$' + total.toFixed(2);

    if (total >= threshold) {
      banner.classList.add('is-complete');
      banner.classList.remove('is-hidden');
      msgEl.innerHTML = '<strong>You’ve unlocked free shipping! 🎉</strong>';
    } else {
      banner.classList.remove('is-complete');
      var remaining = threshold - total;
      remainingEl.textContent = '$' + remaining.toFixed(2);
      msgEl.innerHTML = 'Add <strong class="ub-remaining">$' + remaining.toFixed(2) + '</strong> more for <strong>free shipping</strong>';
    }
  }

  stage.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      total += parseFloat(btn.dataset.add);
      render();
    });
  });

  var resetBtn = stage.querySelector('[data-reset]');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      total = 26;
      render();
    });
  }

  render();
})();
