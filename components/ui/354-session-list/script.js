(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.querySelector('.sess-list');
  var status = document.querySelector('.sess-status');
  if (!list) return;

  var statusTimer = null;

  function announce(msg) {
    if (!status) return;
    status.textContent = msg;
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      status.textContent = '';
    }, 4000);
  }

  var revokeButtons = Array.prototype.slice.call(list.querySelectorAll('.sess-revoke-btn:not(:disabled)'));

  revokeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.sess-item');
      if (!item) return;

      var deviceEl = item.querySelector('.sess-device');
      var deviceName = deviceEl ? deviceEl.firstChild.textContent.trim() : 'Session';

      btn.disabled = true;
      btn.textContent = 'Revoking…';

      announce(deviceName + ' was signed out.');

      var finish = function () {
        item.remove();
        if (!list.querySelector('.sess-item')) {
          var empty = document.createElement('li');
          empty.className = 'sess-empty';
          empty.textContent = 'No other active sessions.';
          list.appendChild(empty);
        }
      };

      if (reduceMotion) {
        finish();
        return;
      }

      item.classList.add('sess-item-removing');
      window.setTimeout(finish, 260);
    });
  });
})();
