(function () {
  var content = document.getElementById('content');
  var toolbar = document.getElementById('toolbar');
  var toolbarMsg = document.getElementById('toolbarMsg');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var lastRange = null;
  var msgTimer = null;
  var hideTimer = null;

  function getSelectionInsideContent() {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      return null;
    }
    var range = sel.getRangeAt(0);
    if (!content.contains(range.commonAncestorContainer)) {
      return null;
    }
    if (!range.toString().trim()) {
      return null;
    }
    return range;
  }

  function positionToolbar(range) {
    var rect = range.getBoundingClientRect();
    var top = rect.top;
    var left = rect.left + rect.width / 2;

    toolbar.hidden = false;
    // clamp within viewport horizontally
    var half = 70;
    left = Math.max(half + 8, Math.min(window.innerWidth - half - 8, left));
    top = Math.max(48, top);

    toolbar.style.left = left + 'px';
    toolbar.style.top = top + 'px';
    requestAnimationFrame(function () {
      toolbar.classList.add('visible');
    });
  }

  function hideToolbar() {
    toolbar.classList.remove('visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      toolbar.hidden = true;
    }, reduceMotion ? 0 : 160);
  }

  function handleSelectionChange() {
    var range = getSelectionInsideContent();
    if (range) {
      lastRange = range.cloneRange();
      positionToolbar(range);
    } else {
      lastRange = null;
      hideToolbar();
    }
  }

  document.addEventListener('mouseup', function (e) {
    if (toolbar.contains(e.target)) {
      return;
    }
    setTimeout(handleSelectionChange, 0);
  });

  document.addEventListener('touchend', function () {
    setTimeout(handleSelectionChange, 0);
  });

  document.addEventListener('keyup', function (e) {
    if (e.key === 'Shift' || e.key.indexOf('Arrow') === 0) {
      handleSelectionChange();
    }
  });

  document.addEventListener('selectionchange', function () {
    var sel = window.getSelection();
    if (sel && sel.isCollapsed) {
      lastRange = null;
      hideToolbar();
    }
  });

  document.addEventListener('scroll', function () {
    if (lastRange) {
      hideToolbar();
    }
  }, true);

  function wrapRange(tagName, className) {
    if (!lastRange) return;
    try {
      var el = document.createElement(tagName);
      if (className) el.className = className;
      lastRange.surroundContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
    } catch (e) {
      // selection spans multiple elements; ignore gracefully
    }
  }

  function flashMessage(text) {
    toolbarMsg.textContent = text;
    toolbarMsg.classList.add('show');
    clearTimeout(msgTimer);
    msgTimer = setTimeout(function () {
      toolbarMsg.classList.remove('show');
    }, 1400);
  }

  toolbar.addEventListener('mousedown', function (e) {
    // prevent losing selection before click handler runs
    e.preventDefault();
  });

  toolbar.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !lastRange) return;
    var action = btn.getAttribute('data-action');
    var text = lastRange.toString();

    if (action === 'bold') {
      wrapRange('b', 'grove-bold');
      flashMessage('Bolded');
      hideToolbar();
    } else if (action === 'highlight') {
      wrapRange('mark', 'grove-mark');
      flashMessage('Highlighted');
      hideToolbar();
    } else if (action === 'copy') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          flashMessage('Copied');
        }).catch(function () {
          flashMessage('Copy failed');
        });
      } else {
        flashMessage('Copy unsupported');
      }
    }
  });
})();
