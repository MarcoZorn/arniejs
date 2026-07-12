(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var trigger = document.querySelector('[data-start]');
  var region = document.querySelector('.progresstoast-region');
  if (!trigger || !region) return;

  var TOTAL_DURATION = 3200; // ms, simulated upload time

  trigger.addEventListener('click', function () {
    startUpload();
  });

  function startUpload() {
    trigger.disabled = true;

    var toast = document.createElement('div');
    toast.className = 'progresstoast-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<div class="progresstoast-head">' +
        '<span class="progresstoast-icon" aria-hidden="true"></span>' +
        '<span class="progresstoast-label">Uploading field data&hellip;</span>' +
        '<span class="progresstoast-pct">0%</span>' +
      '</div>' +
      '<div class="progresstoast-track">' +
        '<div class="progresstoast-bar"></div>' +
      '</div>';

    region.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });

    var bar = toast.querySelector('.progresstoast-bar');
    var pct = toast.querySelector('.progresstoast-pct');
    var label = toast.querySelector('.progresstoast-label');

    var startTime = null;

    function tick(timestamp) {
      if (startTime === null) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(1, elapsed / TOTAL_DURATION);
      var percent = Math.round(progress * 100);

      bar.style.width = percent + '%';
      pct.textContent = percent + '%';

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        completeUpload(toast, bar, pct, label);
      }
    }

    if (reduceMotion) {
      // Jump straight to completion, no animated ramp.
      bar.style.width = '100%';
      pct.textContent = '100%';
      completeUpload(toast, bar, pct, label);
    } else {
      requestAnimationFrame(tick);
    }
  }

  function completeUpload(toast, bar, pct, label) {
    toast.classList.add('is-complete');
    label.textContent = 'Complete';
    pct.textContent = '100%';
    bar.style.width = '100%';
    trigger.disabled = false;

    var lingerTime = reduceMotion ? 400 : 1800;

    window.setTimeout(function () {
      toast.classList.add('is-leaving');
      toast.classList.remove('is-visible');

      var removed = false;
      var remove = function () {
        if (removed) return;
        removed = true;
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      };

      if (reduceMotion) {
        remove();
        return;
      }

      toast.addEventListener('transitionend', remove);
      window.setTimeout(remove, 500);
    }, lingerTime);
  }
})();
