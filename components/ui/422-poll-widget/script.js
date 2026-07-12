(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.poll-card');
  if (!card) return;

  var options = Array.prototype.slice.call(card.querySelectorAll('.poll-option'));
  var totalEl = card.querySelector('.poll-total-votes');
  var statusEl = card.querySelector('.poll-status');

  var votes = {
    tomatoes: 14,
    squash: 9,
    beans: 11,
    herbs: 8
  };

  var myVote = null;

  function totalVotes() {
    var sum = 0;
    for (var key in votes) {
      if (Object.prototype.hasOwnProperty.call(votes, key)) sum += votes[key];
    }
    return sum;
  }

  function render() {
    var total = totalVotes();
    if (totalEl) totalEl.textContent = String(total);

    options.forEach(function (opt) {
      var key = opt.getAttribute('data-option');
      var count = votes[key] || 0;
      var pct = total > 0 ? Math.round((count / total) * 100) : 0;
      var fill = opt.querySelector('.poll-option-fill');
      var pctEl = opt.querySelector('.poll-option-pct');

      if (pctEl) pctEl.textContent = pct + '%';
      if (fill) fill.style.width = pct + '%';

      var isMine = key === myVote;
      opt.classList.toggle('is-mine', isMine);
      opt.setAttribute('aria-checked', isMine ? 'true' : 'false');
    });
  }

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      var key = opt.getAttribute('data-option');
      if (!Object.prototype.hasOwnProperty.call(votes, key)) return;

      if (myVote === key) {
        // clicking your own current vote again: no-op (already counted)
        return;
      }

      if (myVote === null) {
        votes[key] += 1;
      } else {
        votes[myVote] = Math.max(0, votes[myVote] - 1);
        votes[key] += 1;
      }

      myVote = key;
      render();

      if (statusEl) {
        statusEl.textContent = 'your vote: ' + opt.querySelector('.poll-option-label').textContent;
      }

      if (!reduceMotion) {
        opt.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(0.985)' }, { transform: 'scale(1)' }],
          { duration: 180, easing: 'ease-out' }
        );
      }
    });
  });
})();
