(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tide = document.querySelector('.tide');

  if (reduce && tide) {
    tide.classList.add('is-static');
  }
})();
