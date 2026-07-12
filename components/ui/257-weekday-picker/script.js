(function () {
  var root = document.querySelector('.wd-wrap');
  if (!root) return;

  var pills = Array.prototype.slice.call(root.querySelectorAll('.wd-pill'));
  var summary = root.querySelector('.wd-summary');
  var selected = {};

  function updateSummary() {
    var days = pills.filter(function (p) { return selected[p.dataset.day]; })
      .map(function (p) { return p.dataset.day; });
    summary.textContent = days.length ? 'Selected: ' + days.join(', ') : 'Selected: none yet';
  }

  function toggle(pill) {
    var day = pill.dataset.day;
    selected[day] = !selected[day];
    pill.classList.toggle('is-selected', selected[day]);
    pill.setAttribute('aria-pressed', selected[day] ? 'true' : 'false');
    updateSummary();
  }

  pills.forEach(function (pill, index) {
    pill.setAttribute('aria-pressed', 'false');

    pill.addEventListener('click', function () {
      toggle(pill);
    });

    pill.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle(pill);
        return;
      }

      var nextIndex = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % pills.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + pills.length) % pills.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = pills.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        pills.forEach(function (p) { p.tabIndex = -1; });
        pills[nextIndex].tabIndex = 0;
        pills[nextIndex].focus();
      }
    });
  });

  updateSummary();
})();
