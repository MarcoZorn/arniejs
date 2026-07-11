(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.branch-link'));
  var sections = links.map(function (link) {
    return document.getElementById(link.getAttribute('data-target'));
  });
  if (!links.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(link.getAttribute('data-target'));
      if (target) {
        target.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

  function setActive(index) {
    links.forEach(function (l, i) {
      l.classList.toggle('active', i === index);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    var visible = entries.filter(function (e) { return e.isIntersecting; });
    if (!visible.length) return;

    visible.sort(function (a, b) {
      return a.boundingClientRect.top - b.boundingClientRect.top;
    });

    var target = visible[0].target;
    var index = sections.indexOf(target);
    if (index !== -1) setActive(index);
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(function (section) {
    if (section) observer.observe(section);
  });
})();
