(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var table = document.querySelector('.perm-table');
  var status = document.querySelector('.perm-status');
  if (!table) return;

  var statusTimer = null;
  var roleNames = [];
  var headerCells = table.querySelectorAll('thead th');
  headerCells.forEach(function (th, i) {
    if (i === 0) return;
    roleNames.push(th.textContent.trim());
  });

  var checkboxes = Array.prototype.slice.call(table.querySelectorAll('input[type="checkbox"]'));

  checkboxes.forEach(function (box) {
    if (box.disabled) return;

    box.addEventListener('change', function () {
      var row = box.closest('tr');
      var permission = row ? row.getAttribute('data-permission') : 'This permission';

      var cell = box.closest('td');
      var colIndex = Array.prototype.indexOf.call(row.children, cell);
      var role = roleNames[colIndex - 1] || 'this role';

      var verb = box.checked ? 'granted to' : 'revoked from';

      if (status) {
        status.textContent = permission + ' ' + verb + ' ' + role + '.';
        window.clearTimeout(statusTimer);
        statusTimer = window.setTimeout(function () {
          status.textContent = '';
        }, 3500);
      }

      if (reduceMotion) return;

      var labelBox = box.nextElementSibling;
      if (labelBox) {
        labelBox.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.15)' },
            { transform: 'scale(1)' }
          ],
          { duration: 180, easing: 'ease-out' }
        );
      }
    });
  });
})();
