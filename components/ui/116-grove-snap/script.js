(function () {
  var scroller = document.getElementById('groveScroller');
  var dotsWrap = document.getElementById('groveDots');
  if (!scroller || !dotsWrap) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sections = Array.prototype.slice.call(scroller.querySelectorAll('.grove-section'));

  sections.forEach(function (section, i) {
    var dot = document.createElement('button');
    dot.className = 'grove-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to section ' + (i + 1));
    dot.addEventListener('click', function () {
      section.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
    dotsWrap.appendChild(dot);
  });

  var dots = Array.prototype.slice.call(dotsWrap.children);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        var index = sections.indexOf(entry.target);
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === index);
        });
      }
    });
  }, { root: scroller, threshold: [0.6] });

  sections.forEach(function (s) { observer.observe(s); });

  if (dots[0]) dots[0].classList.add('active');
})();
