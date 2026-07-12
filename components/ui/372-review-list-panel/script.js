(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.getElementById('rlp-list');
  if (!list) return;

  var buttons = Array.prototype.slice.call(list.querySelectorAll('.rlp-helpful'));

  buttons.forEach(function (btn) {
    var review = btn.closest('.rlp-review');
    var countEl = btn.querySelector('.rlp-helpful-count');
    var baseCount = Number(review.getAttribute('data-helpful')) || 0;
    var pressed = review.getAttribute('data-pressed') === 'true';

    function render() {
      countEl.textContent = pressed ? baseCount + 1 : baseCount;
      btn.classList.toggle('is-pressed', pressed);
      btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    }

    btn.addEventListener('click', function () {
      pressed = !pressed;
      review.setAttribute('data-pressed', pressed ? 'true' : 'false');
      render();

      if (reduceMotion) return;

      btn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.94)' },
          { transform: 'scale(1)' }
        ],
        { duration: 200, easing: 'ease-out' }
      );
    });

    render();
  });
})();
