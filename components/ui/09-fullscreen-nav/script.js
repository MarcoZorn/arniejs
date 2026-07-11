(function () {
  const burger = document.getElementById('burger');
  const overlay = document.getElementById('overlay');
  if (!burger || !overlay) return;

  let open = false;

  function setState(next) {
    open = next;
    burger.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    overlay.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const first = overlay.querySelector('a');
      if (first) first.focus();
    } else {
      burger.focus();
    }
  }

  burger.addEventListener('click', () => setState(!open));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setState(false);
  });

  overlay.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setState(false));
  });
})();
