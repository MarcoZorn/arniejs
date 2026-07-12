(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var rows = Array.prototype.slice.call(document.querySelectorAll('#wh-list .wh-row'));
  if (!rows.length) return;

  rows.forEach(function (row) {
    var toggle = row.querySelector('.wh-toggle');
    var testBtn = row.querySelector('.wh-test-btn');
    var feedback = row.querySelector('.wh-feedback');

    // Active/inactive toggle switch.
    toggle.addEventListener('click', function () {
      var isActive = toggle.getAttribute('aria-checked') === 'true';
      var next = !isActive;
      toggle.setAttribute('aria-checked', String(next));
      row.setAttribute('data-active', String(next));
    });

    // Test button: pending -> success/fail feedback.
    testBtn.addEventListener('click', function () {
      if (testBtn.getAttribute('data-state') === 'pending') return;

      testBtn.setAttribute('data-state', 'pending');
      testBtn.textContent = 'Sending…';
      testBtn.disabled = true;
      feedback.textContent = 'Sending a test event…';

      var delay = reduceMotion ? 200 : 900;

      window.setTimeout(function () {
        var success = Math.random() > 0.25;

        if (success) {
          testBtn.setAttribute('data-state', 'success');
          testBtn.textContent = 'Success';
          feedback.textContent = 'Test event delivered — endpoint responded 200 OK.';
        } else {
          testBtn.setAttribute('data-state', 'fail');
          testBtn.textContent = 'Failed';
          feedback.textContent = 'Test event failed — endpoint did not respond in time.';
        }

        window.setTimeout(function () {
          testBtn.setAttribute('data-state', 'idle');
          testBtn.textContent = 'Test';
          testBtn.disabled = false;
          feedback.textContent = '';
        }, 2400);
      }, delay);
    });
  });
})();
