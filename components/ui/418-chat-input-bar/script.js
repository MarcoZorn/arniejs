(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var messages = document.getElementById('inputbarMessages');
  var chipRow = document.getElementById('inputbarChipRow');
  var popover = document.getElementById('inputbarPopover');
  var emojiBtn = document.getElementById('inputbarEmojiBtn');
  var attachBtn = document.getElementById('inputbarAttachBtn');
  var textInput = document.getElementById('inputbarText');
  var form = document.getElementById('inputbarForm');

  if (!messages || !chipRow || !popover || !emojiBtn || !attachBtn || !textInput || !form) return;

  var SAMPLE_FILES = ['plot-layout.pdf', 'soil-readings.csv', 'shade-sketch.png'];
  var fileIndex = 0;
  var attachedFiles = [];

  function togglePopover(show) {
    var open = show !== undefined ? show : popover.hidden;
    popover.hidden = !open;
    emojiBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    emojiBtn.classList.toggle('is-active', open);
  }

  emojiBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    togglePopover();
  });

  document.addEventListener('click', function (e) {
    if (!popover.hidden && !popover.contains(e.target) && e.target !== emojiBtn) {
      togglePopover(false);
    }
  });

  Array.prototype.slice.call(popover.querySelectorAll('.inputbar-emoji')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      insertAtCursor(btn.getAttribute('data-emoji'));
      textInput.focus();
    });
  });

  function insertAtCursor(str) {
    var start = textInput.selectionStart;
    var end = textInput.selectionEnd;
    if (start === null || start === undefined) start = end = textInput.value.length;
    var val = textInput.value;
    textInput.value = val.slice(0, start) + str + val.slice(end);
    var pos = start + str.length;
    textInput.setSelectionRange(pos, pos);
  }

  attachBtn.addEventListener('click', function () {
    var name = SAMPLE_FILES[fileIndex % SAMPLE_FILES.length];
    fileIndex += 1;
    var chipId = 'chip-' + Date.now() + '-' + fileIndex;
    attachedFiles.push({ id: chipId, name: name });

    var chip = document.createElement('span');
    chip.className = 'inputbar-chip';
    chip.dataset.id = chipId;

    var label = document.createElement('span');
    label.textContent = '📄 ' + name;
    chip.appendChild(label);

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'inputbar-chip-remove';
    removeBtn.setAttribute('aria-label', 'Remove ' + name);
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', function () {
      attachedFiles = attachedFiles.filter(function (f) { return f.id !== chipId; });
      chip.remove();
    });
    chip.appendChild(removeBtn);

    chipRow.appendChild(chip);
  });

  function addMessage(text) {
    var row = document.createElement('div');
    row.className = 'inputbar-msg inputbar-msg--me';

    var bubble = document.createElement('div');
    bubble.className = 'inputbar-bubble inputbar-bubble--me';

    var p = document.createElement('p');
    p.className = 'inputbar-text';
    p.textContent = text;
    bubble.appendChild(p);
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;

    if (!reduceMotion) {
      row.animate(
        [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 200, easing: 'ease-out' }
      );
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = textInput.value.trim();

    attachedFiles.forEach(function (f) {
      addMessage('📄 ' + f.name);
    });

    if (text) addMessage(text);

    if (!text && attachedFiles.length === 0) {
      textInput.focus();
      return;
    }

    textInput.value = '';
    attachedFiles = [];
    chipRow.innerHTML = '';
    togglePopover(false);
    textInput.focus();
  });
})();
