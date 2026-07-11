(function () {
  var printBtn = document.getElementById('printBtn');
  if (!printBtn) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  printBtn.addEventListener('click', function () {
    if (!reduceMotion) {
      printBtn.classList.remove('is-pressed');
      void printBtn.offsetWidth;
      printBtn.classList.add('is-pressed');
    }
    window.print();
  });
})();
