(function () {
  var CONTEXT_RADIUS = 1;

  var diffEl = document.getElementById('cdiDiff');
  var toggleBtn = document.getElementById('cdiToggle');

  if (!diffEl || !toggleBtn) return;

  var lines = Array.prototype.slice.call(diffEl.querySelectorAll('.cdi-line'));
  var showingContext = true;

  function keepIndexes() {
    var keep = {};
    lines.forEach(function (line, i) {
      if (line.getAttribute('data-type') !== 'context') {
        for (var offset = -CONTEXT_RADIUS; offset <= CONTEXT_RADIUS; offset++) {
          keep[i + offset] = true;
        }
      }
    });
    return keep;
  }

  function applyState() {
    if (showingContext) {
      lines.forEach(function (line) {
        line.classList.remove('cdi-hidden');
      });
      toggleBtn.textContent = 'Hide unchanged context lines';
      toggleBtn.setAttribute('aria-pressed', 'false');
      return;
    }

    var keep = keepIndexes();
    lines.forEach(function (line, i) {
      var isContext = line.getAttribute('data-type') === 'context';
      if (isContext && !keep[i]) {
        line.classList.add('cdi-hidden');
      } else {
        line.classList.remove('cdi-hidden');
      }
    });
    toggleBtn.textContent = 'Show unchanged context lines';
    toggleBtn.setAttribute('aria-pressed', 'true');
  }

  toggleBtn.addEventListener('click', function () {
    showingContext = !showingContext;
    applyState();
  });

  applyState();
})();
