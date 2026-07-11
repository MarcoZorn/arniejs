(function () {
  const toaster = document.getElementById('toaster');
  const tpl = document.getElementById('toast-tpl');
  if (!toaster || !tpl) return;

  const LIFE = 4000;
  const PRESETS = {
    success: { icon: '✓', title: 'Success', msg: 'Your changes have been saved.' },
    error:   { icon: '✕', title: 'Error',   msg: 'Something went wrong. Please try again.' },
    info:    { icon: 'i', title: 'Heads up', msg: 'A new update is available.' },
    warning: { icon: '!', title: 'Warning',  msg: 'Your session expires soon.' }
  };

  function dismiss(toast) {
    if (toast.dataset.closing) return;
    toast.dataset.closing = '1';
    clearTimeout(toast._timer);
    toast.classList.add('is-out');
    toast.classList.remove('is-in');
    const done = () => toast.remove();
    toast.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 500); // fallback if transitionend doesn't fire
  }

  function spawn(type) {
    const p = PRESETS[type] || PRESETS.info;
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.classList.add('toast--' + type);
    node.style.setProperty('--life', LIFE + 'ms');
    node.querySelector('.toast__icon').textContent = p.icon;
    node.querySelector('.toast__title').textContent = p.title;
    node.querySelector('.toast__msg').textContent = p.msg;
    if (type === 'error') node.setAttribute('role', 'alert');

    node.querySelector('.toast__close').addEventListener('click', () => dismiss(node));

    // pause auto-dismiss on hover
    node.addEventListener('mouseenter', () => {
      clearTimeout(node._timer);
      const bar = node.querySelector('.toast__bar');
      bar.style.animationPlayState = 'paused';
    });
    node.addEventListener('mouseleave', () => {
      const bar = node.querySelector('.toast__bar');
      bar.style.animationPlayState = 'running';
      node._timer = setTimeout(() => dismiss(node), LIFE);
    });

    toaster.appendChild(node);
    requestAnimationFrame(() => requestAnimationFrame(() => node.classList.add('is-in')));
    node._timer = setTimeout(() => dismiss(node), LIFE);
  }

  document.querySelectorAll('[data-toast]').forEach((btn) => {
    btn.addEventListener('click', () => spawn(btn.dataset.toast));
  });
})();
