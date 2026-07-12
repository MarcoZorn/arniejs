(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var COOLDOWN_SECONDS = 30;

  var resendBtn = document.querySelector('[data-resend]');
  var dismissBtn = document.querySelector('[data-dismiss]');
  var banner = document.querySelector('[data-banner]');

  var timer = null;
  var remaining = 0;

  function tick() {
    remaining -= 1;
    if (remaining <= 0) {
      window.clearInterval(timer);
      timer = null;
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend email';
      return;
    }
    resendBtn.textContent = 'Resend in ' + remaining + 's';
  }

  if (resendBtn) {
    resendBtn.addEventListener('click', function () {
      if (resendBtn.disabled) return;

      resendBtn.disabled = true;
      remaining = COOLDOWN_SECONDS;
      resendBtn.textContent = 'Sending…';

      window.setTimeout(function () {
        if (!resendBtn.disabled) return;
        resendBtn.textContent = 'Resend in ' + remaining + 's';
        timer = window.setInterval(tick, 1000);
      }, reduceMotion ? 0 : 500);
    });
  }

  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', function () {
      banner.classList.add('is-dismissed');
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    });
  }
})();
