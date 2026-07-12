(function () {
  var root = document.querySelector('[data-mention-root]');
  if (!root) return;

  var textarea = root.querySelector('.mention-textarea');
  var dropdown = root.querySelector('.mention-dropdown');

  var USERS = [
    { username: 'moss', name: 'Moss Rivera' },
    { username: 'sage', name: 'Sage Okafor' },
    { username: 'clay', name: 'Clay Nakamura' },
    { username: 'sandy', name: 'Sandy Lindgren' },
    { username: 'terra', name: 'Terra Boone' },
    { username: 'rusty', name: 'Rusty Malone' },
    { username: 'fern', name: 'Fern Delacroix' },
    { username: 'briar', name: 'Briar Song' }
  ];

  var state = {
    open: false,
    matches: [],
    activeIndex: 0,
    triggerStart: -1
  };

  var mirror = document.createElement('div');
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  mirror.style.top = '0';
  mirror.style.left = '-9999px';
  document.body.appendChild(mirror);

  function copyStyles() {
    var cs = window.getComputedStyle(textarea);
    ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'padding', 'border', 'boxSizing', 'width'].forEach(function (prop) {
      mirror.style[prop] = cs[prop];
    });
  }

  function caretCoords() {
    copyStyles();
    var value = textarea.value;
    var pos = textarea.selectionStart;
    mirror.textContent = value.slice(0, pos);
    var marker = document.createElement('span');
    marker.textContent = '​';
    mirror.appendChild(marker);
    var mRect = marker.getBoundingClientRect();
    var tRect = textarea.getBoundingClientRect();
    return {
      top: (mRect.top - tRect.top) - textarea.scrollTop + parseFloat(window.getComputedStyle(textarea).lineHeight || 20),
      left: mRect.left - tRect.left
    };
  }

  function findTrigger() {
    var pos = textarea.selectionStart;
    var value = textarea.value;
    var upToCaret = value.slice(0, pos);
    var at = upToCaret.lastIndexOf('@');
    if (at === -1) return null;
    var between = upToCaret.slice(at + 1);
    if (/[\s@]/.test(between)) return null;
    return { start: at, query: between };
  }

  function renderOptions(query) {
    var q = query.toLowerCase();
    state.matches = USERS.filter(function (u) {
      return u.username.toLowerCase().indexOf(q) === 0;
    });

    dropdown.innerHTML = '';

    if (state.matches.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'mention-empty';
      empty.textContent = 'No gardeners found';
      dropdown.appendChild(empty);
      return;
    }

    state.matches.forEach(function (user, i) {
      var li = document.createElement('li');
      li.className = 'mention-option';
      li.setAttribute('role', 'option');
      li.setAttribute('data-index', String(i));
      if (i === state.activeIndex) li.classList.add('is-active');

      var avatar = document.createElement('span');
      avatar.className = 'mention-avatar';
      avatar.textContent = user.username.charAt(0);

      var label = document.createElement('span');
      label.textContent = user.name + ' ';

      var uname = document.createElement('span');
      uname.className = 'mention-username';
      uname.textContent = '@' + user.username;

      li.appendChild(avatar);
      li.appendChild(label);
      li.appendChild(uname);

      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        insertMention(i);
      });

      dropdown.appendChild(li);
    });
  }

  function openDropdown(query) {
    renderOptions(query);
    var coords = caretCoords();
    dropdown.style.top = coords.top + 'px';
    dropdown.style.left = Math.max(0, coords.left) + 'px';
    dropdown.hidden = false;
    state.open = true;
  }

  function closeDropdown() {
    state.open = false;
    dropdown.hidden = true;
    dropdown.innerHTML = '';
  }

  function insertMention(index) {
    var user = state.matches[index];
    if (!user) return;
    var trigger = findTrigger();
    if (!trigger) { closeDropdown(); return; }

    var value = textarea.value;
    var pos = textarea.selectionStart;
    var before = value.slice(0, trigger.start);
    var after = value.slice(pos);
    var insertText = '@' + user.username + ' ';
    var newValue = before + insertText + after;
    textarea.value = newValue;

    var newPos = before.length + insertText.length;
    textarea.setSelectionRange(newPos, newPos);
    closeDropdown();
    textarea.focus();
  }

  textarea.addEventListener('input', function () {
    var trigger = findTrigger();
    if (trigger) {
      state.activeIndex = 0;
      state.triggerStart = trigger.start;
      openDropdown(trigger.query);
    } else {
      closeDropdown();
    }
  });

  textarea.addEventListener('keydown', function (e) {
    if (!state.open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (state.matches.length === 0) return;
      state.activeIndex = (state.activeIndex + 1) % state.matches.length;
      var trigger = findTrigger();
      if (trigger) renderOptions(trigger.query);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.matches.length === 0) return;
      state.activeIndex = (state.activeIndex - 1 + state.matches.length) % state.matches.length;
      var trigger2 = findTrigger();
      if (trigger2) renderOptions(trigger2.query);
    } else if (e.key === 'Enter') {
      if (state.matches.length === 0) return;
      e.preventDefault();
      insertMention(state.activeIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  });

  textarea.addEventListener('blur', function () {
    window.setTimeout(closeDropdown, 120);
  });
})();
