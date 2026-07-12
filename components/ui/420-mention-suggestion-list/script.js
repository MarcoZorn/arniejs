(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var textarea = document.getElementById('mentionInput');
  var dropdown = document.getElementById('mentionDropdown');
  var postBtn = document.getElementById('mentionPostBtn');

  if (!textarea || !dropdown || !postBtn) return;

  var USERS = [
    { username: 'marlowe_greene', name: 'Marlowe Greene', initials: 'MG', color: '#5a7a3a' },
    { username: 'tobi_kwan', name: 'Tobi Kwan', initials: 'TK', color: '#c4622d' },
    { username: 'delphine.r', name: 'Delphine Ruiz', initials: 'DR', color: '#9b6b3a' },
    { username: 'priya.c', name: 'Priya Chandrasekaran', initials: 'PC', color: '#8fa86e' },
    { username: 'hanseoyeon', name: 'Han Seo-yeon', initials: 'HS', color: '#d4a85a' },
    { username: 'freya_l', name: 'Freya Lindqvist', initials: 'FL', color: '#a03820' },
    { username: 'kojo.a', name: 'Kojo Ampratwum', initials: 'KA', color: '#5a7a3a' },
    { username: 'rosa_iturbide', name: 'Rosa Iturbide', initials: 'RI', color: '#c4622d' }
  ];

  var activeIndex = -1;
  var currentMatches = [];
  var mentionStart = -1; // index of "@" in textarea value

  function findMentionQuery() {
    var value = textarea.value;
    var caret = textarea.selectionStart;
    if (caret === null || caret === undefined) return null;

    var at = value.lastIndexOf('@', caret - 1);
    if (at === -1) return null;

    var between = value.slice(at + 1, caret);
    if (/\s/.test(between)) return null;
    if (at > 0) {
      var prevChar = value.charAt(at - 1);
      if (!/\s/.test(prevChar) && prevChar !== '') return null;
    }

    return { start: at, query: between };
  }

  function renderDropdown(matches) {
    dropdown.innerHTML = '';
    currentMatches = matches;
    activeIndex = matches.length ? 0 : -1;

    if (!matches.length) {
      var empty = document.createElement('li');
      empty.className = 'mention-empty';
      empty.textContent = 'No matching gardeners';
      dropdown.appendChild(empty);
      dropdown.hidden = false;
      return;
    }

    matches.forEach(function (user, idx) {
      var li = document.createElement('li');
      li.className = 'mention-option' + (idx === activeIndex ? ' is-active' : '');
      li.setAttribute('role', 'option');
      li.dataset.index = String(idx);

      var avatar = document.createElement('span');
      avatar.className = 'mention-avatar';
      avatar.style.setProperty('--av-bg', user.color);
      avatar.textContent = user.initials;
      li.appendChild(avatar);

      var textWrap = document.createElement('span');
      textWrap.className = 'mention-option-text';

      var uname = document.createElement('span');
      uname.className = 'mention-username';
      uname.textContent = '@' + user.username;
      textWrap.appendChild(uname);

      var fullname = document.createElement('span');
      fullname.className = 'mention-fullname';
      fullname.textContent = user.name;
      textWrap.appendChild(fullname);

      li.appendChild(textWrap);

      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        applyMention(user);
      });

      dropdown.appendChild(li);
    });

    dropdown.hidden = false;
  }

  function updateActive() {
    var options = dropdown.querySelectorAll('.mention-option');
    options.forEach(function (opt, idx) {
      opt.classList.toggle('is-active', idx === activeIndex);
    });
  }

  function closeDropdown() {
    dropdown.hidden = true;
    dropdown.innerHTML = '';
    currentMatches = [];
    activeIndex = -1;
    mentionStart = -1;
  }

  function applyMention(user) {
    if (mentionStart === -1) return;
    var value = textarea.value;
    var caret = textarea.selectionStart;
    var before = value.slice(0, mentionStart);
    var after = value.slice(caret);
    var insertion = '@' + user.username + ' ';
    textarea.value = before + insertion + after;
    var newCaret = before.length + insertion.length;
    textarea.focus();
    textarea.setSelectionRange(newCaret, newCaret);
    closeDropdown();
  }

  function handleInput() {
    var match = findMentionQuery();
    if (!match) {
      closeDropdown();
      return;
    }
    mentionStart = match.start;
    var q = match.query.toLowerCase();
    var filtered = USERS.filter(function (u) {
      return u.username.toLowerCase().indexOf(q) !== -1 || u.name.toLowerCase().indexOf(q) !== -1;
    });
    renderDropdown(filtered);
  }

  textarea.addEventListener('input', handleInput);
  textarea.addEventListener('click', handleInput);

  textarea.addEventListener('keydown', function (e) {
    if (dropdown.hidden) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentMatches.length) {
        activeIndex = (activeIndex + 1) % currentMatches.length;
        updateActive();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentMatches.length) {
        activeIndex = (activeIndex - 1 + currentMatches.length) % currentMatches.length;
        updateActive();
      }
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (currentMatches.length && activeIndex > -1) {
        e.preventDefault();
        applyMention(currentMatches[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target !== textarea && !dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  postBtn.addEventListener('click', function () {
    if (!textarea.value.trim()) {
      textarea.focus();
      return;
    }
    var original = postBtn.textContent;
    postBtn.textContent = 'Posted';
    if (!reduceMotion) {
      postBtn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
        { duration: 200, easing: 'ease-out' }
      );
    }
    window.setTimeout(function () {
      postBtn.textContent = original;
      textarea.value = '';
      closeDropdown();
    }, 900);
  });
})();
