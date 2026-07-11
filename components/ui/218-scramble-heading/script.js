(function () {
  var heading = document.getElementById('scrambleHeading');
  var replayBtn = document.getElementById('replayBtn');
  if (!heading) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var finalText = heading.getAttribute('data-text') || heading.textContent;
  var frameId = null;
  var running = false;

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function scramble() {
    if (running) return;

    if (reduceMotion) {
      heading.textContent = finalText;
      return;
    }

    running = true;
    var revealed = 0;
    var totalFrames = finalText.length * 3;
    var frame = 0;

    function step() {
      var output = '';
      var revealThreshold = Math.floor((frame / totalFrames) * finalText.length);

      for (var i = 0; i < finalText.length; i++) {
        var ch = finalText[i];
        if (ch === ' ') {
          output += ' ';
        } else if (i < revealThreshold) {
          output += ch;
        } else {
          output += randomChar();
        }
      }

      heading.textContent = output;
      frame++;

      if (frame <= totalFrames) {
        frameId = requestAnimationFrame(step);
      } else {
        heading.textContent = finalText;
        running = false;
      }
    }

    if (frameId) cancelAnimationFrame(frameId);
    step();
  }

  scramble();

  heading.addEventListener('mouseenter', scramble);
  if (replayBtn) replayBtn.addEventListener('click', scramble);
})();
