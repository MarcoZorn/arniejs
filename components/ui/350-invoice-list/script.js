(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var statusEl = document.querySelector('[data-status]');
  var statusTimer = null;

  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    window.clearTimeout(statusTimer);
    if (msg) {
      statusTimer = window.setTimeout(function () { statusEl.textContent = ''; }, 3500);
    }
  }

  function buildInvoiceText(row) {
    var id = row.getAttribute('data-id');
    var amount = row.getAttribute('data-amount');
    var date = row.getAttribute('data-date');
    var badge = row.querySelector('.inv-badge');
    var status = badge ? badge.textContent : '';
    return [
      'ArnieJS — Invoice ' + id,
      'Date: ' + date,
      'Amount: ' + amount,
      'Status: ' + status,
      '',
      'Thank you for your business.'
    ].join('\n');
  }

  var rows = Array.prototype.slice.call(document.querySelectorAll('[data-invoice]'));

  rows.forEach(function (row) {
    var btn = row.querySelector('[data-download]');
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      var originalText = 'Download';
      btn.disabled = true;
      btn.textContent = 'Downloading…';

      window.setTimeout(function () {
        try {
          var text = buildInvoiceText(row);
          var blob = new Blob([text], { type: 'text/plain' });
          var url = URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = url;
          link.download = (row.getAttribute('data-id') || 'invoice') + '.txt';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

          btn.textContent = 'Downloaded';
          btn.classList.add('is-done');
          setStatus(row.getAttribute('data-id') + ' downloaded');
        } catch (err) {
          btn.textContent = 'Try again';
          setStatus('Download failed — please try again');
        }

        window.setTimeout(function () {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.classList.remove('is-done');
        }, 1800);
      }, reduceMotion ? 0 : 500);
    });
  });
})();
