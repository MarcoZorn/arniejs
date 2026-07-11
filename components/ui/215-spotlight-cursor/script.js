(function () {
  var card = document.getElementById('spotlightCard');
  var glow = document.getElementById('spotlightGlow');
  if (!card || !glow) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var rafId = null;
  var pointerX = 50, pointerY = 50;

  function apply() {
    glow.style.background =
      'radial-gradient(240px circle at ' + pointerX + 'px ' + pointerY + 'px, ' +
      'rgba(212, 168, 90, 0.28), rgba(196, 98, 45, 0.14) 45%, transparent 70%)';
    rafId = null;
  }

  card.addEventListener('mouseenter', function () {
    card.classList.add('is-hovering');
  });

  card.addEventListener('mousemove', function (e) {
    var rect = card.getBoundingClientRect();
    pointerX = e.clientX - rect.left;
    pointerY = e.clientY - rect.top;
    if (!rafId) rafId = requestAnimationFrame(apply);
  });

  card.addEventListener('mouseleave', function () {
    card.classList.remove('is-hovering');
  });
})();
