(function () {
  var track = document.getElementById('relatedTrack');
  var prevBtn = document.getElementById('scrollPrev');
  var nextBtn = document.getElementById('scrollNext');

  if (!track) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function step() {
    var card = track.querySelector('.teaser');
    var gap = 20;
    return card ? card.getBoundingClientRect().width + gap : 320;
  }

  function scrollByStep(direction) {
    track.scrollBy({
      left: direction * step(),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  prevBtn.addEventListener('click', function () { scrollByStep(-1); });
  nextBtn.addEventListener('click', function () { scrollByStep(1); });

  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByStep(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByStep(-1);
    }
  });

  function updateArrowState() {
    var maxScroll = track.scrollWidth - track.clientWidth - 2;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
    prevBtn.style.opacity = prevBtn.disabled ? '.4' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '.4' : '1';
  }

  track.addEventListener('scroll', updateArrowState, { passive: true });
  window.addEventListener('resize', updateArrowState);
  updateArrowState();
})();
