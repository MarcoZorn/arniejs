(function () {
  var trigger = document.getElementById('trigger');
  var region = document.getElementById('toastRegion');
  if (!trigger || !region) return;

  var messages = [
    { title: 'Backup complete', msg: 'All project files were synced.' },
    { title: 'New comment', msg: 'Someone replied on your design.' },
    { title: 'Update available', msg: 'Version 2.4 is ready to install.' },
    { title: 'Storage warning', msg: '90% of your space is used.' }
  ];

  var count = 0;
  var MAX_VISIBLE = 4;

  function removeToast(toast) {
    if (!toast || toast.dataset.leaving) return;
    toast.dataset.leaving = 'true';
    toast.classList.add('is-leaving');
    toast.addEventListener('animationend', function () {
      toast.remove();
    });
    // Fallback for reduced-motion (no animationend fires).
    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 400);
  }

  function addToast() {
    var data = messages[count % messages.length];
    count += 1;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<span class="toast__icon">!</span>' +
      '<span class="toast__body">' +
        '<p class="toast__title"></p>' +
        '<p class="toast__msg"></p>' +
      '</span>' +
      '<button class="toast__close" type="button" aria-label="Dismiss">&times;</button>';

    toast.querySelector('.toast__title').textContent = data.title;
    toast.querySelector('.toast__msg').textContent = data.msg;

    toast.querySelector('.toast__close').addEventListener('click', function () {
      removeToast(toast);
    });

    region.appendChild(toast);

    while (region.children.length > MAX_VISIBLE) {
      removeToast(region.children[0]);
    }

    setTimeout(function () {
      removeToast(toast);
    }, 4500);
  }

  trigger.addEventListener('click', addToast);

  addToast();
})();
