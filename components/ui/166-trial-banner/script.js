(function () {
  var banner = document.getElementById('trialBanner');
  var dismissBtn = document.getElementById('dismissBtn');
  var upgradeBtn = document.getElementById('upgradeBtn');
  var note = document.getElementById('demoNote');

  if (!banner || !dismissBtn || !upgradeBtn) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function dismissBanner() {
    banner.classList.add('is-dismissed');
    banner.setAttribute('aria-hidden', 'true');

    var finish = function () {
      banner.style.display = 'none';
      if (note) {
        note.textContent = 'Banner dismissed. Reload the demo to see it again.';
      }
    };

    if (reduceMotion) {
      finish();
      return;
    }

    var handled = false;
    banner.addEventListener('transitionend', function onEnd(e) {
      if (e.target !== banner) return;
      if (handled) return;
      handled = true;
      banner.removeEventListener('transitionend', onEnd);
      finish();
    });

    // Fallback in case transitionend doesn't fire.
    setTimeout(function () {
      if (!handled) {
        handled = true;
        finish();
      }
    }, 600);
  }

  dismissBtn.addEventListener('click', dismissBanner);

  upgradeBtn.addEventListener('click', function () {
    if (!reduceMotion) {
      upgradeBtn.classList.remove('is-clicked');
      // Force reflow to restart animation.
      void upgradeBtn.offsetWidth;
      upgradeBtn.classList.add('is-clicked');
    }
    upgradeBtn.textContent = 'Upgrading…';
    setTimeout(function () {
      upgradeBtn.textContent = 'Upgrade';
    }, 1200);
  });
})();
