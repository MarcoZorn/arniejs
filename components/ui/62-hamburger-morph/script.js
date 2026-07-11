(function () {
  var hamburger = document.getElementById('hamburger');
  var panel = document.getElementById('panel');
  if (!hamburger || !panel) return;

  function setOpen(open) {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
  }

  hamburger.addEventListener('click', function () {
    setOpen(!hamburger.classList.contains('open'));
  });

  panel.querySelectorAll('.panel-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
