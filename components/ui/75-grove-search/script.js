(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const search = document.getElementById('search');
  const icon = document.getElementById('searchIcon');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const items = Array.from(results.querySelectorAll('li'));

  function openSearch() {
    if (search.classList.contains('is-open')) return;
    search.classList.add('is-open');
    results.classList.remove('is-collapsed');
    const delay = reduce ? 0 : 200;
    setTimeout(() => input.focus(), delay);
  }

  function closeSearch() {
    if (!search.classList.contains('is-open')) return;
    search.classList.remove('is-open');
    input.value = '';
    filter('');
    results.classList.add('is-collapsed');
    icon.focus();
  }

  function filter(query) {
    const q = query.trim().toLowerCase();
    let anyMatch = false;
    items.forEach((li) => {
      const name = li.dataset.name.toLowerCase();
      const matches = q === '' || name.includes(q);
      li.classList.toggle('is-hidden', !matches);
      li.classList.toggle('is-match', q !== '' && matches);
      if (matches) anyMatch = true;
    });
    return anyMatch;
  }

  icon.addEventListener('click', () => {
    if (search.classList.contains('is-open')) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  input.addEventListener('focus', openSearch);

  input.addEventListener('input', () => {
    filter(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  document.addEventListener('click', (e) => {
    if (!search.contains(e.target) && !results.contains(e.target)) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && search.classList.contains('is-open')) {
      closeSearch();
    }
  });

  results.classList.add('is-collapsed');
})();
