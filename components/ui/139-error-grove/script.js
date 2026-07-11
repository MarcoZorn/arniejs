(function () {
  var panel = document.getElementById('errorPanel');
  var triggerBtn = document.getElementById('triggerBtn');

  if (!panel || !triggerBtn) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function playAnimation() {
    if (reduceMotion) return;

    panel.classList.remove('shake', 'wilt');

    // Force reflow so the animation can be re-triggered.
    void panel.offsetWidth;

    requestAnimationFrame(function () {
      panel.classList.add('shake', 'wilt');
    });
  }

  panel.addEventListener('animationend', function (event) {
    if (event.animationName === 'grove-shake') {
      panel.classList.remove('shake');
    }
  });

  triggerBtn.addEventListener('click', playAnimation);

  // Auto-play once on mount.
  if (reduceMotion) {
    panel.classList.remove('shake', 'wilt');
  } else {
    requestAnimationFrame(function () {
      playAnimation();
    });
  }
})();
