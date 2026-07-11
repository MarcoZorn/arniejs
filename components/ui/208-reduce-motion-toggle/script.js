(function () {
  var toggle = document.getElementById('motionSwitch');
  var demo = document.getElementById('demoBox');
  var switchText = document.querySelector('[data-switch-text]');
  var caption = document.querySelector('[data-caption]');
  if (!toggle || !demo || !switchText || !caption) return;

  var reduced = false;

  function render() {
    toggle.setAttribute('aria-checked', String(reduced));
    demo.classList.toggle('is-reduced', reduced);
    switchText.textContent = reduced ? 'Motion reduced' : 'Motion enabled';
    caption.textContent = reduced
      ? 'Orb animation is paused — simulated reduced motion is on'
      : 'Orb bounces freely — motion is on';
  }

  function setReduced(next) {
    reduced = next;
    render();
  }

  toggle.addEventListener('click', function () {
    setReduced(!reduced);
  });

  toggle.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setReduced(!reduced);
    }
  });

  render();
})();
