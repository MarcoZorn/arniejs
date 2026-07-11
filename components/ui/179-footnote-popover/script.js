(function () {
  var refs = document.querySelectorAll('.footnote-ref');
  var hideTimer = null;

  if (!refs.length) return;

  function position(popover, ref) {
    var rect = ref.getBoundingClientRect();
    var popRect = popover.getBoundingClientRect();
    var gap = 10;

    var left = rect.left + rect.width / 2 - popRect.width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - popRect.width - 12));

    var top = rect.top - popRect.height - gap;
    var flipped = false;
    if (top < 12) {
      top = rect.bottom + gap;
      flipped = true;
    }

    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
    popover.classList.toggle('footnote-popover--flipped', flipped);
  }

  function show(ref) {
    var id = ref.getAttribute('data-footnote');
    var popover = document.getElementById('footnote-' + id);
    if (!popover) return;

    clearTimeout(hideTimer);
    hideAll();

    ref.classList.add('is-active');
    ref.setAttribute('aria-expanded', 'true');
    popover.classList.add('is-visible');
    position(popover, ref);
  }

  function hideAll() {
    refs.forEach(function (r) {
      r.classList.remove('is-active');
      r.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.footnote-popover').forEach(function (p) {
      p.classList.remove('is-visible');
    });
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideAll, 120);
  }

  refs.forEach(function (ref) {
    ref.addEventListener('mouseenter', function () { show(ref); });
    ref.addEventListener('mouseleave', scheduleHide);
    ref.addEventListener('focus', function () { show(ref); });
    ref.addEventListener('blur', scheduleHide);

    ref.addEventListener('click', function (e) {
      e.preventDefault();
      if (ref.classList.contains('is-active')) {
        hideAll();
      } else {
        show(ref);
      }
    });

    var id = ref.getAttribute('data-footnote');
    var popover = document.getElementById('footnote-' + id);
    if (popover) {
      popover.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
      popover.addEventListener('mouseleave', scheduleHide);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideAll();
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.footnote-ref') && !e.target.closest('.footnote-popover')) {
      hideAll();
    }
  });

  window.addEventListener('scroll', hideAll, { passive: true });
  window.addEventListener('resize', hideAll);
})();
