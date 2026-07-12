(function () {
  var input = document.querySelector('.srch-input');
  var items = Array.prototype.slice.call(document.querySelectorAll('.srch-item'));
  var emptyState = document.querySelector('.srch-empty');
  var emptyQuery = document.querySelector('.srch-empty-query');
  if (!input || !items.length) return;

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    var re = new RegExp('(' + escapeRegExp(query) + ')', 'ig');
    return escapeHtml(text).replace(re, function (match) {
      return '<mark>' + match + '</mark>';
    });
  }

  function applySearch() {
    var query = input.value.trim();
    var lowerQuery = query.toLowerCase();
    var visibleCount = 0;

    items.forEach(function (item) {
      var text = item.getAttribute('data-text') || '';
      var textEl = item.querySelector('.srch-item-text');
      var matches = query === '' || text.toLowerCase().indexOf(lowerQuery) !== -1;

      item.hidden = !matches;
      if (matches) {
        visibleCount += 1;
        if (textEl) textEl.innerHTML = highlight(text, query);
      }
    });

    if (emptyState) {
      emptyState.hidden = !(query !== '' && visibleCount === 0);
    }
    if (emptyQuery) {
      emptyQuery.textContent = query;
    }
  }

  input.addEventListener('input', applySearch);

  applySearch();
})();
