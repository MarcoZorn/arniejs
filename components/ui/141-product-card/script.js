(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.product-card');
  if (!card) return;

  var wishBtn = card.querySelector('.pc-wish');
  var addBtn = card.querySelector('.pc-add');
  var addLabel = addBtn.querySelector('.pc-add-label');

  wishBtn.addEventListener('click', function () {
    var pressed = wishBtn.getAttribute('aria-pressed') === 'true';
    wishBtn.setAttribute('aria-pressed', String(!pressed));
    if (!prefersReducedMotion) {
      wishBtn.classList.remove('pop');
      void wishBtn.offsetWidth;
      wishBtn.classList.add('pop');
    }
  });

  var addTimer = null;
  addBtn.addEventListener('click', function () {
    addBtn.classList.add('added');
    addLabel.textContent = addBtn.dataset.labelAdded;
    clearTimeout(addTimer);
    addTimer = setTimeout(function () {
      addBtn.classList.remove('added');
      addLabel.textContent = addBtn.dataset.labelIdle;
    }, 1800);
  });
})();
