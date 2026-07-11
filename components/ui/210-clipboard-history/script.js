(function () {
  var copyButtons = Array.prototype.slice.call(document.querySelectorAll('.copy-btn'));
  var historyList = document.getElementById('historyList');
  var clearBtn = document.getElementById('clearHistory');
  var statusLine = document.getElementById('statusLine');
  var emptyItem = document.querySelector('[data-empty]');
  if (!historyList || !clearBtn) return;

  var MAX_ITEMS = 5;
  var history = [];

  function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var suffix = hours >= 12 ? 'PM' : 'AM';
    var h12 = hours % 12 || 12;
    var mm = minutes < 10 ? '0' + minutes : String(minutes);
    return h12 + ':' + mm + ' ' + suffix;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for browsers without the async Clipboard API.
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        var ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        ok ? resolve() : reject(new Error('execCommand copy failed'));
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  }

  function render() {
    historyList.innerHTML = '';

    if (history.length === 0) {
      var empty = emptyItem || document.createElement('li');
      empty.className = 'history__empty';
      empty.setAttribute('data-empty', '');
      empty.textContent = 'Nothing copied yet — use a Copy button above.';
      historyList.appendChild(empty);
      return;
    }

    history.forEach(function (entry) {
      var li = document.createElement('li');
      li.className = 'history__item';
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', 'Re-copy: ' + entry.text);

      var textEl = document.createElement('span');
      textEl.className = 'history__item-text';
      textEl.textContent = entry.text;

      var timeEl = document.createElement('span');
      timeEl.className = 'history__item-time';
      timeEl.textContent = formatTime(entry.time);

      li.appendChild(textEl);
      li.appendChild(timeEl);

      function reCopy() {
        copyText(entry.text).then(function () {
          if (statusLine) statusLine.textContent = 'Re-copied "' + entry.text + '" to clipboard.';
          addToHistory(entry.text);
        });
      }

      li.addEventListener('click', reCopy);
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          reCopy();
        }
      });

      historyList.appendChild(li);
    });
  }

  function addToHistory(text) {
    history = history.filter(function (entry) { return entry.text !== text; });
    history.unshift({ text: text, time: new Date() });
    history = history.slice(0, MAX_ITEMS);
    render();
  }

  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      copyText(text).then(function () {
        btn.classList.add('is-copied');
        var original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () {
          btn.classList.remove('is-copied');
          btn.textContent = original;
        }, 1200);

        if (statusLine) statusLine.textContent = 'Copied "' + text + '" to clipboard.';
        addToHistory(text);
      }).catch(function () {
        if (statusLine) statusLine.textContent = 'Could not access the clipboard in this browser.';
      });
    });
  });

  clearBtn.addEventListener('click', function () {
    history = [];
    render();
    if (statusLine) statusLine.textContent = 'Clipboard history cleared.';
  });

  render();
})();
