(() => {
  const stage = document.querySelector('.stage');
  if (!stage) return;

  const btn = stage.querySelector('.tt');

  // choice persisted in a JS variable (localStorage optional)
  let theme = 'dark';
  try {
    const saved = localStorage.getItem('demo-theme');
    if (saved) theme = saved;
  } catch (e) { /* storage unavailable — fall back to variable */ }

  function apply() {
    stage.dataset.theme = theme;
    btn.setAttribute('aria-checked', String(theme === 'light'));
    btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    try { localStorage.setItem('demo-theme', theme); } catch (e) {}
  }

  function toggle() {
    theme = theme === 'light' ? 'dark' : 'light';
    apply();
  }

  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  apply();
})();
