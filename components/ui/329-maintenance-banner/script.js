(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var banner = document.getElementById('maint-banner');
  var dismissBtn = document.getElementById('maint-dismiss-btn');
  var nums = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };
  if (!banner) return;

  // Target: a few hours from now.
  var target = new Date(Date.now() + (3 * 60 * 60 * 1000) + (24 * 60 * 1000) + (37 * 1000));

  var timer = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    var diff = target.getTime() - Date.now();

    if (diff <= 0) {
      nums.days.textContent = '00';
      nums.hours.textContent = '00';
      nums.minutes.textContent = '00';
      nums.seconds.textContent = '00';
      window.clearInterval(timer);
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    nums.days.textContent = pad(days);
    nums.hours.textContent = pad(hours);
    nums.minutes.textContent = pad(minutes);
    nums.seconds.textContent = pad(seconds);
  }

  tick();
  timer = window.setInterval(tick, 1000);

  if (dismissBtn) {
    dismissBtn.addEventListener('click', function () {
      window.clearInterval(timer);

      if (reduceMotion) {
        banner.style.display = 'none';
        return;
      }

      banner.classList.add('is-dismissed');
      banner.addEventListener('animationend', function () {
        banner.style.display = 'none';
      }, { once: true });
    });
  }
})();
