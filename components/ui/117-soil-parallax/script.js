(function () {
  var stage = document.getElementById('parallaxStage');
  if (!stage) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var layers = Array.prototype.slice.call(stage.querySelectorAll('.layer'));

  if (reduceMotion) return;

  var ticking = false;

  function update() {
    var rect = stage.getBoundingClientRect();
    var progress = -rect.top;

    layers.forEach(function (layer) {
      var speed = parseFloat(layer.getAttribute('data-speed')) || 0.2;
      var offset = progress * speed;
      layer.style.transform = 'translate3d(0,' + offset + 'px,0)';
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
