(function () {
  var DATA = [
    'Basil', 'Rosemary', 'Thyme', 'Sage', 'Oregano', 'Mint',
    'Lavender', 'Parsley', 'Cilantro', 'Dill', 'Chamomile',
    'Tomato', 'Carrot', 'Radish', 'Kale', 'Spinach', 'Pumpkin',
    'Sunflower', 'Marigold', 'Chives'
  ];

  var input = document.getElementById('acInput');
  var list = document.getElementById('acList');
  var wrap = document.getElementById('ac');

  var matches = [];
  var activeIndex = -1;
  var open = false;

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, query) {
    if (!query) return text;
    var re = new RegExp('(' + escapeRegExp(query) + ')', 'ig');
    return text.replace(re, '<mark>$1</mark>');
  }

  function render(query) {
    list.innerHTML = '';
    if (!matches.length) {
      var empty = document.createElement('li');
      empty.className = 'ac__empty';
      empty.textContent = 'No plants found';
      list.appendChild(empty);
      return;
    }
    matches.forEach(function (name, i) {
      var li = document.createElement('li');
      li.className = 'ac__item' + (i === activeIndex ? ' is-active' : '');
      li.setAttribute('role', 'option');
      li.id = 'ac-opt-' + i;
      li.innerHTML =
        '<span>' + highlight(name, query) + '</span>' +
        '<span class="ac__tag">plant</span>';
      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        select(name);
      });
      list.appendChild(li);
    });
  }

  function filter(query) {
    var q = query.trim().toLowerCase();
    if (!q) return [];
    return DATA.filter(function (name) {
      return name.toLowerCase().indexOf(q) !== -1;
    });
  }

  function openList() {
    open = true;
    list.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
  }

  function closeList() {
    open = false;
    activeIndex = -1;
    list.classList.remove('is-open');
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function select(name) {
    input.value = name;
    closeList();
    input.focus();
  }

  function updateActiveDescendant() {
    if (activeIndex >= 0) {
      input.setAttribute('aria-activedescendant', 'ac-opt-' + activeIndex);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
    Array.prototype.forEach.call(list.children, function (li, i) {
      li.classList.toggle('is-active', i === activeIndex);
    });
    var activeEl = list.children[activeIndex];
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', function () {
    matches = filter(input.value);
    activeIndex = -1;
    render(input.value.trim());
    if (matches.length || input.value.trim()) {
      openList();
    } else {
      closeList();
    }
  });

  input.addEventListener('keydown', function (e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      matches = filter(input.value);
      render(input.value.trim());
      if (matches.length) openList();
      return;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (matches.length) {
        activeIndex = (activeIndex + 1) % matches.length;
        updateActiveDescendant();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (matches.length) {
        activeIndex = (activeIndex - 1 + matches.length) % matches.length;
        updateActiveDescendant();
      }
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && matches[activeIndex]) {
        e.preventDefault();
        select(matches[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      closeList();
    }
  });

  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) closeList();
  });

  input.addEventListener('blur', function () {
    // slight delay so mousedown selection above can fire first
    setTimeout(function () {
      if (!wrap.contains(document.activeElement)) closeList();
    }, 0);
  });
})();
