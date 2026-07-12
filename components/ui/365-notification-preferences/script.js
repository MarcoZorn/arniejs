(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var rows = Array.prototype.slice.call(document.querySelectorAll('#np-body .np-row'));
  var summary = document.getElementById('np-summary');
  if (!rows.length) return;

  var summaryTimer = null;

  function announce(row, input) {
    if (!summary) return;
    var type = row.getAttribute('data-type');
    var channel = input.getAttribute('data-channel');
    var channelLabel = channel === 'sms' ? 'SMS' : channel.charAt(0).toUpperCase() + channel.slice(1);
    var state = input.checked ? 'enabled' : 'disabled';

    summary.textContent = channelLabel + ' notifications for "' + type + '" ' + state + '.';

    window.clearTimeout(summaryTimer);
    summaryTimer = window.setTimeout(function () {
      summary.textContent = '';
    }, 2600);
  }

  rows.forEach(function (row) {
    var inputs = Array.prototype.slice.call(row.querySelectorAll('input[type="checkbox"]'));
    inputs.forEach(function (input) {
      input.addEventListener('change', function () {
        announce(row, input);

        if (!reduceMotion) {
          var box = input.nextElementSibling;
          if (box) {
            box.animate(
              [
                { transform: 'scale(1)' },
                { transform: 'scale(1.15)' },
                { transform: 'scale(1)' }
              ],
              { duration: 180, easing: 'ease-out' }
            );
          }
        }
      });
    });
  });
})();
