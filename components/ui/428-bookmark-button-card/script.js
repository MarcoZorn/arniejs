(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.querySelector('.bmk-toggle');
  var countEl = document.querySelector('.bmk-saves-count');
  if (!toggle || !countEl) return;

  var baseCount = parseInt(countEl.textContent, 10) || 0;

  toggle.addEventListener('click', function () {
    var isSaved = toggle.classList.toggle('is-saved');
    toggle.setAttribute('aria-pressed', isSaved ? 'true' : 'false');

    baseCount += isSaved ? 1 : -1;
    countEl.textContent = String(baseCount);

    if (reduceMotion) return;

    toggle.classList.remove('pulse');
    void toggle.offsetWidth;
    toggle.classList.add('pulse');
    window.setTimeout(function () {
      toggle.classList.remove('pulse');
    }, 450);
  });
})();
