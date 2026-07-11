(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const card = document.querySelector('.clay');
  if (!card || reduce) return;

  // click pulses the border spin briefly, like the clay catching a spark
  card.addEventListener('click', () => {
    card.style.animationDuration = '0.6s';
    setTimeout(() => { card.style.animationDuration = '5s'; }, 900);
  });
})();
