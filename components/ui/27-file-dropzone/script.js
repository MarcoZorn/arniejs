(function () {
  const dz = document.getElementById('dropzone');
  const input = document.getElementById('fileInput');
  const list = document.getElementById('filelist');
  const MAX = 10;
  let count = 0;

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    const units = ['KB', 'MB', 'GB'];
    let n = bytes / 1024, i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return n.toFixed(1) + ' ' + units[i];
  }

  function makeThumb(file, thumbEl) {
    if (file.type && file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.className = 'file__thumb';
      img.alt = '';
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => URL.revokeObjectURL(url);
      thumbEl.replaceWith(img);
      return img;
    }
    const ext = (file.name.split('.').pop() || 'file').slice(0, 4).toUpperCase();
    thumbEl.textContent = ext;
    return thumbEl;
  }

  function addFile(file) {
    if (count >= MAX) return;
    count++;

    const li = document.createElement('li');
    li.className = 'file';
    li.innerHTML = `
      <span class="file__thumb"></span>
      <div class="file__main">
        <div class="file__name"></div>
        <div class="file__meta"><span class="file__size"></span><span class="file__status"> · uploading…</span></div>
        <div class="bar"><div class="bar__fill"></div></div>
      </div>
      <button class="file__remove" type="button" aria-label="Remove file">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>`;

    li.querySelector('.file__name').textContent = file.name;
    li.querySelector('.file__size').textContent = fmtSize(file.size);
    makeThumb(file, li.querySelector('.file__thumb'));

    const fill = li.querySelector('.bar__fill');
    const status = li.querySelector('.file__status');
    const removeBtn = li.querySelector('.file__remove');

    removeBtn.addEventListener('click', () => {
      li.classList.add('is-out');
      count--;
      li.addEventListener('animationend', () => li.remove(), { once: true });
    });

    list.appendChild(li);

    // fake upload progress
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let p = 0;
    const finish = () => {
      fill.style.transform = 'scaleX(1)';
      li.classList.add('is-complete');
      status.innerHTML = ' · <span class="file__done">uploaded</span>';
    };
    if (reduce) { finish(); return; }
    const timer = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) { p = 100; clearInterval(timer); finish(); }
      else fill.style.transform = 'scaleX(' + (p / 100) + ')';
    }, 220);
  }

  function handleFiles(files) {
    Array.from(files).forEach(addFile);
  }

  dz.addEventListener('click', () => input.click());
  dz.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  input.addEventListener('change', () => { handleFiles(input.files); input.value = ''; });

  ['dragenter', 'dragover'].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('is-drag'); })
  );
  ['dragleave', 'dragend'].forEach((ev) =>
    dz.addEventListener(ev, (e) => { if (e.target === dz) dz.classList.remove('is-drag'); })
  );
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('is-drag');
    if (e.dataTransfer && e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  });
})();
