(function () {
  var trunkBtn = document.getElementById('trunkBtn');
  var groveMenu = document.getElementById('groveMenu');
  if (!trunkBtn || !groveMenu) return;

  function setOpen(open) {
    trunkBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      groveMenu.hidden = false;
      requestAnimationFrame(function () {
        groveMenu.classList.add('open');
      });
    } else {
      groveMenu.classList.remove('open');
      setTimeout(function () {
        groveMenu.hidden = true;
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500);
    }
  }

  trunkBtn.addEventListener('click', function () {
    setOpen(groveMenu.hidden || !groveMenu.classList.contains('open'));
  });

  groveMenu.querySelectorAll('.branch-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(false);
    });
  });

  document.addEventListener('click', function (e) {
    if (!groveMenu.contains(e.target) && e.target !== trunkBtn && !trunkBtn.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
