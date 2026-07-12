(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.querySelector('.faq-list');
  if (!list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll('.faq-item'));
  var searchInput = document.querySelector('.faq-search');
  var emptyMsg = document.querySelector('.faq-empty');

  // Accordion: only one panel open at a time.
  items.forEach(function (item) {
    var button = item.querySelector('.faq-question');
    var panel = item.querySelector('.faq-answer');
    if (!button || !panel) return;

    button.addEventListener('click', function () {
      var isOpen = button.getAttribute('aria-expanded') === 'true';

      items.forEach(function (other) {
        var otherBtn = other.querySelector('.faq-question');
        var otherPanel = other.querySelector('.faq-answer');
        if (!otherBtn || !otherPanel) return;
        otherBtn.setAttribute('aria-expanded', 'false');
        otherPanel.hidden = true;
      });

      if (!isOpen) {
        button.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });

  // Live search filtering.
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim().toLowerCase();
      var visibleCount = 0;

      items.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        var matches = query === '' || text.indexOf(query) !== -1;
        item.classList.toggle('is-hidden', !matches);
        if (matches) visibleCount++;
      });

      if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
    });
  }
})();
