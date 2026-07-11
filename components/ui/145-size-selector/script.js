(function () {
  var selector = document.getElementById('sizeSelector');
  var label = document.getElementById('selectedLabel');

  if (!selector || !label) return;

  var chips = Array.prototype.slice.call(selector.querySelectorAll('.size-chip'));

  function selectChip(chip) {
    if (chip.disabled) return;
    chips.forEach(function (c) {
      var isTarget = c === chip;
      c.classList.toggle('is-selected', isTarget);
      c.setAttribute('aria-checked', isTarget ? 'true' : 'false');
    });
    label.textContent = chip.getAttribute('data-size');
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      selectChip(chip);
    });
  });

  selector.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var enabled = chips.filter(function (c) { return !c.disabled; });
    var current = selector.querySelector('.is-selected');
    var idx = enabled.indexOf(current);
    if (idx === -1) return;
    var nextIdx = e.key === 'ArrowRight'
      ? (idx + 1) % enabled.length
      : (idx - 1 + enabled.length) % enabled.length;
    selectChip(enabled[nextIdx]);
    enabled[nextIdx].focus();
    e.preventDefault();
  });
})();
