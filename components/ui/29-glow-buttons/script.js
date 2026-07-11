(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Magnetic button
  const mag = document.getElementById('magnetic');
  if (mag && !reduce) {
    const label = mag.querySelector('span');
    const strength = 0.35;
    mag.addEventListener('pointermove', (e) => {
      const r = mag.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      mag.style.transform = `translate(${x}px, ${y}px)`;
      label.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    });
    mag.addEventListener('pointerleave', () => {
      mag.style.transform = '';
      label.style.transform = '';
    });
  }

  // Loading button
  const loadBtn = document.getElementById('loadBtn');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      if (loadBtn.classList.contains('is-loading')) return;
      loadBtn.classList.add('is-loading');
      loadBtn.setAttribute('aria-busy', 'true');
      setTimeout(() => {
        loadBtn.classList.remove('is-loading');
        loadBtn.removeAttribute('aria-busy');
      }, 2000);
    });
  }

  // Success morph button
  const successBtn = document.getElementById('successBtn');
  if (successBtn) {
    successBtn.addEventListener('click', () => {
      if (successBtn.classList.contains('is-done')) return;
      successBtn.classList.add('is-done');
      const text = successBtn.querySelector('.btn__text');
      setTimeout(() => {
        successBtn.classList.remove('is-done');
        if (text) text.textContent = 'Confirm';
      }, 2200);
    });
  }
})();
