(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.querySelector('.recipe-toggle');
  var panel = document.querySelector('.recipe-ingredients');
  var label = document.querySelector('.recipe-toggle-label');
  var card = document.querySelector('.recipe-card');
  if (!toggle || !panel) return;

  var open = false;

  function setOpen(next) {
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Hide ingredients' : 'View ingredients';
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!open);
  });

  // Clicking the card body (outside the toggle/list) also expands it.
  if (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.recipe-toggle') || e.target.closest('.recipe-list')) return;
      setOpen(!open);
    });
  }

  // Checkbox strikethrough is handled purely by CSS (:checked ~ sibling),
  // but stop the click from bubbling to the card toggle handler.
  var checks = Array.prototype.slice.call(document.querySelectorAll('.recipe-check'));
  checks.forEach(function (chk) {
    chk.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });
})();
