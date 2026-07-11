(function () {
  var badge = document.getElementById('availabilityBadge');
  if (!badge) return;

  var label = badge.querySelector('.availability__label');

  var states = {
    available: { text: 'Available for work', pressed: 'false' },
    booked: { text: 'Fully booked', pressed: 'true' }
  };

  badge.addEventListener('click', function () {
    var current = badge.getAttribute('data-state');
    var next = current === 'available' ? 'booked' : 'available';
    badge.setAttribute('data-state', next);
    badge.setAttribute('aria-pressed', states[next].pressed);
    label.textContent = states[next].text;
  });
})();
