(function () {
  var stage = document.getElementById('blobStage');
  var blob = document.getElementById('blobCursor');
  if (!stage || !blob) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var targetX = 0, targetY = 0;
  var curX = 0, curY = 0;
  var ease = 0.16;
  var rafId = null;
  var shapes = [
    '46% 54% 60% 40% / 50% 45% 55% 50%',
    '58% 42% 38% 62% / 40% 60% 40% 60%',
    '40% 60% 55% 45% / 55% 40% 60% 45%',
    '52% 48% 44% 56% / 48% 58% 42% 52%'
  ];
  var shapeIndex = 0;

  function loop() {
    curX += (targetX - curX) * ease;
    curY += (targetY - curY) * ease;
    blob.style.transform = 'translate(' + curX.toFixed(1) + 'px, ' + curY.toFixed(1) + 'px)';
    rafId = requestAnimationFrame(loop);
  }

  function shapeShift() {
    shapeIndex = (shapeIndex + 1) % shapes.length;
    blob.style.borderRadius = shapes[shapeIndex];
  }

  stage.addEventListener('mouseenter', function (e) {
    var rect = stage.getBoundingClientRect();
    targetX = curX = e.clientX - rect.left;
    targetY = curY = e.clientY - rect.top;
    stage.classList.add('is-active');
    if (!rafId) rafId = requestAnimationFrame(loop);
  });

  stage.addEventListener('mousemove', function (e) {
    var rect = stage.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  });

  stage.addEventListener('mouseleave', function () {
    stage.classList.remove('is-active');
  });

  setInterval(shapeShift, 1800);
})();
