(function () {
  'use strict';

  var root = document.querySelector('[data-select]');
  var trigger = root.querySelector('[data-trigger]');
  var list = root.querySelector('[data-list]');
  var options = Array.prototype.slice.call(root.querySelectorAll('.select__option'));
  var valueEl = root.querySelector('[data-value]');
  var iconEl = root.querySelector('[data-current-icon]');

  var open = false;
  var activeIndex = options.findIndex(function (o) { return o.classList.contains('is-selected'); });
  if (activeIndex < 0) activeIndex = 0;
  var typeBuffer = '';
  var typeTimer;

  options.forEach(function (o, i) { o.id = 'ws-opt-' + i; });

  function setActive(i) {
    activeIndex = i;
    options.forEach(function (o, k) { o.classList.toggle('is-active', k === i); });
    var opt = options[i];
    list.setAttribute('aria-activedescendant', opt.id);
    var top = opt.offsetTop, bottom = top + opt.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }

  function openList() {
    if (open) return;
    open = true;
    root.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    setActive(activeIndex);
    list.focus();
  }

  function closeList(focusTrigger) {
    if (!open) return;
    open = false;
    root.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    list.removeAttribute('aria-activedescendant');
    if (focusTrigger) trigger.focus();
  }

  function choose(i) {
    options.forEach(function (o, k) {
      var on = k === i;
      o.classList.toggle('is-selected', on);
      o.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    var opt = options[i];
    valueEl.textContent = opt.dataset.val;
    iconEl.textContent = opt.dataset.icon;
    activeIndex = i;
  }

  trigger.addEventListener('click', function () {
    open ? closeList(true) : openList();
  });

  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openList();
    }
  });

  options.forEach(function (opt, i) {
    opt.addEventListener('mouseenter', function () { setActive(i); });
    opt.addEventListener('click', function () { choose(i); closeList(true); });
  });

  list.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); setActive((activeIndex + 1) % options.length); break;
      case 'ArrowUp':
        e.preventDefault(); setActive((activeIndex - 1 + options.length) % options.length); break;
      case 'Home':
        e.preventDefault(); setActive(0); break;
      case 'End':
        e.preventDefault(); setActive(options.length - 1); break;
      case 'Enter':
      case ' ':
        e.preventDefault(); choose(activeIndex); closeList(true); break;
      case 'Escape':
        e.preventDefault(); closeList(true); break;
      case 'Tab':
        closeList(false); break;
      default:
        if (e.key.length === 1) typeAhead(e.key);
    }
  });

  function typeAhead(ch) {
    clearTimeout(typeTimer);
    typeBuffer += ch.toLowerCase();
    typeTimer = setTimeout(function () { typeBuffer = ''; }, 500);
    for (var k = 0; k < options.length; k++) {
      if (options[k].dataset.val.toLowerCase().indexOf(typeBuffer) === 0) {
        setActive(k);
        break;
      }
    }
  }

  document.addEventListener('pointerdown', function (e) {
    if (!root.contains(e.target)) closeList(false);
  });
})();
