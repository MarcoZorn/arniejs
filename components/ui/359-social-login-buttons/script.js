(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.sln-btn'));
  var feedback = document.querySelector('[data-feedback]');
  var busy = false;

  buttons.forEach(function (btn) {
    var label = btn.querySelector('.sln-label');
    var originalLabel = label ? label.textContent : '';

    btn.addEventListener('click', function () {
      if (busy) return;
      busy = true;

      var provider = btn.getAttribute('data-provider') || 'this provider';
      buttons.forEach(function (b) { b.disabled = true; });
      btn.classList.add('is-active');
      if (label) label.textContent = 'Connecting…';
      if (feedback) feedback.textContent = '';

      if (!reduceMotion) {
        btn.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(0.95)' }, { transform: 'scale(1)' }],
          { duration: 200, easing: 'ease-out' }
        );
      }

      var delay = reduceMotion ? 250 : 950;

      window.setTimeout(function () {
        if (label) label.textContent = originalLabel;
        btn.classList.remove('is-active');
        buttons.forEach(function (b) { b.disabled = false; });
        if (feedback) feedback.textContent = 'Demo only — ' + provider + ' sign-in isn’t wired to a real backend here.';
        busy = false;
      }, delay);
    });
  });
})();
