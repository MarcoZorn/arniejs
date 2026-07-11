(function () {
  const accordion = document.getElementById('accordion');
  if (!accordion) return;

  const single = accordion.dataset.single === 'true';
  const triggers = Array.from(accordion.querySelectorAll('.trigger'));

  function toggle(trigger) {
    const item = trigger.closest('.item');
    const isOpen = item.classList.contains('is-open');

    if (single && !isOpen) {
      triggers.forEach((t) => {
        if (t !== trigger) {
          t.closest('.item').classList.remove('is-open');
          t.setAttribute('aria-expanded', 'false');
        }
      });
    }

    item.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
  }

  triggers.forEach((trigger, i) => {
    trigger.addEventListener('click', () => toggle(trigger));
    trigger.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
        e.preventDefault();
        let next = i;
        if (key === 'ArrowDown') next = (i + 1) % triggers.length;
        if (key === 'ArrowUp') next = (i - 1 + triggers.length) % triggers.length;
        if (key === 'Home') next = 0;
        if (key === 'End') next = triggers.length - 1;
        triggers[next].focus();
      }
    });
  });
})();
