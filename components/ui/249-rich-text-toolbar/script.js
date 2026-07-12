(function () {
  var card = document.querySelector('.richtb-card');
  if (!card) return;

  var editor = card.querySelector('.richtb-editor');
  var toolbar = card.querySelector('.richtb-toolbar');
  var note = card.querySelector('.richtb-note');
  var buttons = Array.prototype.slice.call(toolbar.querySelectorAll('.richtb-btn'));
  var noteTimer = null;

  function showNote(text) {
    if (!note) return;
    note.textContent = text;
    window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(function () {
      note.textContent = '';
    }, 2600);
  }

  function updateButtonStates() {
    buttons.forEach(function (btn) {
      var cmd = btn.getAttribute('data-cmd');
      if (cmd === 'link') return;
      var active = false;
      try {
        active = document.queryCommandState(cmd);
      } catch (e) {
        active = false;
      }
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function selectionInsideEditor() {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    var node = sel.getRangeAt(0).commonAncestorContainer;
    return editor.contains(node);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('mousedown', function (e) {
      // Preserve the current selection through the button click.
      e.preventDefault();
    });

    btn.addEventListener('click', function () {
      editor.focus();
      var cmd = btn.getAttribute('data-cmd');

      if (cmd === 'link') {
        var sel = window.getSelection();
        if (!sel || sel.isCollapsed || !selectionInsideEditor()) {
          showNote('Select some text first, then add a link.');
          return;
        }
        var url = window.prompt('Link URL:', 'https://');
        if (!url) return;
        try {
          document.execCommand('createLink', false, url);
          showNote('Link planted.');
        } catch (e) {
          showNote('Could not create link.');
        }
      } else {
        try {
          document.execCommand(cmd, false, null);
        } catch (e) {
          /* no-op */
        }
      }

      updateButtonStates();
    });
  });

  document.addEventListener('selectionchange', function () {
    if (!selectionInsideEditor()) return;
    updateButtonStates();
  });

  editor.addEventListener('keyup', updateButtonStates);
  editor.addEventListener('mouseup', updateButtonStates);
  editor.addEventListener('focus', updateButtonStates);
})();
