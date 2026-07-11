(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ember = document.querySelector('.ember');
  var toggleBtn = document.getElementById('toggle-btn');

  if (!ember || !toggleBtn) return;

  if (prefersReducedMotion) {
    toggleBtn.style.display = 'none';
    return;
  }

  var paused = false;

  toggleBtn.addEventListener('click', function () {
    paused = !paused;
    ember.classList.toggle('paused', paused);
    toggleBtn.textContent = paused ? 'Resume' : 'Pause';
  });
})();
