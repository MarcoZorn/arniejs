(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.seek-wrap');
  if (!wrap) return;

  var input = wrap.querySelector('.seek-input');
  var listbox = wrap.querySelector('.seek-listbox');
  var status = wrap.querySelector('.seek-status');
  var clearBtn = wrap.querySelector('.seek-clear');

  var DATA = [
    { label: 'Tomato seedlings', tag: 'Plants' },
    { label: 'Tomato cages', tag: 'Tools' },
    { label: 'Cherry tomato mix', tag: 'Seeds' },
    { label: 'Compost bin (55L)', tag: 'Tools' },
    { label: 'Compost accelerator', tag: 'Supplies' },
    { label: 'Raised bed kit — cedar', tag: 'Structures' },
    { label: 'Raised bed liner', tag: 'Supplies' },
    { label: 'Drip irrigation kit', tag: 'Tools' },
    { label: 'Heirloom carrot seeds', tag: 'Seeds' },
    { label: 'Basil starter pack', tag: 'Plants' },
    { label: 'Garden trowel, forged', tag: 'Tools' },
    { label: 'Pest netting, fine mesh', tag: 'Supplies' },
    { label: 'Worm castings, 10kg', tag: 'Supplies' },
    { label: 'Rain barrel, 200L', tag: 'Structures' },
    { label: 'Pruning shears', tag: 'Tools' }
  ];

  var activeIndex = -1;
  var currentMatches = [];
  var statusTimer = null;

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(label, query) {
    if (!query) return label;
    var re = new RegExp('(' + escapeRegExp(query) + ')', 'ig');
    return label.replace(re, '<mark>$1</mark>');
  }

  function setStatus(text, persist) {
    status.textContent = text;
    window.clearTimeout(statusTimer);
    if (!persist) {
      statusTimer = window.setTimeout(function () {
        status.textContent = '';
      }, 4000);
    }
  }

  function openList() {
    listbox.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function closeList() {
    listbox.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }

  function renderMatches(query) {
    listbox.innerHTML = '';
    var trimmed = query.trim();

    if (!trimmed) {
      closeList();
      currentMatches = [];
      return;
    }

    var lower = trimmed.toLowerCase();
    currentMatches = DATA.filter(function (item) {
      return item.label.toLowerCase().indexOf(lower) !== -1;
    });

    if (currentMatches.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'seek-empty';
      empty.textContent = 'No matches for “' + trimmed + '”. Try another word.';
      listbox.appendChild(empty);
      openList();
      activeIndex = -1;
      return;
    }

    currentMatches.forEach(function (item, i) {
      var li = document.createElement('li');
      li.className = 'seek-option';
      li.id = 'seek-option-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');

      var labelSpan = document.createElement('span');
      labelSpan.innerHTML = highlight(item.label, trimmed);

      var tagSpan = document.createElement('span');
      tagSpan.className = 'seek-option-tag';
      tagSpan.textContent = item.tag;

      li.appendChild(labelSpan);
      li.appendChild(tagSpan);

      li.addEventListener('mouseenter', function () {
        setActive(i);
      });
      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        selectItem(i);
      });

      listbox.appendChild(li);
    });

    activeIndex = -1;
    openList();
  }

  function setActive(index) {
    var options = Array.prototype.slice.call(listbox.querySelectorAll('.seek-option'));
    options.forEach(function (opt, i) {
      var isActive = i === index;
      opt.classList.toggle('is-active', isActive);
      opt.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        input.setAttribute('aria-activedescendant', opt.id);
        opt.scrollIntoView({ block: 'nearest' });
      }
    });
    if (index === -1) {
      input.removeAttribute('aria-activedescendant');
    }
    activeIndex = index;
  }

  function selectItem(index) {
    var item = currentMatches[index];
    if (!item) return;
    input.value = item.label;
    closeList();
    setStatus('Searched for "' + item.label + '".');
    clearBtn.hidden = false;
  }

  function moveActive(delta) {
    if (listbox.hidden || currentMatches.length === 0) return;
    var next = activeIndex + delta;
    if (next < 0) next = currentMatches.length - 1;
    if (next >= currentMatches.length) next = 0;
    setActive(next);
  }

  input.addEventListener('input', function () {
    clearBtn.hidden = input.value.length === 0;
    renderMatches(input.value);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (listbox.hidden) {
        renderMatches(input.value);
      } else {
        moveActive(1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Enter') {
      if (!listbox.hidden && activeIndex > -1) {
        e.preventDefault();
        selectItem(activeIndex);
      } else if (input.value.trim()) {
        e.preventDefault();
        closeList();
        setStatus('Searched for "' + input.value.trim() + '".');
      }
    } else if (e.key === 'Escape') {
      if (!listbox.hidden) {
        e.preventDefault();
        closeList();
      }
    }
  });

  input.addEventListener('blur', function () {
    // Delay so mousedown-based selection can still register first.
    window.setTimeout(closeList, 120);
  });

  input.addEventListener('focus', function () {
    if (input.value.trim()) renderMatches(input.value);
  });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    clearBtn.hidden = true;
    closeList();
    input.focus();
    setStatus('');
  });
})();
