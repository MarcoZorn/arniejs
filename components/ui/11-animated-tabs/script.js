(function () {
  const tablist = document.querySelector('.tablist');
  if (!tablist) return;

  const indicator = tablist.querySelector('.indicator');
  const tabs = Array.from(tablist.querySelectorAll('.tab'));
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));

  function moveIndicator(tab) {
    // indicator base width is 1px; scaleX = tab width, translateX = tab left edge.
    // Measure against the list so padding/border never cause drift.
    const listRect = tablist.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    indicator.style.setProperty('--x', (tabRect.left - listRect.left) + 'px');
    indicator.style.setProperty('--w', tabRect.width);
  }

  function activate(index, setFocus) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].classList.toggle('is-active', selected);
      panels[i].hidden = !selected;
    });
    moveIndicator(tabs[index]);
    if (setFocus) tabs[index].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i, false));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        e.preventDefault();
        activate(next, true);
      }
    });
  });

  // initial + keep aligned on resize
  requestAnimationFrame(() => moveIndicator(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]));
  window.addEventListener('resize', () => {
    const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    moveIndicator(active);
  });
})();
