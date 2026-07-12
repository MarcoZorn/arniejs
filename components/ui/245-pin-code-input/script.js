(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var container = document.getElementById('pci-boxes');
  if (!container) return;

  var boxes = Array.prototype.slice.call(container.querySelectorAll('.pci-box'));
  var status = document.getElementById('pci-status');

  function updateStatus() {
    var filled = boxes.filter(function (b) { return b.value !== ''; }).length;
    if (filled === boxes.length) {
      var code = boxes.map(function (b) { return b.value; }).join('');
      status.textContent = 'Code complete: ' + code;
    } else {
      status.textContent = (boxes.length - filled) + ' digit' + (boxes.length - filled === 1 ? '' : 's') + ' remaining';
    }
  }

  function focusBox(index) {
    var box = boxes[index];
    if (box) {
      box.focus();
      box.select();
    }
  }

  boxes.forEach(function (box, index) {
    box.addEventListener('input', function () {
      var digit = box.value.replace(/[^0-9]/g, '').slice(-1);
      box.value = digit;
      box.classList.toggle('is-filled', digit !== '');

      if (digit && index < boxes.length - 1) {
        focusBox(index + 1);
      }
      updateStatus();
    });

    box.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace') {
        if (box.value === '' && index > 0) {
          e.preventDefault();
          var prev = boxes[index - 1];
          prev.value = '';
          prev.classList.remove('is-filled');
          focusBox(index - 1);
          updateStatus();
        } else {
          box.classList.remove('is-filled');
        }
      } else if (e.key === 'ArrowLeft') {
        if (index > 0) {
          e.preventDefault();
          focusBox(index - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (index < boxes.length - 1) {
          e.preventDefault();
          focusBox(index + 1);
        }
      } else if (e.key === 'Delete') {
        box.value = '';
        box.classList.remove('is-filled');
        updateStatus();
      } else if (/^[0-9]$/.test(e.key)) {
        // allow default input handling to run (covers replace-while-selected case)
      } else if (
        e.key.length === 1 &&
        !e.ctrlKey && !e.metaKey && !e.altKey
      ) {
        e.preventDefault();
        if (!reduceMotion) {
          box.classList.remove('is-shake');
          void box.offsetWidth;
          box.classList.add('is-shake');
        }
      }
    });

    box.addEventListener('paste', function (e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text');
      var digits = text.replace(/[^0-9]/g, '').split('');
      if (digits.length === 0) return;

      boxes.forEach(function (b) { b.value = ''; b.classList.remove('is-filled'); });

      var lastIndex = 0;
      digits.slice(0, boxes.length).forEach(function (d, i) {
        boxes[i].value = d;
        boxes[i].classList.add('is-filled');
        lastIndex = i;
      });
      updateStatus();
      focusBox(Math.min(lastIndex + 1, boxes.length - 1));
    });

    box.addEventListener('focus', function () {
      requestAnimationFrame(function () {
        box.select();
      });
    });
  });

  updateStatus();
})();
