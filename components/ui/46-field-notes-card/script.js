(function () {
  const checks = document.querySelectorAll('.notes__check');
  checks.forEach((c) => {
    c.style.cursor = 'pointer';
    c.addEventListener('click', () => {
      const checked = !c.classList.contains('notes__check--empty');
      c.classList.toggle('notes__check--empty');
      c.textContent = checked ? '' : '✓';
    });
  });
})();
