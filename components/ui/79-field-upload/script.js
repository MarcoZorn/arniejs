(function () {
  var plot = document.getElementById('plot');
  var fileInput = document.getElementById('fileInput');
  var hint = document.getElementById('plotHint');
  var fileList = document.getElementById('fileList');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var files = [];
  var dragCounter = 0;

  function renderFiles() {
    fileList.innerHTML = '';
    files.forEach(function (file, i) {
      var li = document.createElement('li');
      li.className = 'plot__file';

      var name = document.createElement('span');
      name.className = 'plot__file-name';
      name.textContent = file.name;

      var remove = document.createElement('button');
      remove.className = 'plot__file-remove';
      remove.type = 'button';
      remove.setAttribute('aria-label', 'Remove ' + file.name);
      remove.textContent = '×';
      remove.addEventListener('click', function (e) {
        e.stopPropagation();
        files.splice(i, 1);
        renderFiles();
        if (!files.length) {
          plot.classList.remove('is-planted');
          hint.textContent = 'Drag a file here or click to browse';
        }
      });

      li.appendChild(name);
      li.appendChild(remove);
      fileList.appendChild(li);
    });
  }

  function plant(newFiles) {
    if (!newFiles || !newFiles.length) return;
    Array.prototype.forEach.call(newFiles, function (f) {
      files.push(f);
    });
    renderFiles();
    plot.classList.remove('is-planted');
    hint.textContent = files.length + ' file' + (files.length > 1 ? 's' : '') + ' planted ✓';
    if (reduceMotion) {
      plot.classList.add('is-planted');
    } else {
      // restart animation
      void plot.offsetWidth;
      requestAnimationFrame(function () {
        plot.classList.add('is-planted');
      });
    }
  }

  plot.addEventListener('click', function () {
    fileInput.click();
  });

  plot.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', function () {
    plant(fileInput.files);
    fileInput.value = '';
  });

  plot.addEventListener('dragenter', function (e) {
    e.preventDefault();
    dragCounter++;
    plot.classList.add('is-dragover');
  });

  plot.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  plot.addEventListener('dragleave', function (e) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      plot.classList.remove('is-dragover');
    }
  });

  plot.addEventListener('drop', function (e) {
    e.preventDefault();
    dragCounter = 0;
    plot.classList.remove('is-dragover');
    if (e.dataTransfer && e.dataTransfer.files) {
      plant(e.dataTransfer.files);
    }
  });
})();
