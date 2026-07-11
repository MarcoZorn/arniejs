(function () {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach((card) => {
    const toggle = (e) => {
      // Let the CTA link behave like a link, don't toggle.
      if (e.target.closest('.flip-cta')) return;
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    };

    card.addEventListener('click', toggle);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(e);
      }
    });
  });
})();
