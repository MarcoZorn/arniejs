(function () {
  var links = document.querySelectorAll('#tocList a');
  var sections = document.querySelectorAll('.article section[id]');

  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  var linkByTarget = {};
  links.forEach(function (link) {
    linkByTarget[link.getAttribute('data-target')] = link;
  });

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-target') === id);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-15% 0px -70% 0px',
      threshold: 0
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('data-target');
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      setActive(targetId);
    });
  });

  if (sections[0]) setActive(sections[0].id);
})();
