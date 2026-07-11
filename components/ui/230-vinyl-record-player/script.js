(function () {
  var player = document.querySelector('.player');
  var playBtn = document.getElementById('playBtn');
  if (!player || !playBtn) return;

  playBtn.addEventListener('click', function () {
    var isPlaying = player.classList.toggle('is-playing');
    playBtn.setAttribute('aria-pressed', String(isPlaying));
    playBtn.querySelector('.play-btn__label').textContent = isPlaying ? 'Pause' : 'Play';
  });
})();
