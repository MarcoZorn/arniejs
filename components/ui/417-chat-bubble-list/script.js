(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.getElementById('bubblesList');
  if (!list) return;

  var bubbles = Array.prototype.slice.call(list.querySelectorAll('.bubble'));

  bubbles.forEach(function (bubble) {
    bubble.setAttribute('tabindex', '0');
    bubble.setAttribute('role', 'button');
    bubble.setAttribute('aria-expanded', 'false');

    function toggle() {
      var isOpen = bubble.classList.toggle('is-expanded');
      bubble.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen && !reduceMotion) {
        bubble.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }],
          { duration: 180, easing: 'ease-out' }
        );
      }
    }

    bubble.addEventListener('click', toggle);
    bubble.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Keep the conversation scrolled to the latest message on load.
  list.scrollTop = list.scrollHeight;
})();
