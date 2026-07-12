(function () {
  var form = document.getElementById('whtForm');
  var urlInput = document.getElementById('whtUrl');
  var submitBtn = form.querySelector('.wht-submit');
  var logEl = document.getElementById('whtLog');
  var emptyEl = document.getElementById('whtLogEmpty');

  var STATUS_POOL = [200, 200, 201, 204, 404, 500];
  var log = [];

  function truncateUrl(url, max) {
    if (url.length <= max) return url;
    return url.slice(0, max - 1) + '…';
  }

  function statusClass(status) {
    if (status >= 500) return 'wht-log-status--5xx';
    if (status >= 400) return 'wht-log-status--4xx';
    return 'wht-log-status--2xx';
  }

  function formatTime(date) {
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function render() {
    if (log.length === 0) {
      logEl.innerHTML = '';
      logEl.appendChild(emptyEl);
      return;
    }
    logEl.innerHTML = '';
    log.forEach(function (entry) {
      var li = document.createElement('li');
      li.className = 'wht-log-item';
      li.innerHTML =
        '<span class="wht-log-time">' + entry.time + '</span>' +
        '<span class="wht-log-method">' + entry.method + '</span>' +
        '<span class="wht-log-url" title="' + entry.url.replace(/"/g, '&quot;') + '">' + entry.shortUrl + '</span>' +
        '<span class="wht-log-status ' + statusClass(entry.status) + '">' + entry.status + '</span>' +
        '<span class="wht-log-latency">' + entry.latency + 'ms</span>';
      logEl.appendChild(li);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var url = urlInput.value.trim() || '(no url)';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var delay = 300 + Math.random() * 900;

    window.setTimeout(function () {
      var status = STATUS_POOL[Math.floor(Math.random() * STATUS_POOL.length)];
      var entry = {
        time: formatTime(new Date()),
        method: 'POST',
        url: url,
        shortUrl: truncateUrl(url, 42),
        status: status,
        latency: Math.round(delay)
      };
      log.unshift(entry);
      render();

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send test';
    }, delay);
  });

  render();
})();
