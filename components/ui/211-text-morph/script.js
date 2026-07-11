(function () {
  var phrases = ['we grow ideas', 'we craft roots', 'we shape earth', 'we build calm'];
  var wordA = document.getElementById('morphWord1');
  var wordB = document.getElementById('morphWord2');

  if (!wordA || !wordB) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0;
  var showingA = true;
  var intervalMs = 2600;
  var timer = null;

  function nextIndex() {
    index = (index + 1) % phrases.length;
    return phrases[index];
  }

  function cycle() {
    var incoming = showingA ? wordB : wordA;
    var outgoing = showingA ? wordA : wordB;

    incoming.textContent = nextIndex();
    incoming.setAttribute('aria-hidden', 'false');
    outgoing.setAttribute('aria-hidden', 'true');

    if (reduceMotion) {
      outgoing.style.opacity = '0';
      incoming.style.opacity = '1';
      incoming.style.filter = 'none';
      incoming.style.transform = 'none';
    } else {
      outgoing.classList.add('is-leaving');
      // Force reflow so the entrance transition restarts cleanly.
      void incoming.offsetWidth;
      incoming.classList.add('is-entering');
    }

    // Reset the now-hidden element for its next turn.
    setTimeout(function () {
      outgoing.classList.remove('is-leaving');
      outgoing.classList.remove('is-entering');
    }, reduceMotion ? 0 : 720);

    showingA = !showingA;
  }

  // Prime the incoming class so the very first entrance is instant.
  wordB.classList.add('is-entering');
  wordB.setAttribute('aria-hidden', 'true');

  timer = setInterval(cycle, intervalMs);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      timer = setInterval(cycle, intervalMs);
    }
  });
})();
