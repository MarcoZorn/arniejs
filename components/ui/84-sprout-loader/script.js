(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var sprouts = document.getElementById('sprouts');
  var toggleBtn = document.getElementById('toggleBtn');
  if (!sprouts || !toggleBtn) return;

  var paused = false;

  if (prefersReducedMotion) {
    toggleBtn.disabled = true;
    toggleBtn.textContent = 'Motion reduced';
    return;
  }

  toggleBtn.addEventListener('click', function () {
    paused = !paused;
    sprouts.classList.toggle('is-paused', paused);
    toggleBtn.textContent = paused ? 'Resume' : 'Pause';
    sprouts.setAttribute('aria-label', paused ? 'Loading paused' : 'Loading');
  });
})();
