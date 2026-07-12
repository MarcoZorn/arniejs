(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.querySelector('.dst-toggle');
  var options = Array.prototype.slice.call(document.querySelectorAll('.dst-option'));
  var list = document.getElementById('dst-list');

  if (!toggle || !list) return;

  function setDensity(density, index) {
    // Real CSS change: swap the data-density attribute the stylesheet keys off,
    // which flips the --row-padding-y/--row-gap custom properties on the list.
    list.setAttribute('data-density', density);
    toggle.setAttribute('data-index', String(index));

    options.forEach(function (opt) {
      var active = opt.dataset.density === density;
      opt.classList.toggle('is-active', active);
      opt.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  options.forEach(function (opt, index) {
    opt.addEventListener('click', function () {
      setDensity(opt.dataset.density, index);
    });
  });

  // Keyboard support for the radiogroup: arrow keys move between options.
  toggle.addEventListener('keydown', function (evt) {
    var activeIndex = options.findIndex(function (opt) {
      return opt.classList.contains('is-active');
    });
    if (evt.key === 'ArrowRight' || evt.key === 'ArrowDown') {
      evt.preventDefault();
      var next = options[(activeIndex + 1) % options.length];
      next.focus();
      setDensity(next.dataset.density, options.indexOf(next));
    } else if (evt.key === 'ArrowLeft' || evt.key === 'ArrowUp') {
      evt.preventDefault();
      var prev = options[(activeIndex - 1 + options.length) % options.length];
      prev.focus();
      setDensity(prev.dataset.density, options.indexOf(prev));
    }
  });

  setDensity('compact', 0);
})();
