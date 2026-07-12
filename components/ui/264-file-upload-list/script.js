(function () {
  var wrap = document.querySelector('.crate-wrap');
  if (!wrap) return;

  var drop = wrap.querySelector('.crate-drop');
  var fileInput = wrap.querySelector('.crate-file-input');
  var list = wrap.querySelector('.crate-list');
  var empty = wrap.querySelector('.crate-empty');

  var files = []; // { id, name, size, ext }
  var nextId = 1;

  function humanSize(bytes) {
    if (bytes === 0) return '0 B';
    var units = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    i = Math.min(i, units.length - 1);
    var value = bytes / Math.pow(1024, i);
    var rounded = i === 0 ? Math.round(value) : Math.round(value * 10) / 10;
    return rounded + ' ' + units[i];
  }

  function extOf(name) {
    var parts = name.split('.');
    return parts.length > 1 ? parts.pop().toUpperCase().slice(0, 4) : 'FILE';
  }

  function addFiles(fileList) {
    Array.prototype.forEach.call(fileList, function (f) {
      files.push({ id: nextId++, name: f.name, size: f.size, ext: extOf(f.name) });
    });
    render();
  }

  function removeFile(id) {
    files = files.filter(function (f) { return f.id !== id; });
    render();
  }

  function render() {
    list.innerHTML = '';
    empty.classList.toggle('is-hidden', files.length > 0);

    files.forEach(function (f) {
      var li = document.createElement('li');
      li.className = 'crate-item';

      var icon = document.createElement('span');
      icon.className = 'crate-item-icon';
      icon.textContent = f.ext;

      var info = document.createElement('div');
      info.className = 'crate-item-info';

      var name = document.createElement('span');
      name.className = 'crate-item-name';
      name.textContent = f.name;

      var size = document.createElement('span');
      size.className = 'crate-item-size';
      size.textContent = humanSize(f.size);

      info.appendChild(name);
      info.appendChild(size);

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'crate-item-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + f.name);
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', function () {
        removeFile(f.id);
      });

      li.appendChild(icon);
      li.appendChild(info);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }

  // Click-to-browse (covers mobile & devices without drag support).
  drop.addEventListener('click', function () {
    fileInput.click();
  });

  drop.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', function () {
    if (fileInput.files && fileInput.files.length) {
      addFiles(fileInput.files);
    }
    fileInput.value = '';
  });

  // Drag & drop support.
  ['dragenter', 'dragover'].forEach(function (evt) {
    drop.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.add('is-dragover');
    });
  });

  ['dragleave', 'dragend'].forEach(function (evt) {
    drop.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.remove('is-dragover');
    });
  });

  drop.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    drop.classList.remove('is-dragover');
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  });

  render();
})();
