(function () {
  const stack = document.getElementById('polaroids');
  if (!stack) return;

  // touch devices: tap to toggle the scattered layout since there's no hover
  stack.addEventListener('click', (e) => {
    if (e.target.closest('.polaroid') && stack.classList.contains('is-active')) return;
    stack.classList.toggle('is-active');
  });
})();
