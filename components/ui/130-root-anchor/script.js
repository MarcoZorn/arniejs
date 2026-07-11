(function () {
  var header = document.getElementById('stickyHeader');
  var nav = document.getElementById('anchorNav');
  var links = Array.prototype.slice.call(nav.querySelectorAll('.anchor-link'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EXTRA_GAP = 16;
  var DURATION = 700;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function getHeaderOffset() {
    return header.getBoundingClientRect().height + EXTRA_GAP;
  }

  function currentScrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  function maxScrollY() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  var activeAnimation = null;

  function smoothScrollTo(targetY) {
    var startY = currentScrollY();
    var distance = targetY - startY;

    if (reduceMotion || Math.abs(distance) < 1) {
      window.scrollTo(0, targetY);
      return;
    }

    if (activeAnimation) {
      cancelAnimationFrame(activeAnimation);
    }

    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / DURATION, 1);
      var eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        activeAnimation = requestAnimationFrame(step);
      } else {
        activeAnimation = null;
      }
    }

    activeAnimation = requestAnimationFrame(step);
  }

  function scrollToTarget(target) {
    var targetRect = target.getBoundingClientRect();
    var absoluteTop = targetRect.top + currentScrollY();
    var destination = Math.max(0, Math.min(maxScrollY(), absoluteTop - getHeaderOffset()));
    smoothScrollTo(destination);
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();

      setActive(link);
      scrollToTarget(target);

      if (history.pushState) {
        history.pushState(null, '', hash);
      }
    });
  });

  function setActive(link) {
    links.forEach(function (l) {
      l.classList.toggle('active', l === link);
    });
  }

  // Highlight the nav link matching the section currently in view.
  var sections = links.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  function syncActiveOnScroll() {
    var offset = getHeaderOffset() + 20;
    var current = sections[0];

    for (var i = 0; i < sections.length; i++) {
      var rect = sections[i].getBoundingClientRect();
      if (rect.top - offset <= 0) {
        current = sections[i];
      }
    }

    var matchingLink = links.find(function (l) {
      return l.getAttribute('href') === '#' + current.id;
    });
    if (matchingLink) {
      setActive(matchingLink);
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        syncActiveOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  syncActiveOnScroll();
})();
