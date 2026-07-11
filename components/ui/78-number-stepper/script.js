(function () {
  var stepper = document.getElementById('stepper');
  var input = document.getElementById('stepInput');
  var minusBtn = document.getElementById('stepMinus');
  var plusBtn = document.getElementById('stepPlus');

  var MIN = 0;
  var MAX = 99;
  var STEP = 1;
  var HOLD_DELAY = 500;
  var REPEAT_INTERVAL = 90;

  var value = 0;
  var holdTimeout = null;
  var repeatInterval = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(v) {
    return Math.min(MAX, Math.max(MIN, v));
  }

  function render() {
    input.value = String(value);
    minusBtn.disabled = value <= MIN;
    plusBtn.disabled = value >= MAX;
  }

  function shake() {
    if (reduceMotion) return;
    stepper.classList.remove('is-shake');
    // force reflow so the animation can restart
    void stepper.offsetWidth;
    stepper.classList.add('is-shake');
  }

  function change(delta) {
    var next = clamp(value + delta);
    if (next === value) {
      shake();
      return;
    }
    value = next;
    render();
  }

  function stopHold() {
    clearTimeout(holdTimeout);
    clearInterval(repeatInterval);
    holdTimeout = null;
    repeatInterval = null;
  }

  function startHold(delta) {
    stopHold();
    change(delta);
    holdTimeout = setTimeout(function () {
      repeatInterval = setInterval(function () {
        change(delta);
      }, REPEAT_INTERVAL);
    }, HOLD_DELAY);
  }

  function bindButton(btn, delta) {
    btn.addEventListener('pointerdown', function (e) {
      if (btn.disabled) return;
      e.preventDefault();
      startHold(delta);
    });
    btn.addEventListener('pointerup', stopHold);
    btn.addEventListener('pointerleave', stopHold);
    btn.addEventListener('pointercancel', stopHold);
  }

  bindButton(minusBtn, -STEP);
  bindButton(plusBtn, STEP);

  input.addEventListener('change', function () {
    var parsed = parseInt(input.value, 10);
    if (isNaN(parsed)) parsed = MIN;
    value = clamp(parsed);
    render();
  });

  document.addEventListener('pointerup', stopHold);

  render();
})();
