(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var trigger = document.getElementById('popoverTrigger');
  var popover = document.getElementById('popover');
  var items = popover.querySelectorAll('.pop-item');

  function positionPopover() {
    popover.classList.remove('flip');
    var rect = popover.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 8) {
      popover.classList.add('flip');
    }
  }

  function open() {
    popover.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    positionPopover();
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    popover.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick, true);
    document.removeEventListener('keydown', onKeydown);
  }

  function toggle() {
    if (popover.classList.contains('open')) {
      close();
    } else {
      open();
    }
  }

  function onDocClick(e) {
    if (!popover.contains(e.target) && e.target !== trigger) {
      close();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close();
      trigger.focus();
    }
  }

  trigger.addEventListener('click', toggle);

  items.forEach(function (item) {
    item.addEventListener('click', close);
  });

  if (reduceMotion) {
    popover.style.transition = 'none';
  }
})();
