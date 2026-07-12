(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var data = [
    {
      name: 'north-plot',
      type: 'folder',
      children: [
        {
          name: 'soil-readings',
          type: 'folder',
          children: [
            { name: 'ph-log-march.csv', type: 'file', meta: '14 KB' },
            { name: 'ph-log-april.csv', type: 'file', meta: '15 KB' },
            { name: 'moisture-sensors.json', type: 'file', meta: '9 KB' }
          ]
        },
        {
          name: 'irrigation',
          type: 'folder',
          children: [
            { name: 'schedule.yaml', type: 'file', meta: '2 KB' },
            { name: 'valve-map.svg', type: 'file', meta: '31 KB' }
          ]
        },
        { name: 'planting-plan.pdf', type: 'file', meta: '220 KB' }
      ]
    },
    {
      name: 'south-plot',
      type: 'folder',
      children: [
        {
          name: 'harvest-2025',
          type: 'folder',
          children: [
            { name: 'tomato-yield.csv', type: 'file', meta: '11 KB' },
            { name: 'squash-yield.csv', type: 'file', meta: '8 KB' },
            {
              name: 'photos',
              type: 'folder',
              children: [
                { name: 'week-01.jpg', type: 'file', meta: '1.2 MB' },
                { name: 'week-02.jpg', type: 'file', meta: '1.4 MB' }
              ]
            }
          ]
        },
        { name: 'pest-alerts.log', type: 'file', meta: '4 KB' }
      ]
    },
    {
      name: 'greenhouse',
      type: 'folder',
      children: [
        { name: 'climate-control.json', type: 'file', meta: '3 KB' },
        { name: 'seedling-inventory.csv', type: 'file', meta: '6 KB' }
      ]
    },
    { name: 'field-notes.md', type: 'file', meta: '18 KB' },
    { name: 'compost-log.txt', type: 'file', meta: '5 KB' }
  ];

  var folderIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>';
  var fileIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
  var chevronIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';

  var root = document.getElementById('tvwTree');
  if (!root) return;

  function buildNode(item, depth) {
    var li = document.createElement('li');
    li.setAttribute('role', 'none');

    var isFolder = item.type === 'folder' && item.children && item.children.length;

    var row = document.createElement('div');
    row.className = 'tvw-node ' + (isFolder ? 'tvw-node--folder' : 'tvw-node--file tvw-node--leaf');
    row.setAttribute('role', 'treeitem');
    row.setAttribute('aria-level', String(depth));
    row.setAttribute('tabindex', '-1');
    if (isFolder) {
      row.setAttribute('aria-expanded', 'false');
    }
    row.dataset.name = item.name;

    var chevron = document.createElement('span');
    chevron.className = 'tvw-chevron';
    chevron.innerHTML = chevronIcon;
    row.appendChild(chevron);

    var icon = document.createElement('span');
    icon.className = 'tvw-icon';
    icon.innerHTML = isFolder ? folderIcon : fileIcon;
    row.appendChild(icon);

    var label = document.createElement('span');
    label.className = 'tvw-label';
    label.textContent = item.name;
    row.appendChild(label);

    if (item.meta) {
      var meta = document.createElement('span');
      meta.className = 'tvw-meta';
      meta.textContent = item.meta;
      row.appendChild(meta);
    }

    li.appendChild(row);

    if (isFolder) {
      var childList = document.createElement('ul');
      childList.className = 'tvw-children';
      childList.setAttribute('role', 'group');
      childList.hidden = true;

      item.children.forEach(function (child) {
        childList.appendChild(buildNode(child, depth + 1));
      });

      li.appendChild(childList);
    }

    return li;
  }

  data.forEach(function (item) {
    root.appendChild(buildNode(item, 1));
  });

  // ---- interaction wiring ----

  function getAllRows() {
    return Array.prototype.slice.call(root.querySelectorAll('.tvw-node'));
  }

  function getVisibleRows() {
    return getAllRows().filter(function (row) {
      var parentList = row.closest('.tvw-children');
      while (parentList) {
        if (parentList.hidden) return false;
        parentList = parentList.parentElement ? parentList.parentElement.closest('.tvw-children') : null;
      }
      return true;
    });
  }

  var currentTabbable = null;

  function setTabbable(row) {
    getAllRows().forEach(function (r) {
      r.setAttribute('tabindex', '-1');
      r.classList.remove('is-focused');
    });
    row.setAttribute('tabindex', '0');
    row.classList.add('is-focused');
    currentTabbable = row;
  }

  function focusRow(row) {
    if (!row) return;
    setTabbable(row);
    row.focus();
  }

  function isFolderRow(row) {
    return row.classList.contains('tvw-node--folder');
  }

  function getChildList(row) {
    var li = row.parentElement;
    return li ? li.querySelector(':scope > .tvw-children') : null;
  }

  function expand(row) {
    if (!isFolderRow(row)) return;
    var list = getChildList(row);
    if (!list) return;
    list.hidden = false;
    row.setAttribute('aria-expanded', 'true');
  }

  function collapse(row) {
    if (!isFolderRow(row)) return;
    var list = getChildList(row);
    if (!list) return;
    list.hidden = true;
    row.setAttribute('aria-expanded', 'false');
  }

  function toggle(row) {
    if (!isFolderRow(row)) return;
    if (row.getAttribute('aria-expanded') === 'true') {
      collapse(row);
    } else {
      expand(row);
    }
  }

  function selectRow(row) {
    getAllRows().forEach(function (r) { r.classList.remove('is-selected'); });
    row.classList.add('is-selected');
  }

  function parentRowOf(row) {
    var group = row.closest('.tvw-children');
    if (!group) return null;
    var parentLi = group.closest('li');
    return parentLi ? parentLi.querySelector(':scope > .tvw-node') : null;
  }

  root.addEventListener('click', function (e) {
    var row = e.target.closest('.tvw-node');
    if (!row) return;
    selectRow(row);
    focusRow(row);
    toggle(row);
  });

  root.addEventListener('keydown', function (e) {
    var row = e.target.closest('.tvw-node');
    if (!row) return;
    var visible = getVisibleRows();
    var idx = visible.indexOf(row);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (idx < visible.length - 1) focusRow(visible[idx + 1]);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (idx > 0) focusRow(visible[idx - 1]);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (isFolderRow(row)) {
          if (row.getAttribute('aria-expanded') !== 'true') {
            expand(row);
          } else {
            var list = getChildList(row);
            var firstChild = list && list.querySelector('.tvw-node');
            if (firstChild) focusRow(firstChild);
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (isFolderRow(row) && row.getAttribute('aria-expanded') === 'true') {
          collapse(row);
        } else {
          var parent = parentRowOf(row);
          if (parent) focusRow(parent);
        }
        break;
      case 'Home':
        e.preventDefault();
        if (visible[0]) focusRow(visible[0]);
        break;
      case 'End':
        e.preventDefault();
        if (visible[visible.length - 1]) focusRow(visible[visible.length - 1]);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectRow(row);
        toggle(row);
        break;
    }
  });

  // initial roving tabindex target: first row
  var first = root.querySelector('.tvw-node');
  if (first) {
    setTabbable(first);
  }
})();
