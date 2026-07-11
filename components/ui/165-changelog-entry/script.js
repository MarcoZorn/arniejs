(function () {
  var heads = document.querySelectorAll('.changelog__head');
  if (!heads.length) return;

  heads.forEach(function (head) {
    head.addEventListener('click', function () {
      var entry = head.closest('.changelog__entry');
      if (!entry) return;

      var collapsed = entry.classList.toggle('is-collapsed');
      head.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  });
})();
