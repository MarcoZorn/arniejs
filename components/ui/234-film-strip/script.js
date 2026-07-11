(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var frames = document.querySelectorAll('.frame');

  frames.forEach(function (frame) {
    frame.addEventListener('click', function () {
      frames.forEach(function (f) { f.classList.remove('is-active'); });
      frame.classList.add('is-active');
      frame.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    });
  });
})();
