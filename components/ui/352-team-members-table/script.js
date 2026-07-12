(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var table = document.querySelector('.team-table');
  var status = document.querySelector('.team-status');
  if (!table) return;

  var statusTimer = null;

  function announce(msg) {
    if (!status) return;
    status.textContent = msg;
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      status.textContent = '';
    }, 4000);
  }

  // Role select: confirm change visually.
  var roleSelects = Array.prototype.slice.call(table.querySelectorAll('.team-role-select'));
  roleSelects.forEach(function (select) {
    select.addEventListener('change', function () {
      var row = select.closest('tr');
      var name = row ? row.getAttribute('data-member') : 'member';
      var roleLabel = select.options[select.selectedIndex].textContent;

      select.classList.add('is-updated');
      window.setTimeout(function () {
        select.classList.remove('is-updated');
      }, 1200);

      announce(name + ' is now ' + roleLabel + '.');
    });
  });

  // Remove member: inline confirm step, then real DOM removal.
  var removeButtons = Array.prototype.slice.call(table.querySelectorAll('.team-remove-btn'));
  removeButtons.forEach(function (btn) {
    var cell = btn.closest('.team-cell-actions');
    var confirmBox = cell.querySelector('.team-confirm');
    var yesBtn = confirmBox.querySelector('.team-confirm-yes');
    var noBtn = confirmBox.querySelector('.team-confirm-no');
    var row = btn.closest('tr');
    var name = row ? row.getAttribute('data-member') : 'This member';

    btn.addEventListener('click', function () {
      btn.hidden = true;
      confirmBox.hidden = false;
    });

    noBtn.addEventListener('click', function () {
      confirmBox.hidden = true;
      btn.hidden = false;
    });

    yesBtn.addEventListener('click', function () {
      announce(name + ' was removed from the team.');

      if (reduceMotion) {
        row.remove();
        return;
      }

      row.classList.add('team-row-removing');
      window.setTimeout(function () {
        row.remove();
      }, 260);
    });
  });
})();
