(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var banner = document.getElementById('csb-banner');
  if (!banner) return;

  var hoursEl = document.getElementById('csb-hours');
  var minutesEl = document.getElementById('csb-minutes');
  var secondsEl = document.getElementById('csb-seconds');
  var headline = banner.querySelector('.csb-headline');
  var copy = banner.querySelector('.csb-copy');
  var tag = banner.querySelector('.csb-tag');
  var cta = banner.querySelector('.csb-cta');

  // Sale ends a few hours from when the page loads.
  var endTime = Date.now() + (3 * 60 * 60 * 1000) + (17 * 60 * 1000) + (42 * 1000);
  var intervalId = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function render() {
    var remaining = endTime - Date.now();

    if (remaining <= 0) {
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      banner.classList.remove('is-urgent');
      banner.classList.add('is-ended');
      tag.textContent = 'Sale ended';
      headline.textContent = 'This sale has ended';
      copy.textContent = 'The clearance batch has sold through, but new discounts land regularly — check back soon.';
      cta.textContent = 'Browse full price catalog';
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
      return;
    }

    var totalSeconds = Math.floor(remaining / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);

    var isUrgent = remaining <= 5 * 60 * 1000;
    banner.classList.toggle('is-urgent', isUrgent && !reduceMotion);
  }

  cta.addEventListener('click', function () {
    if (banner.classList.contains('is-ended')) return;
    cta.textContent = 'Added to your cart';
    window.setTimeout(function () {
      if (!banner.classList.contains('is-ended')) {
        cta.textContent = 'Shop the sale';
      }
    }, 2200);
  });

  render();
  intervalId = window.setInterval(render, 1000);
})();
