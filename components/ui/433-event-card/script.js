(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var btn = document.getElementById('eventRsvpBtn');
  var attendeesEl = document.getElementById('eventAttendees');

  if (!btn || !attendeesEl) return;

  var BASE_COUNT = 32;
  var going = false;

  function render() {
    var count = BASE_COUNT + (going ? 1 : 0);
    attendeesEl.textContent = count + ' going';
    btn.textContent = going ? 'Going ✓' : 'RSVP';
    btn.classList.toggle('is-going', going);
    btn.setAttribute('aria-pressed', going ? 'true' : 'false');
  }

  btn.addEventListener('click', function () {
    going = !going;
    render();

    if (reduceMotion) return;

    btn.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.94)' },
        { transform: 'scale(1)' }
      ],
      { duration: 200, easing: 'ease-out' }
    );
  });

  render();
})();
