(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var blocks = Array.prototype.slice.call(document.querySelectorAll('.skel-block'));
  var page = document.querySelector('.skel-page');
  var btn = document.querySelector('[data-action="simulate-load"]');
  if (!blocks.length || !btn) return;

  var loaded = false;
  var autoTimer = null;

  function loadContent() {
    if (loaded) return;
    loaded = true;

    window.clearTimeout(autoTimer);
    btn.disabled = true;
    btn.textContent = 'Loading…';

    var delay = reduceMotion ? 60 : 700;

    window.setTimeout(function () {
      blocks.forEach(function (block, i) {
        window.setTimeout(function () {
          block.setAttribute('data-state', 'loaded');
        }, reduceMotion ? 0 : i * 150);
      });

      if (page) page.setAttribute('aria-busy', 'false');
      btn.textContent = 'Loaded';
    }, delay);
  }

  btn.addEventListener('click', loadContent);

  // Auto-load after a short delay so the skeleton is genuinely demonstrated first.
  autoTimer = window.setTimeout(loadContent, reduceMotion ? 1200 : 4500);
})();
