(function () {
  var cards = document.querySelectorAll('.integration-card');

  cards.forEach(function (card) {
    var btn = card.querySelector('.integration-card__action');
    var badgeText = card.querySelector('.integration-card__badge-text');
    if (!btn || !badgeText) return;

    btn.addEventListener('click', function () {
      var isConnected = card.getAttribute('data-state') === 'connected';
      var nextState = isConnected ? 'disconnected' : 'connected';

      card.setAttribute('data-state', nextState);
      badgeText.textContent = nextState === 'connected' ? 'Connected' : 'Disconnected';
      btn.textContent = nextState === 'connected' ? 'Disconnect' : 'Connect';
    });
  });
})();
