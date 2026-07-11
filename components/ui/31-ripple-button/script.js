(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const buttons = document.querySelectorAll('.ripple-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
      if (reduce) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.2;

      const ink = document.createElement('span');
      ink.className = 'ripple-btn__ink';
      ink.style.width = `${size}px`;
      ink.style.height = `${size}px`;
      ink.style.left = `${x}px`;
      ink.style.top = `${y}px`;

      btn.appendChild(ink);
      ink.addEventListener('animationend', () => ink.remove());
    });
  });
})();
