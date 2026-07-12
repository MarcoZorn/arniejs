(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nav = document.querySelector('.bci-nav');
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll('.bci-link'));

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      // These crumbs point at placeholder anchors in this standalone demo,
      // so keep the page from jumping while still giving tactile feedback.
      e.preventDefault();

      if (reduceMotion) return;

      link.animate(
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(-1px)' },
          { transform: 'translateY(0)' }
        ],
        { duration: 160, easing: 'ease-out' }
      );
    });
  });
})();
