(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var input = document.getElementById('jtv-input');
  var renderBtn = document.getElementById('jtv-render');
  var expandAllBtn = document.getElementById('jtv-expand-all');
  var collapseAllBtn = document.getElementById('jtv-collapse-all');
  var errorEl = document.getElementById('jtv-error');
  var treeEl = document.getElementById('jtv-tree');

  var defaultJson = {
    project: 'ArnieJS',
    version: 1.4,
    active: true,
    maintainer: {
      name: 'Arnie',
      roles: ['gardener', 'engineer'],
      contact: null
    },
    components: [
      { id: 391, name: 'json-tree-viewer', tags: ['utility', 'dev-tool'] },
      { id: 392, name: 'diff-highlighter', tags: ['utility'] }
    ],
    notes: 'Grown one component at a time.'
  };

  input.value = JSON.stringify(defaultJson, null, 2);

  function typeOf(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatPrimitive(value) {
    var t = typeOf(value);
    if (t === 'string') {
      return '<span class="jtv-type-string">"' + escapeHtml(value) + '"</span>';
    }
    if (t === 'number') {
      return '<span class="jtv-type-number">' + value + '</span>';
    }
    if (t === 'boolean') {
      return '<span class="jtv-type-boolean">' + value + '</span>';
    }
    return '<span class="jtv-type-null">null</span>';
  }

  // Builds a real DOM subtree for a value; objects/arrays get a toggle button
  // that shows/hides an actual child container (not CSS-only).
  function buildNode(key, value, depth) {
    var t = typeOf(value);
    var row = document.createElement('div');
    row.className = 'jtv-node';

    if (t === 'object' || t === 'array') {
      var keys = t === 'array' ? value.map(function (_, i) { return i; }) : Object.keys(value);
      var isEmpty = keys.length === 0;

      var headerRow = document.createElement('div');
      headerRow.className = 'jtv-node-row';

      var toggle;
      if (!isEmpty) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'jtv-toggle';
        toggle.textContent = depth < 1 ? '▾' : '▸';
        toggle.setAttribute('aria-expanded', depth < 1 ? 'true' : 'false');
      } else {
        toggle = document.createElement('span');
        toggle.className = 'jtv-toggle-spacer';
      }
      headerRow.appendChild(toggle);

      var label = document.createElement('span');
      var openBracket = t === 'array' ? '[' : '{';
      var closeBracket = t === 'array' ? ']' : '}';
      var keyHtml = key !== null ? '<span class="jtv-key">' + escapeHtml(key) + '</span><span class="jtv-punct">: </span>' : '';
      var summary = isEmpty
        ? '<span class="jtv-punct">' + openBracket + closeBracket + '</span>'
        : '<span class="jtv-punct">' + openBracket + '</span> <span class="jtv-summary">' + keys.length + (t === 'array' ? ' items' : ' keys') + '</span><span class="jtv-punct"> ' + closeBracket + '</span>';
      label.innerHTML = keyHtml + summary;
      headerRow.appendChild(label);
      row.appendChild(headerRow);

      if (!isEmpty) {
        var childWrap = document.createElement('div');
        childWrap.className = 'jtv-children';
        if (depth >= 1) childWrap.hidden = true;

        keys.forEach(function (k) {
          childWrap.appendChild(buildNode(k, value[t === 'array' ? k : k], depth + 1));
        });
        row.appendChild(childWrap);

        toggle.addEventListener('click', function () {
          var isHidden = childWrap.hasAttribute('hidden');
          if (isHidden) {
            childWrap.removeAttribute('hidden');
            toggle.textContent = '▾';
            toggle.setAttribute('aria-expanded', 'true');
          } else {
            childWrap.setAttribute('hidden', '');
            toggle.textContent = '▸';
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      }
    } else {
      var leafRow = document.createElement('div');
      leafRow.className = 'jtv-node-row';
      var spacer = document.createElement('span');
      spacer.className = 'jtv-toggle-spacer';
      leafRow.appendChild(spacer);
      var leafLabel = document.createElement('span');
      var leafKeyHtml = key !== null ? '<span class="jtv-key">' + escapeHtml(key) + '</span><span class="jtv-punct">: </span>' : '';
      leafLabel.innerHTML = leafKeyHtml + formatPrimitive(value);
      leafRow.appendChild(leafLabel);
      row.appendChild(leafRow);
    }

    return row;
  }

  function render() {
    var raw = input.value;
    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      errorEl.textContent = 'Parse error: ' + err.message;
      treeEl.innerHTML = '';
      return;
    }
    errorEl.textContent = '';
    treeEl.innerHTML = '';
    treeEl.appendChild(buildNode(null, parsed, 0));
  }

  function setAllToggles(expand) {
    var toggles = treeEl.querySelectorAll('.jtv-toggle');
    toggles.forEach(function (toggle) {
      var childWrap = toggle.parentElement.parentElement.querySelector('.jtv-children');
      if (!childWrap) return;
      if (expand) {
        childWrap.removeAttribute('hidden');
        toggle.textContent = '▾';
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        childWrap.setAttribute('hidden', '');
        toggle.textContent = '▸';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  renderBtn.addEventListener('click', render);
  expandAllBtn.addEventListener('click', function () { setAllToggles(true); });
  collapseAllBtn.addEventListener('click', function () { setAllToggles(false); });

  input.addEventListener('input', function () {
    // live-update, debounced lightly via rAF for responsiveness
    if (reduceMotion) {
      render();
      return;
    }
    window.requestAnimationFrame(render);
  });

  render();
})();
