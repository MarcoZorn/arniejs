(function () {
  var glitch = document.getElementById('glitchImage');
  if (!glitch) return;

  glitch.addEventListener('mouseenter', function () {
    glitch.classList.add('is-glitching');
  });

  glitch.addEventListener('mouseleave', function () {
    glitch.classList.remove('is-glitching');
  });

  glitch.addEventListener('touchstart', function () {
    glitch.classList.add('is-glitching');
    setTimeout(function () {
      glitch.classList.remove('is-glitching');
    }, 700);
  }, { passive: true });
})();
