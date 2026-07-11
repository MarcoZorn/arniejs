(function () {
  var btn = document.getElementById('backToSoil');
  var ringFill = document.getElementById('ringFill');
  if (!btn || !ringFill) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CIRCUMFERENCE = 2 * Math.PI * 24;
  var ticking = false;

  ringFill.style.strokeDasharray = CIRCUMFERENCE.toFixed(2);

  function update() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var scrollHeight = doc.scrollHeight - doc.clientHeight;
    var pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    pct = Math.min(1, Math.max(0, pct));

    var offset = CIRCUMFERENCE * (1 - pct);
    ringFill.style.strokeDashoffset = offset.toFixed(2);

    btn.classList.toggle('visible', scrollTop > 300);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  btn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  });

  update();
})();
