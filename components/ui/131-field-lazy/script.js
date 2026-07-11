(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var frames = Array.prototype.slice.call(document.querySelectorAll('[data-lazy]'));

  function loadFrame(frame) {
    var full = frame.querySelector('.lazy-img--full');
    if (!full || full.dataset.loaded) return;
    full.dataset.loaded = 'true';

    var src = full.getAttribute('data-src');
    if (!src) return;

    var loader = new Image();
    loader.onload = function () {
      full.src = src;
      if (prefersReducedMotion) {
        frame.classList.add('is-loaded');
      } else {
        // small delay lets the browser paint the swap before transitioning
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            frame.classList.add('is-loaded');
          });
        });
      }
    };
    loader.onerror = function () {
      frame.classList.add('is-loaded');
    };
    loader.src = src;
  }

  if (!('IntersectionObserver' in window)) {
    frames.forEach(loadFrame);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadFrame(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '120px 0px', threshold: 0.05 }
  );

  frames.forEach(function (frame) {
    observer.observe(frame);
  });
})();
