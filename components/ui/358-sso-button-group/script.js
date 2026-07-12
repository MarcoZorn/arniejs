(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.sso-btn'));
  var note = document.querySelector('[data-note]');
  var busy = false;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (busy) return;
      busy = true;

      var provider = btn.getAttribute('data-provider') || 'your provider';
      var status = btn.querySelector('[data-status]');
      var label = btn.querySelector('.sso-label');
      var originalLabel = label ? label.textContent : '';

      buttons.forEach(function (b) { b.disabled = true; });
      btn.classList.add('is-loading');
      if (label) label.textContent = 'Connecting to ' + provider + '...';
      if (note) note.textContent = '';

      var delay = reduceMotion ? 200 : 900;

      window.setTimeout(function () {
        if (label) label.textContent = 'Redirecting to ' + provider + '...';
        if (status) status.textContent = '';

        window.setTimeout(function () {
          btn.classList.remove('is-loading');
          if (label) label.textContent = originalLabel;
          buttons.forEach(function (b) { b.disabled = false; });
          if (note) note.textContent = 'This is a demo — ' + provider + ' sign-in has no real destination here.';
          busy = false;
        }, delay);
      }, delay);
    });
  });
})();
