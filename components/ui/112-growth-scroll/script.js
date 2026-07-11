(function () {
  var fill = document.getElementById('progressFill');
  if (!fill) return;

  var ticking = false;

  function update() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var scrollHeight = doc.scrollHeight - doc.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
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
  update();
})();
