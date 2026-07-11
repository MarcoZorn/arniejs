(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var buttons = document.querySelectorAll('.billing-row__download');
  var note = document.getElementById('downloadNote');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var file = btn.getAttribute('data-file') || 'invoice.pdf';

      if (!reduce) {
        btn.classList.add('is-clicked');
        setTimeout(function () {
          btn.classList.remove('is-clicked');
        }, 150);
      }

      btn.classList.add('is-downloaded');
      btn.setAttribute('aria-label', btn.getAttribute('aria-label') + ' (downloaded)');

      if (note) {
        note.textContent = 'Downloaded ' + file;
      }
    });
  });
})();
