(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var links = Array.prototype.slice.call(document.querySelectorAll('.side-nav__link'));
  var sections = links
    .map(function (link) {
      return document.getElementById(link.getAttribute('data-target'));
    })
    .filter(Boolean);
  var progressBar = document.getElementById('progressBar');

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(link.getAttribute('data-target'));
      if (!target) return;
      target.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start'
      });
    });
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
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.height = Math.min(100, Math.max(0, pct)) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  if (sections.length) {
    setActive(sections[0].id);
  }
})();
