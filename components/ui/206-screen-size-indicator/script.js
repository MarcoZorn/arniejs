(function () {
  var badge = document.getElementById('sizeBadge');
  var nameEl = document.getElementById('badgeName');
  var dimsEl = document.getElementById('badgeDims');

  if (!badge || !nameEl || !dimsEl) return;

  var breakpoints = [
    { name: 'xs',  min: 0 },
    { name: 'sm',  min: 480 },
    { name: 'md',  min: 768 },
    { name: 'lg',  min: 1024 },
    { name: 'xl',  min: 1280 },
    { name: '2xl', min: 1536 }
  ];

  function currentBreakpoint(width) {
    var match = breakpoints[0];
    for (var i = 0; i < breakpoints.length; i++) {
      if (width >= breakpoints[i].min) match = breakpoints[i];
    }
    return match;
  }

  function render() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var bp = currentBreakpoint(width);
    badge.setAttribute('data-bp', bp.name);
    nameEl.textContent = bp.name;
    dimsEl.textContent = width + '×' + height;
  }

  var raf = null;
  window.addEventListener('resize', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(render);
  });

  render();
})();
