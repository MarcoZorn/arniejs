(function () {
  var nav = document.getElementById('spyNav');
  var underline = document.getElementById('spyUnderline');
  var scrollArea = document.getElementById('scrollArea');
  if (!nav || !underline || !scrollArea) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll('.spy-link'));
  var sections = links.map(function (link) {
    return document.getElementById(link.dataset.target);
  });

  function moveUnderline(link, instant) {
    var navRect = nav.getBoundingClientRect();
    var rect = link.getBoundingClientRect();
    if (instant) underline.style.transition = 'none';
    underline.style.left = (rect.left - navRect.left) + 'px';
    underline.style.width = rect.width + 'px';
    if (instant) {
      underline.offsetHeight;
      underline.style.transition = '';
    }
  }

  function setActive(link) {
    links.forEach(function (l) { l.classList.remove('active'); });
    link.classList.add('active');
    moveUnderline(link, false);
  }

  function updateFromScroll() {
    var areaTop = scrollArea.getBoundingClientRect().top;
    var scrollPos = scrollArea.scrollTop + 40;
    var current = sections[0];
    var currentIndex = 0;
    sections.forEach(function (sec, i) {
      if (!sec) return;
      if (sec.offsetTop <= scrollPos) {
        current = sec;
        currentIndex = i;
      }
    });
    if (current) setActive(links[currentIndex]);
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = sections[i];
      if (target) {
        scrollArea.scrollTo({
          top: target.offsetTop - 4,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
      setActive(link);
    });
  });

  var ticking = false;
  scrollArea.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateFromScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener('resize', function () {
    var active = nav.querySelector('.spy-link.active');
    if (active) moveUnderline(active, true);
  });

  requestAnimationFrame(function () {
    moveUnderline(links[0], true);
  });
})();
