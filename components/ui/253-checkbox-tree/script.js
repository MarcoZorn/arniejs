(function () {
  var tree = document.querySelector('.ctree-tree');
  if (!tree) return;

  var checkboxes = Array.prototype.slice.call(tree.querySelectorAll('.ctree-checkbox'));
  var summary = document.querySelector('.ctree-summary');

  function getChildren(id) {
    return checkboxes.filter(function (cb) {
      return cb.getAttribute('data-parent') === id;
    });
  }

  function getParent(cb) {
    var parentId = cb.getAttribute('data-parent');
    if (!parentId) return null;
    return checkboxes.filter(function (c) {
      return c.getAttribute('data-id') === parentId;
    })[0] || null;
  }

  function setDescendants(cb, checked) {
    var id = cb.getAttribute('data-id');
    var children = getChildren(id);
    children.forEach(function (child) {
      child.checked = checked;
      child.indeterminate = false;
      setDescendants(child, checked);
    });
  }

  function refreshAncestors(cb) {
    var parent = getParent(cb);
    while (parent) {
      var siblings = getChildren(parent.getAttribute('data-id'));
      var checkedCount = siblings.filter(function (s) { return s.checked && !s.indeterminate; }).length;
      var indeterminateCount = siblings.filter(function (s) { return s.indeterminate; }).length;

      if (checkedCount === siblings.length) {
        parent.checked = true;
        parent.indeterminate = false;
      } else if (checkedCount > 0 || indeterminateCount > 0) {
        parent.checked = false;
        parent.indeterminate = true;
      } else {
        parent.checked = false;
        parent.indeterminate = false;
      }

      parent = getParent(parent);
    }
  }

  function updateSummary() {
    var leafBoxes = checkboxes.filter(function (cb) {
      return getChildren(cb.getAttribute('data-id')).length === 0;
    });
    var checkedLeaves = leafBoxes.filter(function (cb) { return cb.checked; }).length;

    if (checkedLeaves === 0) {
      summary.textContent = 'No plots selected yet.';
    } else {
      summary.textContent = checkedLeaves + ' of ' + leafBoxes.length + ' plots selected.';
    }
  }

  checkboxes.forEach(function (cb) {
    cb.addEventListener('change', function () {
      setDescendants(cb, cb.checked);
      cb.indeterminate = false;
      refreshAncestors(cb);
      updateSummary();
    });
  });

  // Collapse / expand toggles.
  var toggles = Array.prototype.slice.call(tree.querySelectorAll('.ctree-toggle'));
  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var node = toggle.closest('.ctree-node');
      var collapsed = node.classList.toggle('is-collapsed');
      node.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      var label = collapsed ? 'Expand' : 'Collapse';
      var name = toggle.parentElement.querySelector('.ctree-label span').textContent;
      toggle.setAttribute('aria-label', label + ' ' + name);
      toggle.textContent = '▾';
    });
  });

  updateSummary();
})();
