(function () {
  var viewer = document.getElementById('pdfViewer');
  var skeleton = document.getElementById('skeleton');
  var fallback = document.getElementById('fallback');

  if (!viewer || !skeleton || !fallback) return;

  // Simulate a document load attempt, then reveal the "open in new tab"
  // fallback since real PDF rendering is out of scope for this component.
  setTimeout(function () {
    viewer.setAttribute('data-state', 'fallback');
    skeleton.hidden = true;
    fallback.hidden = false;
  }, 1400);
})();
