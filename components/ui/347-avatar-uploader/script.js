(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dropzone = document.querySelector('[data-dropzone]');
  var fileInput = document.querySelector('[data-file-input]');
  var preview = document.querySelector('[data-preview]');
  var placeholderIcon = document.querySelector('[data-placeholder-icon]');
  var dropLabel = document.querySelector('[data-drop-label]');
  var removeBtn = document.querySelector('[data-remove]');
  var statusEl = document.querySelector('[data-status]');
  var circle = document.querySelector('[data-circle]');

  if (!dropzone || !fileInput) return;

  var currentObjectUrl = null;
  var statusTimer = null;

  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    window.clearTimeout(statusTimer);
    if (msg) {
      statusTimer = window.setTimeout(function () { statusEl.textContent = ''; }, 3000);
    }
  }

  function showImage(url) {
    preview.src = url;
    preview.hidden = false;
    placeholderIcon.style.display = 'none';
    dropLabel.textContent = 'Looks great — drop a new one to replace it';
    removeBtn.disabled = false;

    if (!reduceMotion) {
      circle.animate(
        [{ transform: 'scale(0.92)', opacity: 0.5 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 260, easing: 'ease-out' }
      );
    }
  }

  function resetToPlaceholder() {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    preview.hidden = true;
    preview.removeAttribute('src');
    placeholderIcon.style.display = '';
    dropLabel.textContent = 'Drag & drop an image here';
    removeBtn.disabled = true;
  }

  function handleFile(file) {
    if (!file || file.type.indexOf('image/') !== 0) {
      setStatus('Please choose an image file');
      return;
    }
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(file);
    showImage(currentObjectUrl);
    setStatus('Avatar updated');
  }

  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (file) handleFile(file);
    fileInput.value = '';
  });

  dropzone.addEventListener('click', function (e) {
    if (e.target === removeBtn) return;
    fileInput.click();
  });

  dropzone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  ['dragenter', 'dragover'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('is-dragover');
    });
  });

  ['dragleave', 'dragend'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
    });
  });

  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('is-dragover');
    var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  removeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    resetToPlaceholder();
    setStatus('Avatar removed');
  });
})();
