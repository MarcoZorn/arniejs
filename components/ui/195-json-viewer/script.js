(function () {
  var data = {
    id: "usr_8231",
    name: "Ada Lovelace",
    active: true,
    balance: 1042.5,
    tags: ["engineer", "mathematician", "pioneer"],
    address: {
      street: "12 Mill Lane",
      city: "London",
      postcode: null
    },
    roles: [
      { name: "admin", level: 9 },
      { name: "editor", level: 4 }
    ],
    lastLogin: "2026-07-10T09:41:00Z"
  };

  var tree = document.getElementById('jsonTree');
  var expandAllBtn = document.getElementById('expandAllBtn');
  var collapseAllBtn = document.getElementById('collapseAllBtn');

  function typeOf(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  function formatPrimitive(value, type) {
    var span = document.createElement('span');
    span.className = 'json-type-' + type;
    if (type === 'string') {
      span.textContent = '"' + value + '"';
    } else {
      span.textContent = String(value);
    }
    return span;
  }

  function buildNode(key, value, isLast, depth) {
    var type = typeOf(value);
    var isContainer = type === 'object' || type === 'array';
    var node = document.createElement('div');
    node.className = 'json-node';

    var line = document.createElement('div');
    line.className = 'json-node__line';

    var toggle = document.createElement('span');
    toggle.className = 'json-toggle';
    toggle.textContent = isContainer ? '▾' : '';
    line.appendChild(toggle);

    if (key !== null) {
      var keySpan = document.createElement('span');
      keySpan.className = 'json-key';
      keySpan.textContent = '"' + key + '"';
      line.appendChild(keySpan);

      var colon = document.createElement('span');
      colon.className = 'json-punct';
      colon.textContent = ': ';
      line.appendChild(colon);
    }

    if (isContainer) {
      var entries = type === 'array'
        ? value.map(function (v, i) { return [i, v]; })
        : Object.keys(value).map(function (k) { return [k, value[k]]; });

      var openBrace = document.createElement('span');
      openBrace.className = 'json-punct';
      openBrace.textContent = type === 'array' ? '[' : '{';
      line.appendChild(openBrace);

      var summary = document.createElement('span');
      summary.className = 'json-summary';
      summary.textContent = entries.length + (entries.length === 1 ? ' item' : ' items') + (type === 'array' ? ']' : '}');
      line.appendChild(summary);

      line.classList.add('is-toggle');
      node.appendChild(line);

      var children = document.createElement('div');
      children.className = 'json-children';
      entries.forEach(function (entry, i) {
        children.appendChild(buildNode(type === 'array' ? null : entry[0], entry[1], i === entries.length - 1, depth + 1));
      });
      node.appendChild(children);

      var closeLine = document.createElement('div');
      closeLine.className = 'json-close';
      var closeBrace = document.createElement('span');
      closeBrace.className = 'json-punct';
      closeBrace.textContent = (type === 'array' ? ']' : '}') + (isLast ? '' : ',');
      closeLine.appendChild(closeBrace);
      children.appendChild(closeLine);

      line.addEventListener('click', function () {
        node.classList.toggle('is-collapsed');
        toggle.textContent = node.classList.contains('is-collapsed') ? '▸' : '▾';
      });
    } else {
      line.appendChild(formatPrimitive(value, type));
      var comma = document.createElement('span');
      comma.className = 'json-punct';
      comma.textContent = isLast ? '' : ',';
      line.appendChild(comma);
      node.appendChild(line);
    }

    return node;
  }

  tree.appendChild(buildNode(null, data, true, 0));

  function setAllCollapsed(collapsed) {
    tree.querySelectorAll('.json-node').forEach(function (node) {
      var toggle = node.querySelector(':scope > .json-node__line .json-toggle');
      if (!toggle || toggle.textContent === '') return;
      node.classList.toggle('is-collapsed', collapsed);
      toggle.textContent = collapsed ? '▸' : '▾';
    });
  }

  expandAllBtn.addEventListener('click', function () { setAllCollapsed(false); });
  collapseAllBtn.addEventListener('click', function () { setAllCollapsed(true); });
})();
