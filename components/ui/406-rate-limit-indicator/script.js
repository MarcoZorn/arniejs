(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LIMIT = 100;
  var used = 0;

  var fill = document.getElementById('rliFill');
  var usedEl = document.getElementById('rliUsed');
  var limitEl = document.getElementById('rliLimit');
  var pctEl = document.getElementById('rliPct');
  var statusTag = document.getElementById('rliStatusTag');
  var message = document.getElementById('rliMessage');
  var meter = document.querySelector('.rli-meter');
  var simulateBtn = document.getElementById('rliSimulate');
  var resetBtn = document.getElementById('rliReset');

  limitEl.textContent = LIMIT;

  function render() {
    var pct = Math.round((used / LIMIT) * 100);
    fill.style.width = pct + '%';
    usedEl.textContent = used;
    pctEl.textContent = pct + '%';
    meter.setAttribute('aria-valuenow', pct);

    fill.classList.remove('is-warn', 'is-danger', 'is-blocked');
    statusTag.classList.remove('is-warn', 'is-danger');

    if (used >= LIMIT) {
      fill.classList.add('is-blocked');
      statusTag.classList.add('is-danger');
      statusTag.textContent = 'Blocked';
      message.textContent = 'Limit reached — no more requests until you reset.';
      simulateBtn.disabled = true;
    } else if (pct > 85) {
      fill.classList.add('is-danger');
      statusTag.classList.add('is-danger');
      statusTag.textContent = 'Critical';
      message.textContent = 'Almost at capacity, ease off soon.';
      simulateBtn.disabled = false;
    } else if (pct >= 60) {
      fill.classList.add('is-warn');
      statusTag.classList.add('is-warn');
      statusTag.textContent = 'Elevated';
      message.textContent = '';
      simulateBtn.disabled = false;
    } else {
      statusTag.textContent = 'OK';
      message.textContent = '';
      simulateBtn.disabled = false;
    }
  }

  simulateBtn.addEventListener('click', function () {
    if (used >= LIMIT) return;
    used += 1;
    render();

    if (!reduceMotion) {
      fill.animate(
        [{ filter: 'brightness(1.4)' }, { filter: 'brightness(1)' }],
        { duration: 250, easing: 'ease-out' }
      );
    }
  });

  resetBtn.addEventListener('click', function () {
    used = 0;
    render();
  });

  render();
})();
