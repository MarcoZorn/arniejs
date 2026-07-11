(function () {
  var stage = document.getElementById('revealStage');
  if (!stage) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var maxTilt = 10;
  var rafId = null;
  var pending = null;

  function apply() {
    if (!pending) { rafId = null; return; }
    var rect = stage.getBoundingClientRect();
    var px = (pending.x - rect.left) / rect.width;
    var py = (pending.y - rect.top) / rect.height;
    var rotateY = (px - 0.5) * (maxTilt * 2);
    var rotateX = (0.5 - py) * (maxTilt * 2);
    stage.style.transform = 'rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
    pending = null;
    rafId = null;
  }

  stage.addEventListener('mouseenter', function () {
    stage.classList.add('is-flipped');
  });

  stage.addEventListener('mouseleave', function () {
    stage.classList.remove('is-flipped');
    stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });

  stage.addEventListener('focus', function () {
    stage.classList.add('is-flipped');
  });

  stage.addEventListener('blur', function () {
    stage.classList.remove('is-flipped');
    stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });

  if (reduceMotion) return;

  stage.addEventListener('mousemove', function (e) {
    pending = { x: e.clientX, y: e.clientY };
    if (!rafId) rafId = requestAnimationFrame(apply);
  });

  stage.setAttribute('tabindex', '0');
})();
