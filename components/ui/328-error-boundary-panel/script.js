(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var panel = document.getElementById('errb-panel');
  var retryBtn = document.getElementById('errb-retry-btn');
  var resetBtn = document.getElementById('errb-reset-btn');
  if (!panel || !retryBtn) return;

  var views = {
    error: panel.querySelector('[data-view="error"]'),
    loading: panel.querySelector('[data-view="loading"]'),
    success: panel.querySelector('[data-view="success"]')
  };

  var attempt = 0;

  function showView(name) {
    Object.keys(views).forEach(function (key) {
      views[key].hidden = key !== name;
    });
    panel.setAttribute('data-state', name);
  }

  function retry() {
    retryBtn.disabled = true;
    showView('loading');

    var delay = reduceMotion ? 150 : 1100;

    window.setTimeout(function () {
      attempt += 1;
      // Alternate outcome deterministically-but-realistically: first retry usually fails,
      // subsequent retries succeed more often, with genuine randomness mixed in.
      var succeeds = attempt % 2 === 0 || Math.random() > 0.55;

      if (succeeds) {
        showView('success');
      } else {
        showView('error');
        retryBtn.disabled = false;
      }
    }, delay);
  }

  retryBtn.addEventListener('click', retry);

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      attempt = 0;
      retryBtn.disabled = false;
      showView('error');
    });
  }
})();
