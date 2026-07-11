(function () {
  var openBtn = document.getElementById('openBtn');
  var overlay = document.getElementById('overlay');
  var palette = document.getElementById('palette');
  var input = document.getElementById('paletteInput');
  var list = document.getElementById('paletteList');
  var empty = document.getElementById('paletteEmpty');
  if (!overlay || !palette || !input || !list) return;

  var ITEMS = [
    { icon: '🏡', title: 'Go to Homestead', cat: 'Navigate' },
    { icon: '🌱', title: 'Seedlings tracker', cat: 'Navigate' },
    { icon: '🪵', title: 'Timber inventory', cat: 'Navigate' },
    { icon: '🧺', title: 'Harvest log', cat: 'Navigate' },
    { icon: '💧', title: 'Water all plots', cat: 'Action' },
    { icon: '✂️', title: 'Schedule pruning', cat: 'Action' },
    { icon: '📓', title: 'New journal entry', cat: 'Action' },
    { icon: '🌦️', title: 'Check weather forecast', cat: 'Action' },
    { icon: '🐛', title: 'Report pest sighting', cat: 'Action' },
    { icon: '⚙️', title: 'Open settings', cat: 'System' },
    { icon: '👤', title: 'Edit profile', cat: 'System' },
    { icon: '🚪', title: 'Sign out', cat: 'System' }
  ];

  var activeIndex = 0;
  var filtered = ITEMS.slice();
  var lastFocused = null;

  function fuzzyMatch(query, text) {
    query = query.toLowerCase();
    text = text.toLowerCase();
    if (!query) return { match: true, score: 0 };
    var qi = 0;
    var score = 0;
    var lastIndex = -1;
    for (var i = 0; i < text.length && qi < query.length; i++) {
      if (text[i] === query[qi]) {
        score += (lastIndex === i - 1) ? 3 : 1;
        lastIndex = i;
        qi++;
      }
    }
    return { match: qi === query.length, score: score };
  }

  function highlight(text, query) {
    if (!query) return text;
    var lower = text.toLowerCase();
    var qLower = query.toLowerCase();
    var qi = 0;
    var out = '';
    for (var i = 0; i < text.length; i++) {
      if (qi < qLower.length && lower[i] === qLower[qi]) {
        out += '<mark>' + text[i] + '</mark>';
        qi++;
      } else {
        out += text[i];
      }
    }
    return out;
  }

  function render(query) {
    var results = ITEMS.map(function (item) {
      var m = fuzzyMatch(query, item.title);
      return { item: item, match: m.match, score: m.score };
    }).filter(function (r) { return r.match; })
      .sort(function (a, b) { return b.score - a.score; });

    filtered = results.map(function (r) { return r.item; });
    activeIndex = 0;
    list.innerHTML = '';

    if (filtered.length === 0) {
      empty.hidden = false;
    } else {
      empty.hidden = true;
      filtered.forEach(function (item, i) {
        var li = document.createElement('li');
        li.className = 'palette-item' + (i === 0 ? ' active' : '');
        li.setAttribute('role', 'option');
        li.innerHTML =
          '<span class="palette-item-icon">' + item.icon + '</span>' +
          '<span class="palette-item-main">' +
          '<span class="palette-item-title">' + highlight(item.title, query) + '</span>' +
          '<span class="palette-item-cat">' + item.cat + '</span>' +
          '</span>';
        li.addEventListener('mouseenter', function () {
          setActive(i);
        });
        li.addEventListener('click', function () {
          choose(i);
        });
        list.appendChild(li);
      });
    }
  }

  function setActive(i) {
    var items = list.querySelectorAll('.palette-item');
    items.forEach(function (el) { el.classList.remove('active'); });
    if (items[i]) {
      items[i].classList.add('active');
      items[i].scrollIntoView({ block: 'nearest' });
    }
    activeIndex = i;
  }

  function choose(i) {
    var item = filtered[i];
    if (!item) return;
    close();
  }

  function open() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add('visible');
    });
    input.value = '';
    render('');
    setTimeout(function () { input.focus(); }, 10);
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(function () {
      overlay.hidden = true;
    }, 180);
    if (lastFocused) lastFocused.focus();
  }

  openBtn.addEventListener('click', open);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  input.addEventListener('input', function () {
    render(input.value);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(activeIndex);
    } else if (e.key === 'Escape') {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    var isK = e.key === 'k' || e.key === 'K';
    if ((e.metaKey || e.ctrlKey) && isK) {
      e.preventDefault();
      if (overlay.hidden) open(); else close();
    } else if (e.key === 'Escape' && !overlay.hidden) {
      close();
    }
  });
})();
