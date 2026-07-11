(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const field = document.getElementById('tagsField');
  const list = document.getElementById('tagsList');
  const input = document.getElementById('tagsInput');
  const count = document.getElementById('tagsCount');

  const MAX_TAGS = 8;
  let tags = [];

  function render() {
    list.innerHTML = '';
    tags.forEach((tag, i) => {
      const li = document.createElement('li');
      li.className = 'tag ' + (i % 2 === 0 ? 'tag--sage' : 'tag--terra');
      li.tabIndex = 0;

      const text = document.createElement('span');
      text.textContent = tag;
      li.appendChild(text);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'tag__remove';
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', 'Remove ' + tag);
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTag(i);
      });
      li.appendChild(removeBtn);

      li.addEventListener('click', () => removeTag(i));

      list.appendChild(li);
    });

    count.textContent = `${tags.length} / ${MAX_TAGS} tags`;
    const atLimit = tags.length >= MAX_TAGS;
    count.classList.toggle('is-limit', atLimit);
    field.classList.toggle('is-limit', atLimit);
    input.disabled = atLimit;
    input.placeholder = atLimit ? 'Tag limit reached' : 'Type and press Enter…';
  }

  function addTag(raw) {
    const value = raw.trim();
    if (!value) return;
    if (tags.length >= MAX_TAGS) {
      flashLimit();
      return;
    }
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      flashLimit();
      input.value = '';
      return;
    }
    tags.push(value);
    input.value = '';
    render();
  }

  function removeTag(index) {
    tags.splice(index, 1);
    render();
    input.focus();
  }

  function flashLimit() {
    if (reduce) return;
    field.classList.add('is-shake');
    field.addEventListener('animationend', () => field.classList.remove('is-shake'), { once: true });
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input.value);
    } else if (e.key === 'Backspace' && input.value === '' && tags.length) {
      removeTag(tags.length - 1);
    }
  });

  input.addEventListener('paste', (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    if (pasted.includes(',')) {
      e.preventDefault();
      pasted.split(',').forEach((piece) => addTag(piece));
    }
  });

  field.addEventListener('click', (e) => {
    if (e.target === field) input.focus();
  });

  render();
})();
