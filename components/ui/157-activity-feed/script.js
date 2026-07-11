(function () {
  var feed = document.getElementById('activityFeed');
  var liveBtn = document.getElementById('liveBtn');
  if (!feed || !liveBtn) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var newEvents = [
    { initials: 'RV', tone: 'terra', html: '<strong>Ravi Voss</strong> merged <span class="activity-feed__target">feature/onboarding</span>' },
    { initials: 'NL', tone: 'sage',  html: '<strong>Nia Lund</strong> starred <span class="activity-feed__target">arnie-js/components</span>' },
    { initials: 'EG', tone: 'clay',  html: '<strong>Eli Grant</strong> rotated the <span class="activity-feed__target">API key</span>' },
    { initials: 'TW', tone: 'moss',  html: '<strong>Tessa Wren</strong> updated <span class="activity-feed__target">billing details</span>' }
  ];
  var eventIndex = 0;

  function relativeTime(seconds) {
    var abs = Math.abs(seconds);
    if (abs < 60) return 'just now';
    if (abs < 3600) return Math.round(abs / 60) + 'm ago';
    if (abs < 86400) return Math.round(abs / 3600) + 'h ago';
    return Math.round(abs / 86400) + 'd ago';
  }

  function tickTimes() {
    var items = feed.querySelectorAll('.activity-feed__item[data-timestamp]');
    items.forEach(function (item) {
      var base = parseInt(item.getAttribute('data-timestamp'), 10) || 0;
      var elapsedSinceLoad = Math.round((Date.now() - startTime) / 1000);
      var timeEl = item.querySelector('.activity-feed__time');
      if (timeEl) timeEl.textContent = relativeTime(base - elapsedSinceLoad);
    });
  }

  var startTime = Date.now();
  tickTimes();
  setInterval(tickTimes, 30000);

  liveBtn.addEventListener('click', function () {
    var ev = newEvents[eventIndex % newEvents.length];
    eventIndex++;

    var item = document.createElement('div');
    item.className = 'activity-feed__item';
    item.setAttribute('data-timestamp', '0');
    item.innerHTML =
      '<span class="activity-feed__avatar" data-tone="' + ev.tone + '">' + ev.initials + '</span>' +
      '<div class="activity-feed__body">' +
        '<p class="activity-feed__text">' + ev.html + '</p>' +
        '<time class="activity-feed__time">just now</time>' +
      '</div>';

    feed.insertBefore(item, feed.firstChild);

    if (!reduceMotion) {
      item.classList.add('is-new');
    }

    // Reset timestamp baseline for the fresh item relative to now.
    item.setAttribute('data-timestamp', Math.round((Date.now() - startTime) / 1000) * -1);
  });
})();
