(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var heads = Array.prototype.slice.call(document.querySelectorAll('.news-item-head'));
  if (!heads.length) return;

  heads.forEach(function (head) {
    head.addEventListener('click', function () {
      var bodyId = head.getAttribute('aria-controls');
      var body = document.getElementById(bodyId);
      var isOpen = head.getAttribute('aria-expanded') === 'true';

      // Collapse every other item (accordion behavior).
      heads.forEach(function (otherHead) {
        if (otherHead === head) return;
        var otherBodyId = otherHead.getAttribute('aria-controls');
        var otherBody = document.getElementById(otherBodyId);
        otherHead.setAttribute('aria-expanded', 'false');
        if (otherBody) otherBody.classList.remove('is-open');
      });

      var next = !isOpen;
      head.setAttribute('aria-expanded', String(next));
      if (body) body.classList.toggle('is-open', next);
    });
  });
})();
