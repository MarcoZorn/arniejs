(function () {
  var fill = document.getElementById('progressFill');
  var pct = document.getElementById('progressPct');
  if (!fill || !pct) return;

  var circumference = 138.2;
  var ticking = false;

  function update() {
    ticking = false;
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var maxScroll = (doc.scrollHeight - doc.clientHeight) || 1;
    var progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

    fill.style.strokeDashoffset = String(circumference * (1 - progress));
    pct.textContent = Math.round(progress * 100) + '%';
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
