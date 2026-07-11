(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var frame = document.querySelector('.distort-frame');
  var map = document.getElementById('distortMap');
  var noise = document.getElementById('distortNoise');

  if (!frame || !map || prefersReducedMotion) return;

  var current = 0;
  var target = 0;
  var lastX = null;
  var lastY = null;
  var rafId = null;

  function tick() {
    current += (target - current) * 0.15;
    map.setAttribute('scale', current.toFixed(2));

    if (Math.abs(target - current) > 0.1 || target > 0) {
      target *= 0.9;
      rafId = requestAnimationFrame(tick);
    } else {
      map.setAttribute('scale', 0);
      rafId = null;
    }
  }

  function startLoop() {
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  }

  frame.addEventListener('pointermove', function (e) {
    var rect = frame.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    if (lastX !== null) {
      var dx = x - lastX;
      var dy = y - lastY;
      var speed = Math.sqrt(dx * dx + dy * dy);
      target = Math.min(target + speed * 1.2, 90);
    }

    lastX = x;
    lastY = y;
    startLoop();
  });

  frame.addEventListener('pointerleave', function () {
    lastX = null;
    lastY = null;
  });

  frame.addEventListener('pointerdown', function () {
    var seed = Math.floor(Math.random() * 100);
    noise.setAttribute('seed', String(seed));
  });
})();
