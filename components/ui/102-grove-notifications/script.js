(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stack = document.getElementById('toastStack');
  var buttons = document.querySelectorAll('.trigger');

  var content = {
    moss: { title: 'Planted successfully', msg: 'Your seedlings are in the ground.', icon: '✓' },
    terra: { title: 'Weather update', msg: 'Light rain expected this evening.', icon: 'i' },
    rust: { title: 'Frost warning', msg: 'Cover tender plants tonight.', icon: '!' }
  };

  var AUTO_DISMISS = 4000;

  function addToast(type) {
    var info = content[type] || content.terra;
    var toast = document.createElement('div');
    toast.className = 'toast type-' + type;
    toast.innerHTML =
      '<div class="toast-icon">' + info.icon + '</div>' +
      '<div class="toast-content">' +
      '<div class="toast-title">' + info.title + '</div>' +
      '<div class="toast-msg">' + info.msg + '</div>' +
      '</div>' +
      '<button class="toast-close" aria-label="Dismiss">&times;</button>' +
      (reduceMotion ? '' : '<div class="toast-progress"></div>');

    stack.prepend(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('show');
      });
    });

    var timer = setTimeout(function () { dismiss(toast); }, AUTO_DISMISS);

    toast.querySelector('.toast-close').addEventListener('click', function () {
      clearTimeout(timer);
      dismiss(toast);
    });
  }

  function dismiss(toast) {
    toast.classList.add('leaving');
    toast.classList.remove('show');
    if (reduceMotion) {
      toast.remove();
    } else {
      toast.addEventListener('transitionend', function handler() {
        toast.removeEventListener('transitionend', handler);
        toast.remove();
      });
      setTimeout(function () {
        if (toast.parentNode) toast.remove();
      }, 500);
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      addToast(btn.getAttribute('data-type'));
    });
  });
})();
