(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var fill = document.getElementById('harvestBarFill');
  var loadBtn = document.getElementById('loadBtn');
  var statusText = document.getElementById('statusText');
  if (!fill || !loadBtn) return;

  var running = false;
  var timeoutIds = [];

  function clearTimers() {
    timeoutIds.forEach(function (id) { clearTimeout(id); });
    timeoutIds = [];
  }

  function setStatus(text) {
    if (statusText) statusText.textContent = text;
  }

  function schedule(fn, delay) {
    timeoutIds.push(setTimeout(fn, delay));
  }

  function simulateLoad() {
    if (running) return;
    running = true;
    loadBtn.disabled = true;
    clearTimers();

    fill.classList.remove('is-done');
    fill.classList.add('is-active');
    fill.style.width = '0%';
    setStatus('loading…');

    if (prefersReducedMotion) {
      fill.style.width = '100%';
      schedule(finish, 400);
      return;
    }

    // Simulate uneven network progress steps.
    var steps = [
      { width: 25, delay: 120 },
      { width: 48, delay: 280 },
      { width: 63, delay: 260 },
      { width: 80, delay: 420 },
      { width: 92, delay: 320 },
      { width: 100, delay: 260 }
    ];

    var elapsed = 0;
    steps.forEach(function (step) {
      elapsed += step.delay;
      schedule(function () {
        fill.style.width = step.width + '%';
        if (step.width === 100) {
          schedule(finish, 250);
        }
      }, elapsed);
    });
  }

  function finish() {
    fill.classList.add('is-done');
    setStatus('loaded');
    schedule(function () {
      fill.classList.remove('is-active', 'is-done');
      fill.style.width = '0%';
      running = false;
      loadBtn.disabled = false;
      setStatus('idle');
    }, 500);
  }

  loadBtn.addEventListener('click', simulateLoad);
})();
