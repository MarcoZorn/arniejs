(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var field = document.querySelector('[data-chip-field]');
  var select = document.querySelector('[data-chip-select]');
  var addBtn = document.querySelector('[data-chip-add]');
  var emptyMsg = document.querySelector('[data-empty-msg]');

  function updateEmptyMsg() {
    var remaining = field.querySelectorAll('.chip:not(.is-removing)').length;
    emptyMsg.hidden = remaining !== 0;
  }

  function bindRemove(chip) {
    var removeBtn = chip.querySelector('.chip__remove');
    removeBtn.addEventListener('click', function () {
      if (prefersReducedMotion) {
        chip.remove();
        updateEmptyMsg();
        return;
      }
      chip.classList.add('is-removing');
      chip.addEventListener(
        'transitionend',
        function () {
          chip.remove();
          updateEmptyMsg();
        },
        { once: true }
      );
      // Fallback in case transitionend doesn't fire
      setTimeout(function () {
        if (chip.parentNode) {
          chip.remove();
          updateEmptyMsg();
        }
      }, 400);
    });
  }

  Array.prototype.forEach.call(field.querySelectorAll('[data-chip]'), bindRemove);
  updateEmptyMsg();

  function addChip(label) {
    var chip = document.createElement('span');
    chip.className = 'chip';
    chip.setAttribute('data-chip', '');
    if (!prefersReducedMotion) {
      chip.classList.add('is-entering');
    }

    var labelEl = document.createElement('span');
    labelEl.className = 'chip__label';
    labelEl.textContent = label;

    var removeBtn = document.createElement('button');
    removeBtn.className = 'chip__remove';
    removeBtn.type = 'button';
    removeBtn.setAttribute('aria-label', 'Remove ' + label);
    removeBtn.textContent = '×';

    chip.appendChild(labelEl);
    chip.appendChild(removeBtn);
    field.appendChild(chip);
    bindRemove(chip);
    updateEmptyMsg();
  }

  addBtn.addEventListener('click', function () {
    var value = select.value;
    if (!value) return;

    var alreadyExists = Array.prototype.some.call(field.querySelectorAll('.chip__label'), function (el) {
      return el.textContent === value;
    });
    if (alreadyExists) {
      select.value = '';
      return;
    }

    addChip(value);
    select.value = '';
  });
})();
