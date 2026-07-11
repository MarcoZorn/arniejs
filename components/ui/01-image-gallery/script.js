(function () {
  const grid = document.getElementById('grid');
  const cards = Array.from(grid.querySelectorAll('.card'));
  const filters = Array.from(document.querySelectorAll('.filter'));

  /* ---- Filtering with animated in/out ---- */
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;

      cards.forEach((card) => {
        const match = cat === 'all' || card.dataset.cat === cat;
        if (match) {
          card.classList.remove('is-collapsed');
          // next frame so display change registers before opacity transition
          requestAnimationFrame(() => card.classList.remove('is-hidden'));
        } else {
          card.classList.add('is-hidden');
          const onEnd = (e) => {
            if (e.propertyName !== 'transform') return;
            card.classList.add('is-collapsed');
            card.removeEventListener('transitionend', onEnd);
          };
          card.addEventListener('transitionend', onEnd);
        }
      });
    });
  });

  /* ---- Lightbox ---- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  let current = -1;

  function visibleCards() {
    return cards.filter((c) => !c.classList.contains('is-collapsed'));
  }

  function open(card) {
    const list = visibleCards();
    current = list.indexOf(card);
    render(list);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function render(list) {
    const card = list[current];
    if (!card) return;
    const img = card.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = card.dataset.caption || img.alt;
  }

  function step(dir) {
    const list = visibleCards();
    if (!list.length) return;
    current = (current + dir + list.length) % list.length;
    render(list);
  }

  function close() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cards.forEach((card) => card.addEventListener('click', () => open(card)));
  document.getElementById('lbNext').addEventListener('click', () => step(1));
  document.getElementById('lbPrev').addEventListener('click', () => step(-1));
  document.getElementById('lbClose').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });
})();
