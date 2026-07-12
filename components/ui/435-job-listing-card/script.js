(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var applyBtn = document.getElementById('jobApplyBtn');
  var bookmarkBtn = document.getElementById('jobBookmark');

  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      if (applyBtn.classList.contains('is-applied')) return;

      applyBtn.classList.add('is-applied');
      applyBtn.textContent = 'Applied ✓';
      applyBtn.disabled = true;

      if (reduceMotion) return;

      applyBtn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.95)' },
          { transform: 'scale(1)' }
        ],
        { duration: 200, easing: 'ease-out' }
      );
    });
  }

  if (bookmarkBtn) {
    var saved = false;

    bookmarkBtn.addEventListener('click', function () {
      saved = !saved;
      bookmarkBtn.classList.toggle('is-saved', saved);
      bookmarkBtn.setAttribute('aria-pressed', saved ? 'true' : 'false');
      bookmarkBtn.setAttribute('aria-label', saved ? 'Remove from saved listings' : 'Save this listing');

      if (reduceMotion) return;

      bookmarkBtn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.12)' },
          { transform: 'scale(1)' }
        ],
        { duration: 220, easing: 'ease-out' }
      );
    });
  }
})();
