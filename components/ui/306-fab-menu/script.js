(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var root = document.querySelector('.fab-root');
  var toggle = document.getElementById('fabToggle');
  var stack = document.getElementById('fabStack');
  var note = document.getElementById('fabNote');
  if (!root || !toggle || !stack || !note) return;

  var actions = Array.prototype.slice.call(stack.querySelectorAll('.fab-action'));
  var noteTimer = null;
  var isOpen = false;

  function openMenu() {
    isOpen = true;
    root.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close quick actions');
    stack.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutsideClick, true);
    var delay = reduceMotion ? 0 : 30;
    window.setTimeout(function () {
      if (actions[0]) actions[0].focus();
    }, delay);
  }

  function closeMenu(returnFocus) {
    isOpen = false;
    root.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open quick actions');
    stack.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutsideClick, true);
    if (returnFocus) toggle.focus();
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      var index = actions.indexOf(document.activeElement);
      if (index === -1) index = 0;
      var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
      if (next < 0) next = actions.length - 1;
      if (next >= actions.length) next = 0;
      actions[next].focus();
    }
  }

  function onOutsideClick(event) {
    if (!root.contains(event.target)) {
      closeMenu(false);
    }
  }

  toggle.addEventListener('click', function () {
    if (isOpen) {
      closeMenu(false);
    } else {
      openMenu();
    }
  });

  actions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var message = btn.getAttribute('data-action') || 'Done';
      note.textContent = message;
      note.classList.add('is-visible');
      window.clearTimeout(noteTimer);
      noteTimer = window.setTimeout(function () {
        note.classList.remove('is-visible');
      }, 2200);
      closeMenu(true);
    });
  });
})();
