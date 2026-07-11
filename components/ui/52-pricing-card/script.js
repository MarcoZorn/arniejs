(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const list = document.getElementById('pricingList');
  const cta = document.querySelector('.pricing__cta');

  // re-trigger the checklist stagger animation whenever the card enters view
  if (list && !reduce) {
    const items = list.querySelectorAll('li');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          items.forEach((li) => {
            li.style.animation = 'none';
            void li.offsetWidth;
            li.style.animation = '';
          });
        }
      });
    }, { threshold: 0.5 });
    observer.observe(list);
  }

  if (cta) {
    cta.addEventListener('click', () => {
      cta.textContent = 'Added to Cart';
      setTimeout(() => { cta.textContent = 'Choose Homestead'; }, 1800);
    });
  }
})();
