(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var combo = document.querySelector('.msd-combo');
  if (!combo) return;

  var trigger = combo.querySelector('.msd-trigger');
  var panel = combo.querySelector('.msd-panel');
  var search = combo.querySelector('.msd-search');
  var list = combo.querySelector('.msd-list');
  var options = Array.prototype.slice.call(combo.querySelectorAll('.msd-option'));
  var empty = combo.querySelector('.msd-empty');
  var chipsWrap = document.getElementById('msd-chips');
  var hint = document.querySelector('.msd-hint');
  var placeholder = chipsWrap.querySelector('.msd-placeholder');

  var selected = new Set();
  var activeIndex = -1;

  function labelFor(opt) {
    return opt.querySelector('label').textContent;
  }

  function open() {
    panel.hidden = false;
    combo.setAttribute('aria-expanded', 'true');
    search.value = '';
    filterOptions('');
    search.focus();
  }

  function close() {
    panel.hidden = true;
    combo.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
    setActiveOption(-1);
  }

  function isOpen() {
    return !panel.hidden;
  }

  function toggle() {
    if (isOpen()) close();
    else open();
  }

  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', function (e) {
    if (!combo.contains(e.target)) close();
  });

  combo.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      close();
      trigger.focus();
    }
  });

  function filterOptions(query) {
    var q = query.trim().toLowerCase();
    var visibleCount = 0;
    options.forEach(function (opt) {
      var text = labelFor(opt).toLowerCase();
      var match = text.indexOf(q) !== -1;
      opt.hidden = !match;
      if (match) visibleCount++;
    });
    empty.hidden = visibleCount !== 0;
    activeIndex = -1;
    setActiveOption(-1);
  }

  search.addEventListener('input', function () {
    filterOptions(search.value);
  });

  function visibleOptions() {
    return options.filter(function (o) { return !o.hidden; });
  }

  function setActiveOption(index) {
    options.forEach(function (o) { o.classList.remove('is-active'); });
    var vis = visibleOptions();
    if (index >= 0 && index < vis.length) {
      vis[index].classList.add('is-active');
      vis[index].scrollIntoView({ block: 'nearest' });
    }
  }

  search.addEventListener('keydown', function (e) {
    var vis = visibleOptions();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, vis.length - 1);
      setActiveOption(activeIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      setActiveOption(activeIndex);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && vis[activeIndex]) {
        toggleOption(vis[activeIndex]);
      }
    }
  });

  function toggleOption(opt) {
    var value = opt.getAttribute('data-value');
    var checkbox = opt.querySelector('input[type="checkbox"]');
    var isSelected = selected.has(value);

    if (isSelected) {
      selected.delete(value);
      checkbox.checked = false;
      opt.setAttribute('aria-selected', 'false');
    } else {
      selected.add(value);
      checkbox.checked = true;
      opt.setAttribute('aria-selected', 'true');
    }
    renderChips();
  }

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      toggleOption(opt);
    });
  });

  function removeValue(value) {
    selected.delete(value);
    var opt = options.filter(function (o) { return o.getAttribute('data-value') === value; })[0];
    if (opt) {
      opt.querySelector('input[type="checkbox"]').checked = false;
      opt.setAttribute('aria-selected', 'false');
    }
    renderChips();
  }

  function renderChips() {
    var chipNodes = chipsWrap.querySelectorAll('.msd-chip');
    chipNodes.forEach(function (n) { n.remove(); });

    if (selected.size === 0) {
      placeholder.hidden = false;
      hint.textContent = '';
      return;
    }
    placeholder.hidden = true;

    selected.forEach(function (value) {
      var opt = options.filter(function (o) { return o.getAttribute('data-value') === value; })[0];
      if (!opt) return;
      var chip = document.createElement('span');
      chip.className = 'msd-chip';
      var text = document.createElement('span');
      text.textContent = labelFor(opt);
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'msd-chip-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + labelFor(opt));
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        removeValue(value);
      });
      chip.appendChild(text);
      chip.appendChild(removeBtn);
      chipsWrap.insertBefore(chip, placeholder);
    });

    hint.textContent = selected.size + ' crop' + (selected.size === 1 ? '' : 's') + ' selected.';

    if (!reduceMotion) {
      var last = chipsWrap.querySelectorAll('.msd-chip');
      var lastChip = last[last.length - 1];
      if (lastChip) {
        lastChip.animate(
          [{ transform: 'scale(0.85)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
          { duration: 160, easing: 'ease-out' }
        );
      }
    }
  }
})();
