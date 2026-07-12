(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cards = Array.prototype.slice.call(document.querySelectorAll('.tag-card'));
  var note = document.querySelector('.tag-note');
  var noteTimer = null;

  cards.forEach(function (card) {
    var stock = parseInt(card.getAttribute('data-stock'), 10) || 1;
    var valEl = card.querySelector('[data-qty-val]');
    var decBtn = card.querySelector('[data-qty-dec]');
    var incBtn = card.querySelector('[data-qty-inc]');
    var addBtn = card.querySelector('[data-add]');
    var nameEl = card.querySelector('.tag-name');
    var qty = 1;
    var addTimer = null;

    function render() {
      valEl.textContent = String(qty);
      decBtn.disabled = qty <= 1;
      incBtn.disabled = qty >= stock;
    }

    decBtn.addEventListener('click', function () {
      if (qty <= 1) return;
      qty -= 1;
      render();
    });

    incBtn.addEventListener('click', function () {
      if (qty >= stock) return;
      qty += 1;
      render();
    });

    addBtn.addEventListener('click', function () {
      var name = nameEl ? nameEl.textContent : 'Item';
      var originalText = 'Add to cart';

      addBtn.textContent = 'Added ✓';
      addBtn.classList.add('is-added');

      if (note) {
        note.textContent = qty + 'x ' + name + ' added to your cart.';
        window.clearTimeout(noteTimer);
        noteTimer = window.setTimeout(function () {
          note.textContent = '';
        }, 4000);
      }

      window.clearTimeout(addTimer);
      addTimer = window.setTimeout(function () {
        addBtn.textContent = originalText;
        addBtn.classList.remove('is-added');
      }, 1600);

      if (reduceMotion) return;

      addBtn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.95)' },
          { transform: 'scale(1)' }
        ],
        { duration: 220, easing: 'ease-out' }
      );
    });

    render();
  });
})();
