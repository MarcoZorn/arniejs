(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.recent-wrap');
  if (!wrap) return;

  var strip = wrap.querySelector('[data-strip]');
  var buttons = Array.prototype.slice.call(wrap.querySelectorAll('[data-scroll]'));
  if (!strip) return;

  function cardWidth() {
    var card = strip.querySelector('.recent-card');
    if (!card) return 200;
    var style = window.getComputedStyle(strip);
    var gap = parseFloat(style.columnGap || style.gap || '16') || 16;
    return card.getBoundingClientRect().width + gap;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = btn.getAttribute('data-scroll') === 'prev' ? -1 : 1;
      var amount = dir * cardWidth();
      strip.scrollBy({
        left: amount,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

  // Keyboard support when the strip itself is focused.
  strip.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      strip.scrollBy({ left: cardWidth(), behavior: reduceMotion ? 'auto' : 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      strip.scrollBy({ left: -cardWidth(), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });
})();
