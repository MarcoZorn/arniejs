(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var rows = document.querySelectorAll('.flag-row');

  rows.forEach(function (row) {
    var toggle = row.querySelector('.toggle');
    var status = row.querySelector('.flag-row__status');
    if (!toggle || !status) return;

    toggle.addEventListener('click', function () {
      var isOn = toggle.classList.toggle('is-on');
      toggle.setAttribute('aria-checked', isOn ? 'true' : 'false');
      status.textContent = isOn ? 'Enabled' : 'Disabled';

      if (!reduce) {
        toggle.style.transform = 'scale(0.94)';
        setTimeout(function () {
          toggle.style.transform = '';
        }, 120);
      }
    });

    toggle.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle.click();
      }
    });
  });
})();
