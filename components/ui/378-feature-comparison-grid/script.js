(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var table = document.querySelector('.grid-table');
  if (!table) return;

  // Monthly / annual pricing toggle.
  var toggleBtns = Array.prototype.slice.call(document.querySelectorAll('.grid-toggle-btn'));
  var priceEls = Array.prototype.slice.call(table.querySelectorAll('.grid-plan-price'));

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var period = btn.getAttribute('data-period');
      toggleBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });

      priceEls.forEach(function (el) {
        var value = el.getAttribute('data-' + period);
        if (!value) return;
        var suffix = period === 'annual' ? '/mo, billed yearly' : '/mo';
        el.innerHTML = value + '<small>' + suffix + '</small>';
      });
    });
  });

  // CTA buttons: confirmation note + tactile press feedback.
  var note = document.querySelector('.grid-note');
  var ctas = Array.prototype.slice.call(table.querySelectorAll('.grid-cta'));
  var noteTimer = null;

  ctas.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var plan = btn.getAttribute('data-plan') || 'this plan';

      if (note) {
        note.textContent = 'You selected the ' + plan + ' plan. Let’s get planting.';
        window.clearTimeout(noteTimer);
        noteTimer = window.setTimeout(function () {
          note.textContent = '';
        }, 4000);
      }

      if (reduceMotion) return;

      btn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.94)' },
          { transform: 'scale(1)' }
        ],
        { duration: 200, easing: 'ease-out' }
      );
    });
  });
})();
