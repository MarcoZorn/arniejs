(function () {
  var tree = document.getElementById('tree');
  if (!tree) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getChildrenList(li) {
    // only the direct <ul class="children"> that belongs to this <li>
    for (var i = 0; i < li.children.length; i++) {
      var el = li.children[i];
      if (el.tagName === 'UL' && el.classList.contains('children')) return el;
    }
    return null;
  }

  function getToggleBtn(li) {
    var row = li.querySelector(':scope > .row');
    if (!row) return null;
    return row.querySelector('[data-toggle]');
  }

  function setExpanded(li, expand, instant) {
    var childrenEl = getChildrenList(li);
    if (!childrenEl) return;

    li.setAttribute('aria-expanded', expand ? 'true' : 'false');
    var btn = getToggleBtn(li);
    if (btn) btn.setAttribute('aria-expanded', expand ? 'true' : 'false');

    // clear any pending transitionend handler
    if (childrenEl._teHandler) {
      childrenEl.removeEventListener('transitionend', childrenEl._teHandler);
      childrenEl._teHandler = null;
    }

    if (reduced || instant) {
      if (expand) {
        childrenEl.style.display = 'block';
        childrenEl.style.maxHeight = 'none';
        childrenEl.style.opacity = '1';
      } else {
        childrenEl.style.display = 'none';
        childrenEl.style.maxHeight = '0px';
        childrenEl.style.opacity = '0';
      }
      return;
    }

    if (expand) {
      childrenEl.style.display = 'block';
      var targetHeight = childrenEl.scrollHeight;
      childrenEl.style.maxHeight = '0px';
      childrenEl.style.opacity = '0';
      // force reflow then animate
      void childrenEl.offsetHeight;
      requestAnimationFrame(function () {
        childrenEl.style.maxHeight = targetHeight + 'px';
        childrenEl.style.opacity = '1';
      });
      var onDone = function (e) {
        if (e.target !== childrenEl || e.propertyName !== 'max-height') return;
        childrenEl.style.maxHeight = 'none';
        childrenEl.removeEventListener('transitionend', onDone);
        childrenEl._teHandler = null;
      };
      childrenEl._teHandler = onDone;
      childrenEl.addEventListener('transitionend', onDone);
    } else {
      var current = childrenEl.scrollHeight;
      childrenEl.style.maxHeight = current + 'px';
      void childrenEl.offsetHeight;
      requestAnimationFrame(function () {
        childrenEl.style.maxHeight = '0px';
        childrenEl.style.opacity = '0';
      });
      var onDone2 = function (e) {
        if (e.target !== childrenEl || e.propertyName !== 'max-height') return;
        childrenEl.style.display = 'none';
        childrenEl.removeEventListener('transitionend', onDone2);
        childrenEl._teHandler = null;
      };
      childrenEl._teHandler = onDone2;
      childrenEl.addEventListener('transitionend', onDone2);
    }
  }

  function toggle(li) {
    var expanded = li.getAttribute('aria-expanded') === 'true';
    setExpanded(li, !expanded, false);
  }

  // initialise: sync DOM to whatever aria-expanded is authored in markup
  var allNodes = tree.querySelectorAll('.node[aria-expanded]');
  allNodes.forEach(function (li) {
    var expanded = li.getAttribute('aria-expanded') === 'true';
    setExpanded(li, expanded, true);
  });

  tree.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    var li = btn.closest('.node');
    if (!li) return;
    toggle(li);
  });

  // keyboard support: left/right arrows collapse/expand, matching typical tree widgets
  tree.addEventListener('keydown', function (e) {
    var btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    var li = btn.closest('.node');
    if (!li) return;
    var expanded = li.getAttribute('aria-expanded') === 'true';

    if (e.key === 'ArrowRight' && !expanded) {
      e.preventDefault();
      setExpanded(li, true, false);
    } else if (e.key === 'ArrowLeft' && expanded) {
      e.preventDefault();
      setExpanded(li, false, false);
    }
  });
})();
