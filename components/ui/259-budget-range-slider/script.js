(function () {
  var root = document.querySelector('.br-wrap');
  if (!root) return;

  var track = root.querySelector('.br-track');
  var fill = root.querySelector('[data-fill]');
  var minThumb = root.querySelector('[data-thumb="min"]');
  var maxThumb = root.querySelector('[data-thumb="max"]');
  var minLabel = root.querySelector('[data-label="min"]');
  var maxLabel = root.querySelector('[data-label="max"]');
  var summary = root.querySelector('.br-summary');

  var RANGE_MIN = 0;
  var RANGE_MAX = 2000;
  var STEP = 10;
  var MIN_GAP = 50;

  var state = { min: 250, max: 1800 };

  function formatMoney(n) {
    return '$' + n.toLocaleString('en-US');
  }

  function valueToPercent(v) {
    return ((v - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;
  }

  function render() {
    var minPct = valueToPercent(state.min);
    var maxPct = valueToPercent(state.max);
    minThumb.style.left = minPct + '%';
    maxThumb.style.left = maxPct + '%';
    fill.style.left = minPct + '%';
    fill.style.right = (100 - maxPct) + '%';
    minThumb.setAttribute('aria-valuenow', state.min);
    maxThumb.setAttribute('aria-valuenow', state.max);
    minLabel.textContent = formatMoney(state.min);
    maxLabel.textContent = formatMoney(state.max);
    summary.textContent = formatMoney(state.min) + ' – ' + formatMoney(state.max);
  }

  function clampStep(v) {
    return Math.round(v / STEP) * STEP;
  }

  function setMin(v) {
    v = clampStep(Math.max(RANGE_MIN, Math.min(v, state.max - MIN_GAP)));
    state.min = v;
    render();
  }

  function setMax(v) {
    v = clampStep(Math.min(RANGE_MAX, Math.max(v, state.min + MIN_GAP)));
    state.max = v;
    render();
  }

  function positionToValue(clientX) {
    var rect = track.getBoundingClientRect();
    var pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    return RANGE_MIN + pct * (RANGE_MAX - RANGE_MIN);
  }

  function bindDrag(thumb, setter) {
    function onMove(clientX) {
      setter(positionToValue(clientX));
    }

    thumb.addEventListener('mousedown', function (e) {
      e.preventDefault();
      thumb.focus();
      function mouseMove(ev) { onMove(ev.clientX); }
      function mouseUp() {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      }
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    });

    thumb.addEventListener('touchstart', function (e) {
      thumb.focus();
      function touchMove(ev) {
        if (ev.touches[0]) onMove(ev.touches[0].clientX);
        ev.preventDefault();
      }
      function touchEnd() {
        document.removeEventListener('touchmove', touchMove);
        document.removeEventListener('touchend', touchEnd);
      }
      document.addEventListener('touchmove', touchMove, { passive: false });
      document.addEventListener('touchend', touchEnd);
    }, { passive: true });

    thumb.addEventListener('keydown', function (e) {
      var delta = 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = STEP;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -STEP;
      else if (e.key === 'Home') delta = 'home';
      else if (e.key === 'End') delta = 'end';
      else return;

      e.preventDefault();
      var current = thumb === minThumb ? state.min : state.max;
      var next;
      if (delta === 'home') next = RANGE_MIN;
      else if (delta === 'end') next = RANGE_MAX;
      else next = current + delta;

      if (thumb === minThumb) setMin(next);
      else setMax(next);
    });
  }

  bindDrag(minThumb, setMin);
  bindDrag(maxThumb, setMax);

  track.addEventListener('click', function (e) {
    if (e.target === minThumb || e.target === maxThumb) return;
    var value = positionToValue(e.clientX);
    if (Math.abs(value - state.min) <= Math.abs(value - state.max)) {
      setMin(value);
    } else {
      setMax(value);
    }
  });

  render();
})();
