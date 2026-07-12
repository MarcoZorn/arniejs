(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STORAGE_KEY = 'arniejs-wishlist-369';
  var cardsWrap = document.querySelector('[data-cards]');
  var statusEl = document.querySelector('[data-status]');
  if (!cardsWrap || !statusEl) return;

  function readSaved() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  }

  function writeSaved(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* localStorage unavailable, state stays in-memory only */
    }
  }

  var saved = readSaved();
  var buttons = Array.prototype.slice.call(cardsWrap.querySelectorAll('[data-wishlist-btn]'));

  function updateStatus() {
    var names = buttons
      .filter(function (btn) { return btn.getAttribute('aria-pressed') === 'true'; })
      .map(function (btn) {
        return btn.closest('[data-product-id]').querySelector('.wtb-name').textContent;
      });

    if (names.length === 0) {
      statusEl.textContent = 'Nothing saved yet.';
    } else if (names.length === 1) {
      statusEl.textContent = 'Saved: ' + names[0];
    } else {
      statusEl.textContent = names.length + ' items saved to your wishlist.';
    }
  }

  function applyState(btn, isSaved) {
    btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
    var card = btn.closest('[data-product-id]');
    var name = card ? card.querySelector('.wtb-name').textContent : 'this item';
    btn.setAttribute('aria-label', (isSaved ? 'Remove ' : 'Add ') + name + (isSaved ? ' from' : ' to') + ' wishlist');
  }

  buttons.forEach(function (btn) {
    var card = btn.closest('[data-product-id]');
    var id = card.dataset.productId;
    applyState(btn, !!saved[id]);

    btn.addEventListener('click', function () {
      var isSaved = btn.getAttribute('aria-pressed') !== 'true';
      applyState(btn, isSaved);
      saved[id] = isSaved;
      writeSaved(saved);
      updateStatus();

      if (isSaved && !reduceMotion) {
        btn.classList.remove('is-pop');
        // Force reflow so the animation can restart on rapid toggles.
        void btn.offsetWidth;
        btn.classList.add('is-pop');
        window.setTimeout(function () {
          btn.classList.remove('is-pop');
        }, 400);
      }
    });
  });

  updateStatus();
})();
