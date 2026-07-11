(function () {
  var heading = document.getElementById('magnetic');
  if (!heading) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var radius = 90;
  var strength = 0.45;

  var text = heading.textContent;
  heading.textContent = '';
  heading.setAttribute('aria-hidden', 'false');

  var letters = [];
  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    var span = document.createElement('span');
    span.className = 'magnetic__letter';
    span.textContent = ch === ' ' ? ' ' : ch;
    heading.appendChild(span);
    letters.push(span);
  }

  if (reduceMotion) return;

  var rafId = null;

  function handleMove(e) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () {
      letters.forEach(function (letter) {
        var rect = letter.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          var pull = (1 - dist / radius) * strength;
          var tx = -dx * pull;
          var ty = -dy * pull;
          letter.style.transform = 'translate(' + tx.toFixed(2) + 'px, ' + ty.toFixed(2) + 'px)';
          letter.classList.add('is-near');
        } else {
          letter.style.transform = 'translate(0, 0)';
          letter.classList.remove('is-near');
        }
      });
    });
  }

  function handleLeave() {
    letters.forEach(function (letter) {
      letter.style.transform = 'translate(0, 0)';
      letter.classList.remove('is-near');
    });
  }

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseleave', handleLeave);
})();
