(function () {
  const board = document.getElementById('board');
  const lists = Array.from(board.querySelectorAll('[data-list]'));

  const seed = {
    todo: [
      { tag: 'design', cls: 'tag--design', title: 'Redesign onboarding empty states', meta: 'Due Fri', seed: 'ava1' },
      { tag: 'bug', cls: 'tag--bug', title: 'Tooltip clips on small viewports', meta: 'P2', seed: 'ava2' },
      { tag: 'dev', cls: 'tag--dev', title: 'Add keyboard nav to command menu', meta: '3 pts', seed: 'ava3' }
    ],
    doing: [
      { tag: 'dev', cls: 'tag--dev', title: 'Migrate auth to session tokens', meta: '5 pts', seed: 'ava4' },
      { tag: 'ops', cls: 'tag--ops', title: 'Set up preview deployments', meta: 'In review', seed: 'ava5' }
    ],
    done: [
      { tag: 'design', cls: 'tag--design', title: 'New color tokens shipped', meta: 'Done', seed: 'ava6' }
    ]
  };

  function makeCard(data) {
    const el = document.createElement('article');
    el.className = 'card';
    el.setAttribute('draggable', 'true');
    el.setAttribute('tabindex', '0');
    el.innerHTML = `
      <span class="card__tag ${data.cls}">${data.tag}</span>
      <div class="card__title">${data.title}</div>
      <div class="card__foot">
        <span class="card__meta">${data.meta}</span>
        <img class="card__ava" alt="" src="https://picsum.photos/seed/${data.seed}/48/48">
      </div>`;
    return el;
  }

  Object.keys(seed).forEach((key) => {
    const list = board.querySelector(`[data-col="${key}"] [data-list]`);
    seed[key].forEach((d) => list.appendChild(makeCard(d)));
  });

  let dragged = null;
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';

  function updateCounts() {
    board.querySelectorAll('.col').forEach((col) => {
      const n = col.querySelectorAll('.card').length;
      col.querySelector('.col__count').textContent = n;
    });
  }
  updateCounts();

  function afterElement(list, y) {
    const cards = Array.from(list.querySelectorAll('.card:not(.is-dragging)'));
    let closest = { offset: -Infinity, el: null };
    for (const card of cards) {
      const box = card.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) closest = { offset, el: card };
    }
    return closest.el;
  }

  board.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    dragged = card;
    card.classList.add('is-dragging');
    if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', ''); }
  });

  board.addEventListener('dragend', () => {
    if (dragged) dragged.classList.remove('is-dragging');
    placeholder.remove();
    board.querySelectorAll('.col').forEach((c) => c.classList.remove('is-over'));
    dragged = null;
    updateCounts();
  });

  lists.forEach((list) => {
    const col = list.closest('.col');
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!dragged) return;
      col.classList.add('is-over');
      const after = afterElement(list, e.clientY);
      if (after) list.insertBefore(placeholder, after);
      else list.appendChild(placeholder);
    });
    list.addEventListener('dragleave', (e) => {
      if (!list.contains(e.relatedTarget)) col.classList.remove('is-over');
    });
    list.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!dragged) return;
      list.insertBefore(dragged, placeholder);
      placeholder.remove();
      col.classList.remove('is-over');
      updateCounts();
    });
  });
})();
