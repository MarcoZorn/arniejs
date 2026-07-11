(function () {
  var stage = document.getElementById('emberStage');
  var canvas = document.getElementById('emberCanvas');
  if (!stage || !canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var dpr = window.devicePixelRatio || 1;
  var rafId = null;
  var colors = ['#d4a85a', '#c4622d', '#a03820', '#f0c98a'];

  function resize() {
    var rect = stage.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  function addParticle(x, y) {
    particles.push({
      x: x,
      y: y,
      r: 4 + Math.random() * 6,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6
    });
    if (particles.length > 160) particles.shift();
  }

  stage.addEventListener('mousemove', function (e) {
    var rect = stage.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    addParticle(x, y);
    addParticle(x + (Math.random() - 0.5) * 6, y + (Math.random() - 0.5) * 6);
  });

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life -= 0.02;
      p.x += p.dx;
      p.y += p.dy;
      p.r *= 0.985;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      grad.addColorStop(0, hexToRgba(p.color, p.life * 0.9));
      grad.addColorStop(1, hexToRgba(p.color, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    rafId = requestAnimationFrame(render);
  }

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  rafId = requestAnimationFrame(render);
})();
