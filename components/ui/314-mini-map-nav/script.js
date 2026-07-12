(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scrollArea = document.getElementById('mmapScroll');
  var track = document.getElementById('mmapTrack');
  var viewport = document.getElementById('mmapViewport');
  if (!scrollArea || !track || !viewport) return;

  function updateViewport() {
    var scrollHeight = scrollArea.scrollHeight;
    var clientHeight = scrollArea.clientHeight;
    var scrollTop = scrollArea.scrollTop;

    if (scrollHeight <= clientHeight) {
      viewport.style.top = '0px';
      viewport.style.height = '100%';
      return;
    }

    var trackHeight = track.clientHeight;
    var ratio = clientHeight / scrollHeight;
    var thumbHeight = Math.max(trackHeight * ratio, 24);
    var maxThumbTop = trackHeight - thumbHeight;
    var scrollRatio = scrollTop / (scrollHeight - clientHeight);
    var thumbTop = scrollRatio * maxThumbTop;

    viewport.style.height = thumbHeight + 'px';
    viewport.style.top = thumbTop + 'px';
  }

  function jumpToTrackPosition(clientY) {
    var rect = track.getBoundingClientRect();
    var offset = clientY - rect.top;
    var ratio = Math.min(Math.max(offset / rect.height, 0), 1);
    var scrollHeight = scrollArea.scrollHeight;
    var clientHeight = scrollArea.clientHeight;
    var targetTop = ratio * (scrollHeight - clientHeight);

    scrollArea.scrollTo({
      top: targetTop,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  scrollArea.addEventListener('scroll', updateViewport);
  window.addEventListener('resize', updateViewport);

  track.addEventListener('click', function (e) {
    jumpToTrackPosition(e.clientY);
  });

  var dragging = false;

  viewport.style.pointerEvents = 'auto';
  viewport.addEventListener('pointerdown', function (e) {
    dragging = true;
    e.preventDefault();
  });

  window.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    jumpToTrackPosition(e.clientY);
  });

  window.addEventListener('pointerup', function () {
    dragging = false;
  });

  // Also allow tapping/clicking the track itself via pointerdown for touch devices.
  track.addEventListener('pointerdown', function (e) {
    if (e.target === viewport) return;
    jumpToTrackPosition(e.clientY);
  });

  updateViewport();
})();
