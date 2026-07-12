(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var options = Array.prototype.slice.call(document.querySelectorAll('.bsl-option'));
  var summaryText = document.querySelector('.bsl-summary-text');
  var cta = document.querySelector('.bsl-cta');
  if (!options.length || !summaryText || !cta) return;

  var selected = null;

  function select(option, skipAnimation) {
    selected = option;
    options.forEach(function (opt) {
      var isSel = opt === option;
      opt.classList.toggle('is-selected', isSel);
      opt.setAttribute('aria-checked', isSel ? 'true' : 'false');
    });

    var label = option.getAttribute('data-size') === 'single' ? 'Single' : option.querySelector('.bsl-option-label').textContent;
    var units = option.getAttribute('data-units');
    var total = option.getAttribute('data-total');

    summaryText.innerHTML = 'You picked <strong>' + label + '</strong> (' + units + ' packet' + (units === '1' ? '' : 's') + ') — total <strong>$' + total + '</strong>';

    cta.disabled = false;

    if (reduceMotion || skipAnimation) return;
    option.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.03)' },
        { transform: 'scale(1)' }
      ],
      { duration: 220, easing: 'ease-out' }
    );
  }

  options.forEach(function (option) {
    option.addEventListener('click', function () {
      select(option);
    });
  });

  cta.addEventListener('click', function () {
    if (!selected) return;
    var label = selected.querySelector('.bsl-option-label').textContent;
    var total = selected.getAttribute('data-total');
    summaryText.innerHTML = 'Added <strong>' + label + '</strong> to cart — $' + total + ' total.';
  });

  // Preselect the featured pack so the summary and CTA aren't empty on load.
  var featured = document.querySelector('.bsl-option--featured');
  if (featured) select(featured, true);
})();
