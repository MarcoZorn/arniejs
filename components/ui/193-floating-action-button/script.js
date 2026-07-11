(function () {
  var mainBtn = document.getElementById('fabMain');
  var actions = document.getElementById('fabActions');
  var actionButtons = actions.querySelectorAll('.fab-action');

  function setOpen(open) {
    actions.classList.toggle('is-open', open);
    mainBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mainBtn.setAttribute('aria-label', open ? 'Close quick actions' : 'Open quick actions');
  }

  mainBtn.addEventListener('click', function () {
    setOpen(!actions.classList.contains('is-open'));
  });

  actionButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var label = btn.getAttribute('data-label') || 'Action';
      btn.setAttribute('title', label + ' clicked');
      setOpen(false);
      mainBtn.focus();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  });

  document.addEventListener('click', function (e) {
    if (!actions.contains(e.target) && e.target !== mainBtn && !mainBtn.contains(e.target)) {
      setOpen(false);
    }
  });
})();
