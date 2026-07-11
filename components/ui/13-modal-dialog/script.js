(function () {
  const openBtn = document.getElementById('open-modal');
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('backdrop');
  const closeX = document.getElementById('close-x');
  const cancel = document.getElementById('cancel');
  const form = document.getElementById('modal-form');
  if (!openBtn || !modal || !backdrop) return;

  const SELECTOR = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function focusables() {
    return Array.from(modal.querySelectorAll(SELECTOR)).filter((el) => el.offsetParent !== null);
  }

  function open() {
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    modal.hidden = false;
    // force reflow so transitions run from the hidden state
    void modal.offsetWidth;
    backdrop.classList.add('is-open');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const first = focusables()[0];
    if (first) first.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    backdrop.classList.remove('is-open');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    const done = () => {
      modal.hidden = true;
      backdrop.hidden = true;
    };
    modal.querySelector('.modal__card').addEventListener('transitionend', done, { once: true });
    setTimeout(done, 400); // fallback
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  openBtn.addEventListener('click', open);
  closeX.addEventListener('click', close);
  cancel.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    close();
  });
})();
