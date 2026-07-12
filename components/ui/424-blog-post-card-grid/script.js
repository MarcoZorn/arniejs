(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.blog-wrap');
  if (!wrap) return;

  var tagButtons = Array.prototype.slice.call(wrap.querySelectorAll('.blog-tag-btn'));
  var cards = Array.prototype.slice.call(wrap.querySelectorAll('.blog-card'));
  var emptyMsg = wrap.querySelector('.blog-empty');

  var activeTags = [];

  function cardTags(card) {
    return (card.getAttribute('data-tag') || '').split(/\s+/).filter(Boolean);
  }

  function applyFilter() {
    var visibleCount = 0;

    cards.forEach(function (card) {
      var tags = cardTags(card);
      var matches = activeTags.length === 0 || activeTags.some(function (t) {
        return tags.indexOf(t) !== -1;
      });
      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount += 1;
    });

    if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
  }

  tagButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.getAttribute('data-tag');
      var idx = activeTags.indexOf(tag);

      if (idx === -1) {
        activeTags.push(tag);
        btn.classList.add('is-active');
      } else {
        activeTags.splice(idx, 1);
        btn.classList.remove('is-active');
      }

      applyFilter();
    });
  });
})();
