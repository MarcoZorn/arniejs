(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.status-card');
  var badge = document.getElementById('statusBadge');
  var badgeText = badge ? badge.querySelector('.status-badge-text') : null;
  var services = document.getElementById('statusServices');
  var tooltip = document.getElementById('statusTooltip');

  if (!card || !services || !tooltip) return;

  var BAR_COUNT = 30;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Seeded-ish pseudo-random per row so results are stable across a page view
  // but different per service, with a few "down" bars mixed in for realism.
  function buildHistory(seed) {
    var history = [];
    var rand = seed;
    function next() {
      rand = (rand * 9301 + 49297) % 233280;
      return rand / 233280;
    }
    for (var i = 0; i < BAR_COUNT; i++) {
      var down = next() < 0.08;
      history.push(down ? 'down' : 'up');
    }
    return history;
  }

  var today = new Date();

  function dateForIndex(index) {
    // index 0 = oldest (BAR_COUNT-1 days ago), last index = today
    var daysAgo = BAR_COUNT - 1 - index;
    var d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d;
  }

  function formatDate(d) {
    return MONTHS[d.getMonth()] + ' ' + d.getDate();
  }

  var seeds = [17, 42, 5];
  var rows = Array.prototype.slice.call(services.querySelectorAll('.status-row'));
  var anyDown = false;

  rows.forEach(function (row, rowIndex) {
    var strip = row.querySelector('[data-strip]');
    var serviceName = row.getAttribute('data-service') || 'Service';
    var history = buildHistory(seeds[rowIndex % seeds.length] || 7);

    history.forEach(function (status, i) {
      if (status === 'down') anyDown = true;

      var bar = document.createElement('div');
      bar.className = 'status-bar' + (status === 'down' ? ' is-down' : '');
      bar.setAttribute('tabindex', '0');
      bar.setAttribute('role', 'button');
      var d = dateForIndex(i);
      var label = serviceName + ' — ' + formatDate(d) + ': ' + (status === 'down' ? 'Outage' : 'Operational');
      bar.setAttribute('aria-label', label);
      bar.dataset.date = formatDate(d);
      bar.dataset.status = status;
      bar.dataset.service = serviceName;

      function showTooltip() {
        tooltip.innerHTML = '<strong>' + bar.dataset.service + '</strong> — ' + bar.dataset.date + ': ' +
          (bar.dataset.status === 'down' ? 'Outage detected' : 'Operational');
        tooltip.hidden = false;
      }

      function hideTooltip() {
        tooltip.hidden = true;
      }

      bar.addEventListener('mouseenter', showTooltip);
      bar.addEventListener('mouseleave', hideTooltip);
      bar.addEventListener('focus', showTooltip);
      bar.addEventListener('blur', hideTooltip);
      bar.addEventListener('click', function () {
        if (!tooltip.hidden && tooltip.dataset.activeBar === String(rowIndex) + '-' + i) {
          hideTooltip();
          tooltip.dataset.activeBar = '';
        } else {
          showTooltip();
          tooltip.dataset.activeBar = String(rowIndex) + '-' + i;
        }
      });

      strip.appendChild(bar);
    });
  });

  if (anyDown && badge && badgeText) {
    // Keep overall badge "operational" unless there's a recent (last 3 days) outage
    // across any service — otherwise treat as historical/resolved.
    var recentDown = rows.some(function (row) {
      var bars = Array.prototype.slice.call(row.querySelectorAll('.status-bar'));
      var lastThree = bars.slice(-3);
      return lastThree.some(function (b) { return b.dataset.status === 'down'; });
    });

    if (recentDown) {
      badge.classList.add('is-degraded');
      badgeText.textContent = 'Degraded performance';
    }
  }
})();
