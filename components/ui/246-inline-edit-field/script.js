(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var roots = Array.prototype.slice.call(document.querySelectorAll('[data-inedit-root]'));

  roots.forEach(function (root) {
    var display = root.querySelector('.inedit-display');
    var valueEl = root.querySelector('.inedit-value');
    var input = root.querySelector('.inedit-input');
    if (!display || !valueEl || !input) return;

    var lastValue = valueEl.textContent.trim();

    function enterEdit() {
      lastValue = valueEl.textContent.trim();
      input.value = lastValue;
      root.classList.add('is-editing');
      root.classList.remove('is-flash');
      input.focus();
      input.select();
    }

    function commit() {
      var next = input.value.trim();
      if (next === '') {
        cancel();
        return;
      }
      valueEl.textContent = next;
      root.classList.remove('is-editing');
      display.focus();
      flash();
    }

    function cancel() {
      input.value = lastValue;
      root.classList.remove('is-editing');
      display.focus();
    }

    function flash() {
      if (reduceMotion) return;
      root.classList.add('is-flash');
      window.setTimeout(function () {
        root.classList.remove('is-flash');
      }, 620);
    }

    display.addEventListener('click', enterEdit);
    display.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterEdit();
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    });

    input.addEventListener('blur', function () {
      if (root.classList.contains('is-editing')) {
        commit();
      }
    });
  });
})();
