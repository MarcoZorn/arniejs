(function () {
  var detector = document.querySelector('.detector');
  var label = document.querySelector('[data-label]');
  var hint = document.querySelector('[data-hint]');
  if (!detector || !label || !hint) return;

  if (!window.matchMedia) {
    label.textContent = 'Unsupported';
    hint.textContent = 'matchMedia is not available in this browser';
    return;
  }

  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var lightQuery = window.matchMedia('(prefers-color-scheme: light)');

  function render() {
    var scheme = 'no-preference';
    if (darkQuery.matches) scheme = 'dark';
    else if (lightQuery.matches) scheme = 'light';

    detector.setAttribute('data-scheme', scheme);

    if (scheme === 'dark') {
      label.textContent = 'Dark mode';
      hint.textContent = 'System is set to prefers-color-scheme: dark';
    } else if (scheme === 'light') {
      label.textContent = 'Light mode';
      hint.textContent = 'System is set to prefers-color-scheme: light';
    } else {
      label.textContent = 'No preference';
      hint.textContent = 'Your OS did not report a color-scheme preference';
    }
  }

  function bind(query) {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', render);
    } else if (typeof query.addListener === 'function') {
      // Safari < 14 fallback
      query.addListener(render);
    }
  }

  bind(darkQuery);
  bind(lightQuery);

  render();
})();
