(function () {
  var folder = document.getElementById('folder');
  if (!folder) return;

  folder.addEventListener('click', function () {
    var isOpen = folder.getAttribute('aria-pressed') === 'true';
    folder.setAttribute('aria-pressed', String(!isOpen));
  });
})();
