(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var group = document.querySelector('.rti-stars');
  if (!group) return;

  var stars = Array.prototype.slice.call(group.querySelectorAll('.rti-star'));
  var valueOut = document.getElementById('rti-value');

  var value = 0;
  var previewValue = 0;

  function paint(activeValue, className) {
    stars.forEach(function (star) {
      var v = parseInt(star.getAttribute('data-value'), 10);
      star.classList.toggle(className, v <= activeValue);
    });
  }

  function render() {
    paint(value, 'is-filled');
    stars.forEach(function (star) {
      var v = parseInt(star.getAttribute('data-value'), 10);
      star.setAttribute('aria-checked', v === value ? 'true' : 'false');
    });
    valueOut.textContent = value > 0
      ? value + ' out of 5 star' + (value === 1 ? '' : 's')
      : 'No rating yet';
  }

  function renderPreview(hoverValue) {
    paint(hoverValue, 'is-preview');
  }

  function clearPreview() {
    stars.forEach(function (star) {
      star.classList.remove('is-preview');
    });
  }

  stars.forEach(function (star) {
    var v = parseInt(star.getAttribute('data-value'), 10);

    star.addEventListener('mouseenter', function () {
      previewValue = v;
      renderPreview(previewValue);
    });

    star.addEventListener('mouseleave', function () {
      previewValue = 0;
      clearPreview();
    });

    star.addEventListener('click', function () {
      value = v;
      render();
      clearPreview();
      if (!reduceMotion) {
        star.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
          { duration: 220, easing: 'ease-out' }
        );
      }
    });

    // touch support: tap behaves like click, but also gives a preview on touchstart
    star.addEventListener('touchstart', function () {
      previewValue = v;
      renderPreview(previewValue);
    }, { passive: true });
  });

  group.addEventListener('mouseleave', function () {
    previewValue = 0;
    clearPreview();
  });

  group.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      value = Math.min(5, value + 1);
      render();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      value = Math.max(0, value - 1);
      render();
    } else if (e.key === 'Home') {
      e.preventDefault();
      value = 1;
      render();
    } else if (e.key === 'End') {
      e.preventDefault();
      value = 5;
      render();
    } else if (/^[1-5]$/.test(e.key)) {
      value = parseInt(e.key, 10);
      render();
    }
  });

  render();
})();
