(function () {
  var root = document.querySelector('.combo-root');
  if (!root) return;

  var input = root.querySelector('.combo-input');
  var listbox = root.querySelector('.combo-listbox');
  var status = document.querySelector('.combo-status');

  var ITEMS = [
    'Tomato — Cherokee Purple', 'Tomato — San Marzano', 'Tomato — Sun Gold',
    'Basil — Genovese', 'Basil — Thai', 'Basil — Lemon',
    'Kale — Lacinato', 'Kale — Red Russian',
    'Pepper — Jalapeño', 'Pepper — Bell', 'Pepper — Habanero',
    'Squash — Butternut', 'Squash — Zucchini',
    'Lettuce — Butterhead', 'Lettuce — Romaine',
    'Carrot — Nantes', 'Carrot — Purple Haze',
    'Cucumber — Persian', 'Cucumber — Pickling'
  ];

  var filtered = [];
  var activeIndex = -1;
  var isOpen = false;

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, query) {
    if (!query) return text;
    var re = new RegExp('(' + escapeRegExp(query) + ')', 'ig');
    return text.replace(re, '<mark>$1</mark>');
  }

  function optionId(index) {
    return 'combo-option-' + index;
  }

  function render(query) {
    listbox.innerHTML = '';
    filtered = query
      ? ITEMS.filter(function (item) { return item.toLowerCase().indexOf(query.toLowerCase()) !== -1; })
      : ITEMS.slice();

    if (filtered.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'combo-empty';
      empty.textContent = 'No varieties found.';
      listbox.appendChild(empty);
      activeIndex = -1;
      return;
    }

    filtered.forEach(function (item, index) {
      var li = document.createElement('li');
      li.className = 'combo-option';
      li.id = optionId(index);
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.innerHTML = highlight(item, query);
      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        selectItem(index);
      });
      listbox.appendChild(li);
    });

    activeIndex = -1;
  }

  function openList() {
    if (isOpen) return;
    isOpen = true;
    listbox.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function closeList() {
    isOpen = false;
    listbox.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-activedescendant', '');
    activeIndex = -1;
    clearActiveClasses();
  }

  function clearActiveClasses() {
    Array.prototype.forEach.call(listbox.querySelectorAll('.combo-option'), function (opt) {
      opt.classList.remove('is-active');
      opt.setAttribute('aria-selected', 'false');
    });
  }

  function setActive(index) {
    var options = listbox.querySelectorAll('.combo-option');
    if (!options.length) return;

    clearActiveClasses();
    activeIndex = (index + options.length) % options.length;

    var el = options[activeIndex];
    el.classList.add('is-active');
    el.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', el.id);
    el.scrollIntoView({ block: 'nearest' });
  }

  function selectItem(index) {
    var item = filtered[index];
    if (!item) return;
    input.value = item;
    closeList();
    status.textContent = 'Selected ' + item + '.';
    input.focus();
  }

  input.addEventListener('input', function () {
    render(input.value.trim());
    openList();
    status.textContent = filtered.length + ' result' + (filtered.length === 1 ? '' : 's') + ' available.';
  });

  input.addEventListener('focus', function () {
    render(input.value.trim());
    openList();
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) { render(input.value.trim()); openList(); }
      setActive(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) { render(input.value.trim()); openList(); }
      setActive(activeIndex - 1 < 0 ? listbox.querySelectorAll('.combo-option').length - 1 : activeIndex - 1);
    } else if (e.key === 'Enter') {
      if (isOpen && activeIndex > -1) {
        e.preventDefault();
        selectItem(activeIndex);
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        closeList();
      }
    } else if (e.key === 'Tab') {
      closeList();
    }
  });

  document.addEventListener('click', function (e) {
    if (!root.contains(e.target)) {
      closeList();
    }
  });
})();
