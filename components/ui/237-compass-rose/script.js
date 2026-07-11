(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var compass = document.querySelector('.compass');
  var rotor = document.querySelector('.compass__rotor');
  var headingEl = document.querySelector('.compass__heading');
  if (!compass || !rotor || !headingEl) return;

  var directions = [
    { label: 'N', deg: 0 }, { label: 'NE', deg: 45 }, { label: 'E', deg: 90 },
    { label: 'SE', deg: 135 }, { label: 'S', deg: 180 }, { label: 'SW', deg: 225 },
    { label: 'W', deg: 270 }, { label: 'NW', deg: 315 }
  ];

  var totalRotation = 0;

  compass.addEventListener('click', function () {
    var choice = directions[Math.floor(Math.random() * directions.length)];

    // always spin forward at least one full turn for a satisfying motion
    var currentMod = ((totalRotation % 360) + 360) % 360;
    var delta = ((choice.deg - currentMod) + 360) % 360;
    totalRotation += 360 + delta;

    rotor.style.transform = reduce
      ? 'rotate(' + choice.deg + 'deg)'
      : 'rotate(' + totalRotation + 'deg)';

    headingEl.textContent = choice.label;
  });
})();
