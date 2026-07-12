(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.author-card');
  if (!card) return;

  var followBtn = card.querySelector('.author-follow-btn');
  var countEl = card.querySelector('.author-follower-count');
  if (!followBtn || !countEl) return;

  var baseCount = parseInt(countEl.textContent.replace(/,/g, ''), 10) || 0;

  function formatCount(n) {
    return n.toLocaleString('en-US');
  }

  followBtn.addEventListener('click', function () {
    var following = followBtn.getAttribute('data-following') === 'true';
    var next = !following;

    followBtn.setAttribute('data-following', String(next));
    followBtn.textContent = next ? 'Following' : 'Follow';
    countEl.textContent = formatCount(next ? baseCount + 1 : baseCount);

    if (!reduceMotion) {
      followBtn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
        { duration: 200, easing: 'ease-out' }
      );
    }
  });
})();
