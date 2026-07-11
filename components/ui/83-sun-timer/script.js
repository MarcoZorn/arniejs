(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ringArc = document.getElementById('ringArc');
  var ringTime = document.getElementById('ringTime');
  var ringCaption = document.getElementById('ringCaption');
  var ringWrap = document.querySelector('.timer-ring');
  var startBtn = document.getElementById('startBtn');
  var pauseBtn = document.getElementById('pauseBtn');
  var resetBtn = document.getElementById('resetBtn');
  var durationSelect = document.getElementById('durationSelect');
  if (!ringArc || !ringTime) return;

  var CIRCUMFERENCE = 2 * Math.PI * 88;
  var totalSeconds = parseInt(durationSelect.value, 10);
  var remaining = totalSeconds;
  var intervalId = null;
  var running = false;

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }

  function render() {
    ringTime.textContent = formatTime(remaining);
    var fraction = totalSeconds > 0 ? remaining / totalSeconds : 0;
    var offset = CIRCUMFERENCE * (1 - fraction);
    ringArc.style.strokeDashoffset = String(offset);

    ringWrap.classList.remove('is-warning', 'is-done');
    if (remaining === 0) {
      ringWrap.classList.add('is-done');
      ringCaption.textContent = 'done';
    } else if (fraction <= 0.2) {
      ringWrap.classList.add('is-warning');
      ringCaption.textContent = running ? 'setting' : 'paused';
    } else {
      ringCaption.textContent = running ? 'setting' : (remaining === totalSeconds ? 'ready' : 'paused');
    }
  }

  function tick() {
    if (remaining <= 0) {
      stop();
      return;
    }
    remaining -= 1;
    render();
    if (remaining === 0) {
      stop();
    }
  }

  function start() {
    if (running || remaining <= 0) return;
    running = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    durationSelect.disabled = true;
    render();
    if (prefersReducedMotion) {
      // Jump straight to done for reduced motion preference, but still allow interaction.
      intervalId = setInterval(tick, 250);
    } else {
      intervalId = setInterval(tick, 1000);
    }
  }

  function stop() {
    running = false;
    startBtn.disabled = remaining === 0;
    pauseBtn.disabled = true;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    render();
  }

  function reset() {
    stop();
    totalSeconds = parseInt(durationSelect.value, 10);
    remaining = totalSeconds;
    durationSelect.disabled = false;
    startBtn.disabled = false;
    render();
  }

  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', stop);
  resetBtn.addEventListener('click', reset);
  durationSelect.addEventListener('change', function () {
    if (!running) reset();
  });

  render();
})();
