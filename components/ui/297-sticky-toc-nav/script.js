(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var links = Array.prototype.slice.call(document.querySelectorAll('.toc-link'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('.toc-section'));
  if (!links.length || !sections.length) return;

  var linkByTarget = {};
  links.forEach(function (link) {
    linkByTarget[link.getAttribute('data-target')] = link;
  });

  function setActive(id) {
    links.forEach(function (link) {
      var isActive = link.getAttribute('data-target') === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Smooth scroll on click without leaving keyboard/focus behavior broken.
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('data-target');
      var section = document.getElementById(id);
      if (!section) return;
      event.preventDefault();
      section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', '#' + id);
      setActive(id);
    });
  });

  if ('IntersectionObserver' in window) {
    var visibleRatios = {};

    var observer = new IntersectionObserver(function (entries) {
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
    }, {
      root: null,
      rootMargin: '-15% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // Set an initial active item.
  setActive(sections[0].id);
})();
