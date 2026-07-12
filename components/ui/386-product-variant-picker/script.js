(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.variant-wrap');
  if (!wrap) return;

  var colorButtons = Array.prototype.slice.call(wrap.querySelectorAll('.variant-swatch'));
  var sizeButtons = Array.prototype.slice.call(wrap.querySelectorAll('.variant-size'));
  var stockNote = wrap.querySelector('[data-stock-note]');
  var addBtn = wrap.querySelector('[data-add-btn]');
  var previewSwatch = wrap.querySelector('[data-preview-swatch]');
  var previewSelection = wrap.querySelector('[data-preview-selection]');

  var productName = 'Canvas Field Jacket';
  var basePrice = 128;

  var colorLabels = {
    clay: 'Clay',
    moss: 'Moss',
    rust: 'Rust',
    sand: 'Sand',
    ink: 'Ink'
  };

  var colorHex = {
    clay: '#9b6b3a',
    moss: '#5a7a3a',
    rust: '#a03820',
    sand: '#d4a85a',
    ink: '#2e2010'
  };

  // Hardcoded availability matrix: color -> size -> in stock (true/false)
  var availability = {
    clay: { XS: true, S: true, M: true, L: true, XL: false },
    moss: { XS: false, S: true, M: true, L: true, XL: true },
    rust: { XS: true, S: false, M: true, L: false, XL: true },
    sand: { XS: true, S: true, M: false, L: true, XL: true },
    ink: { XS: false, S: false, M: true, L: true, XL: false }
  };

  var state = {
    color: 'clay',
    size: 'M'
  };

  function isInStock(color, size) {
    return !!(availability[color] && availability[color][size]);
  }

  function refreshSizeAvailability() {
    sizeButtons.forEach(function (btn) {
      var size = btn.getAttribute('data-size');
      var ok = isInStock(state.color, size);
      btn.disabled = !ok;
      btn.setAttribute('aria-pressed', size === state.size ? 'true' : 'false');
    });
  }

  function updatePreview() {
    if (previewSwatch) {
      previewSwatch.style.backgroundColor = colorHex[state.color];
    }
    if (previewSelection) {
      previewSelection.textContent = colorLabels[state.color] + ' · ' + state.size;
    }
  }

  function updateStockNote() {
    if (!stockNote) return;
    if (isInStock(state.color, state.size)) {
      stockNote.textContent = '';
    } else {
      stockNote.textContent = colorLabels[state.color] + ' in size ' + state.size + ' is out of stock right now.';
    }
  }

  function updateAddButton() {
    if (!addBtn) return;
    var ok = isInStock(state.color, state.size);
    addBtn.disabled = !ok;
    addBtn.textContent = ok ? 'Add to cart' : 'Out of stock';
  }

  function pulse(el) {
    if (reduceMotion || !el) return;
    el.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.94)' },
        { transform: 'scale(1)' }
      ],
      { duration: 180, easing: 'ease-out' }
    );
  }

  function selectColor(color, btn) {
    state.color = color;
    colorButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });

    // If the currently selected size is unavailable for the new color,
    // fall back to the first in-stock size for that color.
    if (!isInStock(state.color, state.size)) {
      var fallback = sizeButtons
        .map(function (b) { return b.getAttribute('data-size'); })
        .filter(function (s) { return isInStock(state.color, s); })[0];
      if (fallback) {
        state.size = fallback;
      }
    }

    refreshSizeAvailability();
    updatePreview();
    updateStockNote();
    updateAddButton();
    pulse(btn);
  }

  function selectSize(size, btn) {
    if (btn.disabled) return;
    state.size = size;
    refreshSizeAvailability();
    updatePreview();
    updateStockNote();
    updateAddButton();
    pulse(btn);
  }

  colorButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectColor(btn.getAttribute('data-color'), btn);
    });
  });

  sizeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectSize(btn.getAttribute('data-size'), btn);
    });
  });

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      if (addBtn.disabled) return;
      var original = addBtn.textContent;
      addBtn.textContent = 'Added ✓';
      window.setTimeout(function () {
        if (!addBtn.disabled) addBtn.textContent = original;
      }, 1400);
      pulse(addBtn);
    });
  }

  refreshSizeAvailability();
  updatePreview();
  updateStockNote();
  updateAddButton();
})();
