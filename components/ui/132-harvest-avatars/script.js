(function () {
  var more = document.querySelector('[data-more]');
  if (!more) return;

  function closeOnOutsideClick(event) {
    if (!more.contains(event.target)) {
      setOpen(false);
    }
  }

  function setOpen(open) {
    more.classList.toggle('is-open', open);
    more.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      document.addEventListener('click', closeOnOutsideClick, true);
    } else {
      document.removeEventListener('click', closeOnOutsideClick, true);
    }
  }

  more.addEventListener('click', function (event) {
    event.stopPropagation();
    setOpen(!more.classList.contains('is-open'));
  });

  more.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!more.classList.contains('is-open'));
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  });
})();
