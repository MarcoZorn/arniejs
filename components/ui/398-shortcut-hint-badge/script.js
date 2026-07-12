(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var actions = Array.prototype.slice.call(document.querySelectorAll('.shb-action'));
  var log = document.getElementById('shb-log');
  var emptyEntry = log.querySelector('.shb-log-empty');

  var ACTION_MESSAGES = {
    save: 'Save triggered',
    search: 'Search opened',
    new: 'New item created',
    delete: 'Delete confirmed'
  };

  function addLogEntry(action, source) {
    if (emptyEntry && emptyEntry.parentNode) {
      emptyEntry.parentNode.removeChild(emptyEntry);
      emptyEntry = null;
    }
    var li = document.createElement('li');
    var time = new Date();
    var stamp = time.toLocaleTimeString();
    li.textContent = (ACTION_MESSAGES[action] || action) + ' via ' + source + '  [' + stamp + ']';
    if (source === 'keyboard') li.className = 'shb-log--keyboard';
    log.appendChild(li);
    while (log.children.length > 8) {
      log.removeChild(log.firstChild);
    }
  }

  function flash(btn) {
    btn.classList.add('shb-action--flash');
    var delay = reduceMotion ? 120 : 260;
    setTimeout(function () {
      btn.classList.remove('shb-action--flash');
    }, delay);
  }

  function findButtonByAction(action) {
    return actions.filter(function (btn) {
      return btn.dataset.action === action;
    })[0];
  }

  actions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      flash(btn);
      addLogEntry(btn.dataset.action, 'click');
    });
  });

  document.addEventListener('keydown', function (evt) {
    var key = (evt.key || '').toLowerCase();
    var ctrlOrMeta = evt.ctrlKey || evt.metaKey;
    if (!ctrlOrMeta) return;

    var actionName = null;

    if (key === 's') {
      actionName = 'save';
    } else if (key === 'k') {
      actionName = 'search';
    } else if (key === 'n') {
      actionName = 'new';
    } else if (key === 'backspace') {
      actionName = 'delete';
    }

    if (!actionName) return;

    // Block the browser's native handling (save dialog, new window, etc).
    evt.preventDefault();

    var btn = findButtonByAction(actionName);
    if (btn) flash(btn);
    addLogEntry(actionName, 'keyboard');
  });
})();
