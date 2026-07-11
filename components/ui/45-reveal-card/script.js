(function () {
  const card = document.querySelector('.reveal');
  if (!card) return;

  // touch devices: tap to toggle the reveal since there's no hover
  card.addEventListener('click', () => {
    card.classList.toggle('is-open');
  });
})();
