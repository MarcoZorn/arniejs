(function () {
  const palette = document.getElementById('palette');
  const input = document.getElementById('paletteInput');
  const list = document.getElementById('paletteList');
  const empty = document.getElementById('paletteEmpty');
  const openBtn = document.getElementById('openPalette');

  const commands = [
    { id: 'home',    icon: '⌂', title: 'Go to Dashboard',    sub: 'Navigation', group: 'Navigation' },
    { id: 'proj',    icon: '▦', title: 'Open Projects',      sub: 'Navigation', group: 'Navigation' },
    { id: 'inbox',   icon: '✉', title: 'Open Inbox',         sub: 'Navigation', group: 'Navigation' },
    { id: 'newdoc',  icon: '+', title: 'Create new document', sub: 'Action',    group: 'Actions' },
    { id: 'newtask', icon: '✓', title: 'Create new task',     sub: 'Action',    group: 'Actions' },
    { id: 'invite',  icon: '↪', title: 'Invite teammate',     sub: 'Action',    group: 'Actions' },
    { id: 'theme',   icon: '◑', title: 'Toggle theme',        sub: 'Preference', group: 'Actions' },
    { id: 'settings',icon: '⚙', title: 'Open Settings',       sub: 'Preference', group: 'Settings' },
    { id: 'profile', icon: '○', title: 'Edit profile',        sub: 'Account',   group: 'Settings' },
    { id: 'billing', icon: '◈', title: 'Billing & plans',     sub: 'Account',   group: 'Settings' },
    { id: 'docs',    icon: '☷', title: 'Read documentation',  sub: 'Help',      group: 'Help' },
    { id: 'shortcut',icon: '⌘', title: 'Keyboard shortcuts',  sub: 'Help',      group: 'Help' }
  ];

  let recent = ['newdoc', 'settings'];
  let results = [];
  let active = 0;

  // subsequence fuzzy match -> score + highlighted html, or null
  function fuzzy(query, text) {
    if (!query) return { score: 0, html: text };
    const q = query.toLowerCase(), t = text.toLowerCase();
    let qi = 0, out = '', run = 0, score = 0;
    for (let i = 0; i < text.length; i++) {
      if (qi < q.length && t[i] === q[qi]) {
        run++; score += 1 + run; qi++;
        out += '<mark>' + text[i] + '</mark>';
      } else {
        run = 0; out += text[i];
      }
    }
    return qi === q.length ? { score, html: out } : null;
  }

  function search(query) {
    const q = query.trim();
    if (!q) {
      // recent first, then everything
      const rec = recent.map((id) => commands.find((c) => c.id === id)).filter(Boolean);
      const recIds = new Set(recent);
      const rest = commands.filter((c) => !recIds.has(c.id));
      return rec.map((c) => ({ cmd: c, html: c.title, group: 'Recent' }))
        .concat(rest.map((c) => ({ cmd: c, html: c.title, group: c.group })));
    }
    return commands
      .map((c) => { const m = fuzzy(q, c.title); return m ? { cmd: c, html: m.html, score: m.score, group: c.group } : null; })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  }

  function render(query) {
    results = search(query);
    active = 0;
    list.innerHTML = '';
    empty.hidden = results.length > 0;

    let lastGroup = null;
    results.forEach((r, i) => {
      if (r.group !== lastGroup) {
        const label = document.createElement('li');
        label.className = 'group-label';
        label.textContent = r.group;
        label.setAttribute('role', 'presentation');
        list.appendChild(label);
        lastGroup = r.group;
      }
      const li = document.createElement('li');
      li.className = 'cmd';
      li.setAttribute('role', 'option');
      li.dataset.index = i;
      li.innerHTML =
        '<span class="ci">' + r.cmd.icon + '</span>' +
        '<span class="meta"><span class="title">' + r.html + '</span>' +
        '<span class="sub">' + r.cmd.sub + '</span></span>' +
        '<span class="enter">Enter ↵</span>';
      li.addEventListener('mousemove', () => setActive(i));
      li.addEventListener('click', () => run(i));
      list.appendChild(li);
    });
    updateActive();
  }

  function optionEls() { return Array.from(list.querySelectorAll('.cmd')); }

  function setActive(i) {
    active = Math.max(0, Math.min(i, results.length - 1));
    updateActive();
  }

  function updateActive() {
    optionEls().forEach((el) => {
      const on = +el.dataset.index === active;
      el.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function run(i) {
    const r = results[i];
    if (!r) return;
    recent = [r.cmd.id, ...recent.filter((id) => id !== r.cmd.id)].slice(0, 4);
    close();
  }

  function open() {
    palette.hidden = false;
    requestAnimationFrame(() => palette.classList.add('open'));
    input.value = '';
    render('');
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    palette.classList.remove('open');
    document.body.style.overflow = '';
    const done = () => { palette.hidden = true; panel.removeEventListener('transitionend', done); };
    const panel = palette.querySelector('.panel');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { palette.hidden = true; } else { panel.addEventListener('transitionend', done); }
    openBtn.focus();
  }

  function isOpen() { return !palette.hidden; }

  // events
  openBtn.addEventListener('click', open);
  palette.querySelector('[data-close]').addEventListener('click', close);
  input.addEventListener('input', () => render(input.value));

  document.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); isOpen() ? close() : open(); return; }
    if (!isOpen()) return;

    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); run(active); }
  });
})();
