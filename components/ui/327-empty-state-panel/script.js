(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var input = document.getElementById('empty-search-input');
  var panel = document.getElementById('empty-panel');
  var heading = document.getElementById('empty-heading');
  var desc = document.getElementById('empty-desc');
  var clearBtn = document.getElementById('empty-clear-btn');
  var list = document.getElementById('empty-results-list');
  if (!input || !panel || !list) return;

  var dataset = [
    { name: 'Bed 4 — Basil', tag: 'Herb', meta: 'Sown 12 days ago' },
    { name: 'Bed 1 — Tomato vines', tag: 'Fruit', meta: 'Staked yesterday' },
    { name: 'Bed 2 — Thyme', tag: 'Herb', meta: 'Ready to repot' },
    { name: 'Bed 6 — Rosemary', tag: 'Herb', meta: 'Drought-hardy' },
    { name: 'Bed 3 — Squash', tag: 'Fruit', meta: 'Flowering now' },
    { name: 'Bed 5 — Carrots', tag: 'Root', meta: 'Thinned last week' },
    { name: 'Bed 4 — Compost turn', tag: 'Task', meta: 'Logged this morning' }
  ];

  function render(query) {
    var q = query.trim().toLowerCase();

    if (!q) {
      list.hidden = true;
      list.innerHTML = '';
      panel.hidden = false;
      heading.textContent = 'Search your plots';
      desc.textContent = 'Type a plot name, crop, or task above to see what is growing where.';
      clearBtn.textContent = 'Clear search';
      clearBtn.disabled = true;
      return;
    }

    clearBtn.disabled = false;

    var matches = dataset.filter(function (item) {
      return item.name.toLowerCase().indexOf(q) !== -1 || item.tag.toLowerCase().indexOf(q) !== -1;
    });

    if (matches.length) {
      panel.hidden = true;
      list.hidden = false;
      list.innerHTML = matches.map(function (item, i) {
        return '<li style="animation-delay:' + (reduceMotion ? '0s' : (i * 0.04) + 's') + '">' +
          '<span class="empty-item-tag">' + item.tag + '</span>' +
          '<span class="empty-item-name">' + item.name + '</span>' +
          '<span class="empty-item-meta">' + item.meta + '</span>' +
          '</li>';
      }).join('');
    } else {
      list.hidden = true;
      list.innerHTML = '';
      panel.hidden = false;
      heading.textContent = 'No results found';
      desc.textContent = '“' + query.trim() + '” did not match anything in the plot list. Try a different word, or clear the field to see everything again.';
      clearBtn.textContent = 'Clear search';
    }
  }

  input.addEventListener('input', function () {
    render(input.value);
  });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    render('');
    input.focus();
  });

  render('');
})();
