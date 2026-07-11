(function () {
  var cassette = document.querySelector('.cassette');
  var btn = document.querySelector('.play-btn');
  var label = document.querySelector('.play-btn__label');
  if (!cassette || !btn || !label) return;

  var playing = false;

  btn.addEventListener('click', function () {
    playing = !playing;
    cassette.setAttribute('data-playing', playing ? 'true' : 'false');
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    label.textContent = playing ? 'Pause' : 'Play';
  });
})();
