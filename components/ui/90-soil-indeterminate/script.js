(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var demo = document.querySelector('.demo');
  var toggleBtn = document.getElementById('toggle-btn');

  if (!demo || !toggleBtn) return;

  if (prefersReducedMotion) {
    toggleBtn.style.display = 'none';
    return;
  }

  var paused = false;

  toggleBtn.addEventListener('click', function () {
    paused = !paused;
    demo.classList.toggle('paused', paused);
    toggleBtn.textContent = paused ? 'Resume' : 'Pause';
  });
})();
