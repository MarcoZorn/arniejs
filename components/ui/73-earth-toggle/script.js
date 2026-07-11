(function () {
  const toggles = document.querySelectorAll('.toggle');

  function setState(el, on) {
    el.classList.toggle('is-on', on);
    el.setAttribute('aria-checked', on ? 'true' : 'false');
  }

  toggles.forEach((el) => {
    el.addEventListener('click', () => {
      const on = !el.classList.contains('is-on');
      setState(el, on);
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const on = !el.classList.contains('is-on');
        setState(el, on);
      }
    });
  });
})();
