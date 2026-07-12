(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-toggle]'));
  var statusEl = document.querySelector('[data-status]');
  var statusTimer = null;

  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    window.clearTimeout(statusTimer);
    if (msg) {
      statusTimer = window.setTimeout(function () { statusEl.textContent = ''; }, 2600);
    }
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var isOn = toggle.classList.toggle('is-on');
      toggle.setAttribute('aria-checked', isOn ? 'true' : 'false');
      var name = toggle.getAttribute('data-name') || 'Setting';
      setStatus(name + (isOn ? ' turned on' : ' turned off'));

      if (!reduceMotion) {
        var knob = toggle.querySelector('.asp-toggle-knob');
        if (knob) {
          knob.animate(
            [{ transform: knob.style.transform || (isOn ? 'translateX(0)' : 'translateX(20px)') }, { transform: isOn ? 'translateX(20px)' : 'translateX(0)' }],
            { duration: 160, easing: 'ease-out' }
          );
        }
      }
    });
  });
})();
