(function () {
  var embed = document.getElementById('embed');
  var frame = document.getElementById('embedFrame');
  var buttons = document.querySelectorAll('.embed__ratio-btn');

  if (!embed || !frame || !buttons.length) return;

  // Lazily point the iframe at a real same-origin document once it is
  // near the viewport, avoiding an unnecessary network request otherwise.
  var srcDoc =
    '<style>html,body{margin:0;height:100%;display:flex;align-items:center;' +
    'justify-content:center;background:#241a0e;color:#a89070;' +
    'font-family:system-ui,sans-serif;font-size:14px;}</style>' +
    '<body>iframe content loads here</body>';

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          frame.srcdoc = srcDoc;
          observer.disconnect();
        }
      });
    });
    observer.observe(embed);
  } else {
    frame.srcdoc = srcDoc;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ratio = btn.getAttribute('data-ratio');
      embed.setAttribute('data-ratio', ratio);
      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });
})();
