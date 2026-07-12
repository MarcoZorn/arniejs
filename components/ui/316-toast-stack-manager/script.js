(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var region = document.querySelector('.toaststack-region');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.toaststack-btn'));
  if (!region || !buttons.length) return;

  var COPY = {
    success: { title: 'Saved', msg: 'Your changes took root just fine.' },
    error: { title: 'Something snagged', msg: 'That action could not be completed.' },
    info: { title: 'Heads up', msg: 'A quiet update worth noticing.' }
  };

  var DURATION = 5000;
  var counter = 0;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      spawnToast(btn.getAttribute('data-variant'));
    });
  });

  function spawnToast(variant) {
    var copy = COPY[variant] || COPY.info;
    counter += 1;
    var id = 'toaststack-toast-' + counter;

    var toast = document.createElement('div');
    toast.className = 'toaststack-toast toaststack-toast--' + variant;
    toast.setAttribute('role', variant === 'error' ? 'alert' : 'status');
    toast.setAttribute('id', id);

    toast.innerHTML =
      '<span class="toaststack-icon" aria-hidden="true"></span>' +
      '<div class="toaststack-body">' +
        '<p class="toaststack-toast-title"></p>' +
        '<p class="toaststack-toast-msg"></p>' +
      '</div>' +
      '<button class="toaststack-close" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>' +
      '<div class="toaststack-progress"></div>';

    toast.querySelector('.toaststack-toast-title').textContent = copy.title;
    toast.querySelector('.toaststack-toast-msg').textContent = copy.msg;

    region.appendChild(toast);

    // force layout then reveal, so the enter transition actually runs
    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });

    var progressEl = toast.querySelector('.toaststack-progress');
    var closeBtn = toast.querySelector('.toaststack-close');
    var dismissed = false;
    var timeoutId;

    if (reduceMotion) {
      progressEl.style.display = 'none';
    } else {
      progressEl.animate(
        [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }],
        { duration: DURATION, easing: 'linear', fill: 'forwards' }
      );
    }

    timeoutId = window.setTimeout(function () {
      dismiss();
    }, DURATION);

    closeBtn.addEventListener('click', function () {
      window.clearTimeout(timeoutId);
      dismiss();
    });

    function dismiss() {
      if (dismissed) return;
      dismissed = true;

      if (reduceMotion) {
        remove();
        return;
      }

      toast.classList.add('is-leaving');
      var removed = false;
      toast.addEventListener('transitionend', function handler() {
        if (removed) return;
        removed = true;
        toast.removeEventListener('transitionend', handler);
        remove();
      });
      // fallback in case transitionend doesn't fire
      window.setTimeout(function () {
        if (!removed) {
          removed = true;
          remove();
        }
      }, 500);
    }

    function remove() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }
  }
})();
