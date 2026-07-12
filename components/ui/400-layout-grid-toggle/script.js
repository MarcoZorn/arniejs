(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.lgt-toggle-btn'));
  var cards = document.getElementById('lgt-cards');

  if (!cards) return;

  function setView(view) {
    // Re-applies a different layout class/attribute to the same card markup —
    // no duplicate DOM, just a real CSS layout swap (grid vs stacked list).
    cards.setAttribute('data-view', view);

    buttons.forEach(function (btn) {
      var active = btn.dataset.view === view;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setView(btn.dataset.view);
    });
  });

  setView('grid');
})();
