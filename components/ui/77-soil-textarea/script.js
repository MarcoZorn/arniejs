(function () {
  var area = document.getElementById('soilArea');
  var count = document.getElementById('soilCount');
  var MAX = parseInt(area.getAttribute('maxlength'), 10) || 280;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function autoGrow() {
    area.style.height = 'auto';
    area.style.height = area.scrollHeight + 'px';
  }

  function updateCount() {
    var len = area.value.length;
    count.textContent = len + ' / ' + MAX;
    count.classList.remove('is-warn', 'is-max');
    if (len >= MAX) {
      count.classList.add('is-max');
    } else if (len >= MAX * 0.85) {
      count.classList.add('is-warn');
    }
  }

  area.addEventListener('input', function () {
    autoGrow();
    updateCount();
  });

  // initialize
  autoGrow();
  updateCount();

  if (reduceMotion) {
    area.style.transition = 'none';
  }
})();
