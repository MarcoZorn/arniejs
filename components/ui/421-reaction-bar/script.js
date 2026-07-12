(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar = document.querySelector('.rxn-bar');
  var status = document.querySelector('.rxn-status');
  if (!bar) return;

  var buttons = Array.prototype.slice.call(bar.querySelectorAll('.rxn-btn'));
  var active = null; // currently-active button element

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var countEl = btn.querySelector('.rxn-count');
      var count = parseInt(countEl.textContent, 10) || 0;
      var emoji = btn.getAttribute('data-emoji');
      var reaction = btn.getAttribute('data-reaction');

      if (active === btn) {
        // toggling off your own reaction
        countEl.textContent = String(count - 1);
        btn.classList.remove('is-active');
        active = null;
        if (status) status.textContent = 'Reaction removed.';
        return;
      }

      if (active) {
        // move reaction from previous button to this one
        var prevCountEl = active.querySelector('.rxn-count');
        var prevCount = parseInt(prevCountEl.textContent, 10) || 0;
        prevCountEl.textContent = String(Math.max(0, prevCount - 1));
        active.classList.remove('is-active');
      }

      countEl.textContent = String(count + 1);
      btn.classList.add('is-active');
      active = btn;

      if (status) status.textContent = 'You reacted with ' + emoji + ' (' + reaction + ').';

      if (!reduceMotion) {
        btn.classList.remove('rxn-bump');
        // force reflow so the animation can restart if clicked repeatedly
        void btn.offsetWidth;
        btn.classList.add('rxn-bump');
      }
    });
  });
})();
