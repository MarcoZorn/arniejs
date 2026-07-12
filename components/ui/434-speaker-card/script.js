(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.getElementById('speakerToggle');
  var bio = document.getElementById('speakerBio');

  if (!toggle || !bio) return;

  var expanded = false;

  function render() {
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    bio.classList.toggle('is-open', expanded);
  }

  toggle.addEventListener('click', function () {
    expanded = !expanded;
    render();
  });

  render();
})();
