(function () {
  const cards = document.querySelectorAll('.option-card');
  const inputs = document.querySelectorAll('.option-card input[type="radio"]');

  function refresh() {
    cards.forEach((card) => {
      const input = card.querySelector('input[type="radio"]');
      card.classList.toggle('is-selected', input.checked);
    });
  }

  inputs.forEach((input) => {
    input.addEventListener('change', refresh);
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const input = card.querySelector('input[type="radio"]');
      if (!input.checked) {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  refresh();
})();
