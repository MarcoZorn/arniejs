(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var polaroid = document.querySelector('.polaroid');
  if (!polaroid) return;

  polaroid.addEventListener('click', function () {
    if (polaroid.getAttribute('data-developed') === 'true') return;

    polaroid.setAttribute('data-developed', 'true');

    if (!reduce) {
      polaroid.classList.add('is-shaking');
      polaroid.addEventListener('animationend', function handler() {
        polaroid.classList.remove('is-shaking');
        polaroid.removeEventListener('animationend', handler);
      });
    }
  });
})();
