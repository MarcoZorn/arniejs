(function () {
  var btn = document.getElementById('wishlistBtn');
  var note = document.getElementById('demoNote');

  if (!btn) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  btn.addEventListener('click', function () {
    var isActive = btn.getAttribute('aria-pressed') === 'true';
    var next = !isActive;
    btn.setAttribute('aria-pressed', String(next));
    btn.setAttribute('aria-label', next ? 'Remove from wishlist' : 'Add to wishlist');

    if (next && !reduceMotion) {
      btn.classList.remove('is-popping');
      void btn.offsetWidth;
      btn.classList.add('is-popping');
    }

    if (note) {
      note.textContent = next
        ? 'Added to your wishlist.'
        : 'Click the heart to add this item to your wishlist.';
    }
  });

  btn.addEventListener('animationend', function () {
    btn.classList.remove('is-popping');
  });
})();
