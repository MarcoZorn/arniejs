(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dropzone = document.getElementById('dropzone');
  var stem = document.getElementById('stem');
  var progressFill = document.getElementById('progress-fill');
  var progressPct = document.getElementById('progress-pct');
  var statusText = document.getElementById('status-text');
  var startBtn = document.getElementById('start-btn');
  var dropText = document.getElementById('drop-text');

  if (!dropzone || !stem || !progressFill || !progressPct || !statusText || !startBtn) return;

  var MAX_STEM_HEIGHT = 84;
  var uploading = false;
  var timer = null;

  function setProgress(pct) {
    pct = Math.max(0, Math.min(100, pct));
    progressFill.style.width = pct + '%';
    progressPct.textContent = Math.round(pct) + '%';
    var height = 4 + (MAX_STEM_HEIGHT - 4) * (pct / 100);
    stem.style.height = height + 'px';
    stem.classList.toggle('has-leaves', pct > 35);
  }

  function reset() {
    setProgress(0);
    statusText.textContent = 'Ready';
    dropText.textContent = 'Drag a file here, or click to simulate an upload';
    startBtn.disabled = false;
    startBtn.textContent = 'Start Upload';
  }

  function startUpload(fileName) {
    if (uploading) return;
    uploading = true;
    startBtn.disabled = true;
    startBtn.textContent = 'Uploading…';
    statusText.textContent = 'Uploading ' + (fileName || 'file') + '…';
    dropText.textContent = fileName ? fileName : 'Uploading…';

    var pct = 0;
    setProgress(0);

    if (prefersReducedMotion) {
      setProgress(100);
      finishUpload();
      return;
    }

    clearInterval(timer);
    timer = setInterval(function () {
      pct += 4 + Math.random() * 8;
      if (pct >= 100) {
        pct = 100;
        setProgress(pct);
        clearInterval(timer);
        finishUpload();
      } else {
        setProgress(pct);
      }
    }, 160);
  }

  function finishUpload() {
    uploading = false;
    statusText.textContent = 'Upload complete — fully grown';
    dropText.textContent = 'Grown! Click to upload another file';
    startBtn.disabled = false;
    startBtn.textContent = 'Upload Again';
  }

  startBtn.addEventListener('click', function () {
    if (uploading) return;
    if (progressFill.style.width === '100%') {
      reset();
      return;
    }
    startUpload('demo-file.txt');
  });

  dropzone.addEventListener('click', function () {
    if (uploading) return;
    startUpload('demo-file.txt');
  });

  dropzone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!uploading) startUpload('demo-file.txt');
    }
  });

  ['dragenter', 'dragover'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'dragend'].forEach(function (evt) {
    dropzone.addEventListener(evt, function () {
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (uploading) return;
    var files = e.dataTransfer && e.dataTransfer.files;
    var name = files && files.length ? files[0].name : 'dropped-file';
    startUpload(name);
  });

  reset();
})();
