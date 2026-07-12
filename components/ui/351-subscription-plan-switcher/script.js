(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.querySelector('.plans-toggle');
  var toggleBtns = Array.prototype.slice.call(document.querySelectorAll('.plans-toggle-btn'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.plan-card'));
  var note = document.querySelector('.plans-note');
  var noteTimer = null;

  if (!toggle || !cards.length) return;

  var currentInterval = 'monthly';

  function setInterval(interval) {
    currentInterval = interval;
    toggle.setAttribute('data-active', interval);

    toggleBtns.forEach(function (btn) {
      var isActive = btn.getAttribute('data-interval') === interval;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    cards.forEach(function (card) {
      var amountEl = card.querySelector('.plan-price-amount');
      var billedNote = card.querySelector('.plan-billed-note');
      var saveBadge = card.querySelector('.plan-save-badge');

      var monthly = parseFloat(amountEl.getAttribute('data-monthly'));
      var yearly = parseFloat(amountEl.getAttribute('data-yearly'));

      var displayed = interval === 'yearly' ? yearly : monthly;

      if (!reduceMotion) {
        amountEl.style.opacity = '0';
        window.setTimeout(function () {
          amountEl.textContent = '$' + displayed;
          amountEl.style.opacity = '1';
        }, 90);
      } else {
        amountEl.textContent = '$' + displayed;
      }

      if (interval === 'yearly') {
        var annualTotal = Math.round(yearly * 12);
        billedNote.textContent = '$' + annualTotal + ' billed yearly';

        var savePct = Math.round((1 - (yearly / monthly)) * 100);
        if (savePct > 0) {
          saveBadge.textContent = 'Save ' + savePct + '%';
          saveBadge.hidden = false;
        } else {
          saveBadge.hidden = true;
        }
      } else {
        billedNote.textContent = 'billed monthly';
        saveBadge.hidden = true;
      }
    });
  }

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var interval = btn.getAttribute('data-interval');
      if (interval === currentInterval) return;
      setInterval(interval);
    });
  });

  var ctas = Array.prototype.slice.call(document.querySelectorAll('.plan-cta'));
  ctas.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.plan-card');
      var plan = card ? card.getAttribute('data-plan') : 'this plan';

      if (note) {
        note.textContent = 'You selected the ' + plan + ' plan, billed ' + currentInterval + '.';
        window.clearTimeout(noteTimer);
        noteTimer = window.setTimeout(function () {
          note.textContent = '';
        }, 4000);
      }

      if (reduceMotion) return;

      btn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.96)' },
          { transform: 'scale(1)' }
        ],
        { duration: 200, easing: 'ease-out' }
      );
    });
  });

  // initialize display with monthly values (already correct in markup) + note text
  setInterval('monthly');
})();
