(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.related-save'));
  var countEl = document.querySelector('.related-count');
  if (!buttons.length || !countEl) return;

  var savedCount = 0;

  function updateCount() {
    countEl.textContent = String(savedCount);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isSaved = btn.classList.toggle('is-saved');
      btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
      savedCount += isSaved ? 1 : -1;
      updateCount();

      if (reduceMotion) return;

      btn.classList.remove('pop');
      // force reflow so the animation class can be re-triggered
      void btn.offsetWidth;
      btn.classList.add('pop');
      window.setTimeout(function () {
        btn.classList.remove('pop');
      }, 220);
    });
  });

  updateCount();
})();
