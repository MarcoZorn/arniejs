(function () {
  'use strict';

  var slider = document.querySelector('.slider');
  var fill = slider.querySelector('[data-fill]');
  var output = document.querySelector('[data-output]');
  var handles = {
    low: slider.querySelector('[data-handle="low"]'),
    high: slider.querySelector('[data-handle="high"]')
  };

  var MIN = +slider.dataset.min;
  var MAX = +slider.dataset.max;
  var STEP = +slider.dataset.step;
  var state = { low: +slider.dataset.low, high: +slider.dataset.high };

  function money(v) { return '€' + Math.round(v).toLocaleString('en-US'); }
  function snap(v) { return Math.round((v - MIN) / STEP) * STEP + MIN; }
  function clamp(v) { return Math.min(MAX, Math.max(MIN, v)); }
  function pct(v) { return (v - MIN) / (MAX - MIN) * 100; }

  function render() {
    var lp = pct(state.low), hp = pct(state.high);
    handles.low.style.left = lp + '%';
    handles.high.style.left = hp + '%';
    fill.style.left = lp + '%';
    fill.style.right = (100 - hp) + '%';

    handles.low.querySelector('[data-tip]').textContent = money(state.low);
    handles.high.querySelector('[data-tip]').textContent = money(state.high);

    handles.low.setAttribute('aria-valuenow', state.low);
    handles.high.setAttribute('aria-valuenow', state.high);
    handles.low.setAttribute('aria-valuemax', state.high);
    handles.high.setAttribute('aria-valuemin', state.low);

    output.textContent = money(state.low) + ' – ' + money(state.high);
  }

  function setValue(which, raw) {
    var v = clamp(snap(raw));
    if (which === 'low') v = Math.min(v, state.high);
    else v = Math.max(v, state.low);
    state[which] = v;
    render();
  }

  function posToValue(clientX) {
    var r = slider.getBoundingClientRect();
    var ratio = (clientX - r.left) / r.width;
    return MIN + ratio * (MAX - MIN);
  }

  function startDrag(which, pointerId) {
    var handle = handles[which];
    handle.classList.add('is-drag');

    function move(e) { setValue(which, posToValue(e.clientX)); }
    function up() {
      handle.classList.remove('is-drag');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  ['low', 'high'].forEach(function (which) {
    var handle = handles[which];
    handle.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      handle.focus();
      startDrag(which, e.pointerId);
    });
    handle.addEventListener('keydown', function (e) {
      var d = 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d = STEP;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d = -STEP;
      else if (e.key === 'PageUp') d = STEP * 10;
      else if (e.key === 'PageDown') d = -STEP * 10;
      else if (e.key === 'Home') { setValue(which, which === 'low' ? MIN : state.low); e.preventDefault(); return; }
      else if (e.key === 'End') { setValue(which, which === 'high' ? MAX : state.high); e.preventDefault(); return; }
      else return;
      e.preventDefault();
      setValue(which, state[which] + d);
    });
  });

  // Click on rail jumps nearest handle
  slider.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.slider__handle')) return;
    var v = posToValue(e.clientX);
    var which = Math.abs(v - state.low) <= Math.abs(v - state.high) ? 'low' : 'high';
    setValue(which, v);
    handles[which].focus();
    startDrag(which, e.pointerId);
  });

  render();
})();
