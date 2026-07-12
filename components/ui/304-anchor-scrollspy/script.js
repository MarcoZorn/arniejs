(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var links = Array.prototype.slice.call(document.querySelectorAll('.spy-link'));
  var sections = links
    .map(function (link) {
      return document.getElementById(link.getAttribute('data-target'));
    })
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  function setActive(id) {
    links.forEach(function (link) {
      var isTarget = link.getAttribute('data-target') === id;
      link.classList.toggle('is-active', isTarget);
      if (isTarget) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Click: smooth-scroll (unless reduced motion) and set active state immediately.
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('data-target');
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', '#' + id);
      setActive(id);
    });
  });

  // IntersectionObserver keeps the active link synced while scrolling.
  if ('IntersectionObserver' in window) {
    var visibleRatios = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visibleRatios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        var bestId = null;
        var bestRatio = 0;
        sections.forEach(function (section) {
          var ratio = visibleRatios[section.id] || 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = section.id;
          }
        });

        if (bestId) setActive(bestId);
      },
      {
        rootMargin: '-96px 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // Honor a direct link with a hash on load.
  if (window.location.hash) {
    var initial = document.getElementById(window.location.hash.slice(1));
    if (initial) {
      setActive(initial.id);
      window.setTimeout(function () {
        initial.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 0);
    }
  }
})();
