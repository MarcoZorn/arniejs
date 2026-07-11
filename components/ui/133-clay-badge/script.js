(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var badge = document.querySelector('[data-badge]');
  var incrementBtn = document.querySelector('[data-increment]');
  var decrementBtn = document.querySelector('[data-decrement]');
  var surgeBtn = document.querySelector('[data-surge]');
  var resetBtn = document.querySelector('[data-reset]');

  var count = parseInt(badge.textContent, 10) || 0;

  function render(previous) {
    badge.textContent = String(count);
    badge.classList.toggle('is-zero', count === 0);

    if (!prefersReducedMotion && count !== previous) {
      badge.classList.remove('pop');
      // force reflow so the animation can restart
      void badge.offsetWidth;
      badge.classList.add('pop');
    }
  }

  function setCount(next) {
    var previous = count;
    count = Math.max(0, next);
    render(previous);
  }

  incrementBtn.addEventListener('click', function () {
    setCount(count + 1);
  });

  decrementBtn.addEventListener('click', function () {
    setCount(count - 1);
  });

  surgeBtn.addEventListener('click', function () {
    setCount(count + 5);
  });

  resetBtn.addEventListener('click', function () {
    setCount(0);
  });

  badge.addEventListener('animationend', function () {
    badge.classList.remove('pop');
  });
})();
