(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.toggle-wrap');
  if (!wrap) return;

  var inputs = Array.prototype.slice.call(wrap.querySelectorAll('.toggle-input'));
  var count = wrap.querySelector('.toggle-count');

  function updateCount() {
    var total = inputs.length;
    var on = inputs.filter(function (el) { return el.checked; }).length;
    count.textContent = on + ' of ' + total + ' enabled';
  }

  inputs.forEach(function (input) {
    input.addEventListener('change', function () {
      updateCount();
      var row = input.closest('.toggle-row');
      row.classList.add('is-changed');

      if (!reduceMotion) {
        var thumb = row.querySelector('.toggle-thumb');
        thumb.animate(
          [
            { transform: thumb.style.transform || undefined },
            { transform: input.checked ? 'translateX(20px) scale(1.08)' : 'translateX(0) scale(1.08)' },
            { transform: input.checked ? 'translateX(20px)' : 'translateX(0)' }
          ],
          { duration: 180, easing: 'ease-out' }
        );
      }

      window.setTimeout(function () {
        row.classList.remove('is-changed');
      }, 900);
    });
  });

  updateCount();
})();
