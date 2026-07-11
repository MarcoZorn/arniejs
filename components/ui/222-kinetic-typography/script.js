(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var kinetic = document.getElementById('kinetic');
  var replayBtn = document.getElementById('kineticReplay');
  var words = kinetic ? kinetic.querySelectorAll('.kinetic__word') : [];

  function replay() {
    if (prefersReducedMotion) return;

    words.forEach(function (word) {
      word.style.animation = 'none';
      // Force reflow so the animation can be re-triggered.
      void word.offsetWidth;
      word.style.animation = '';
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', replay);
  }

  if (!prefersReducedMotion && words.length) {
    var totalDelay = (words.length - 1) * 220 + 700;
    setInterval(replay, totalDelay + 1400);
  }
})();
