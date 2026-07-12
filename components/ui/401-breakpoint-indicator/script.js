(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var BREAKPOINTS = [
    { name: 'xs', max: 480, color: '#a03820' },
    { name: 'sm', max: 768, color: '#c4622d' },
    { name: 'md', max: 1024, color: '#d4a85a' },
    { name: 'lg', max: 1280, color: '#8fa86e' },
    { name: 'xl', max: Infinity, color: '#5a7a3a' }
  ];

  function getBreakpoint(width) {
    for (var i = 0; i < BREAKPOINTS.length; i++) {
      if (width < BREAKPOINTS[i].max) return BREAKPOINTS[i];
    }
    return BREAKPOINTS[BREAKPOINTS.length - 1];
  }

  var badge = document.createElement('div');
  badge.className = 'bpi-badge';
  badge.setAttribute('role', 'status');
  badge.setAttribute('aria-live', 'polite');

  var nameEl = document.createElement('span');
  nameEl.className = 'bpi-name';
  var widthEl = document.createElement('span');
  widthEl.className = 'bpi-width';

  badge.appendChild(nameEl);
  badge.appendChild(widthEl);
  document.body.appendChild(badge);

  function render() {
    var width = window.innerWidth;
    var bp = getBreakpoint(width);
    nameEl.textContent = bp.name;
    widthEl.textContent = width + 'px';
    badge.style.background = bp.color;
  }

  var throttleId = null;
  function onResize() {
    if (throttleId) return;
    throttleId = window.requestAnimationFrame(function () {
      render();
      throttleId = null;
    });
  }

  window.addEventListener('resize', onResize);
  render();
})();
