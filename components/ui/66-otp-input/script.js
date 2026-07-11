(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const boxes = Array.from(document.querySelectorAll('.otp__box'));
  const form = document.getElementById('otpForm');
  const submitBtn = document.getElementById('otpSubmit');
  const status = document.getElementById('otpStatus');

  function updateSubmitState() {
    const complete = boxes.every((b) => b.value.length === 1);
    submitBtn.disabled = !complete;
  }

  function focusBox(index) {
    const target = boxes[Math.max(0, Math.min(boxes.length - 1, index))];
    if (target) {
      target.focus();
      target.select();
    }
  }

  function clearErrors() {
    boxes.forEach((b) => b.classList.remove('is-error'));
    status.textContent = ' ';
    status.classList.remove('is-error');
  }

  boxes.forEach((box, i) => {
    box.addEventListener('input', (e) => {
      clearErrors();
      const digits = box.value.replace(/[^0-9]/g, '');
      box.value = digits.slice(-1);
      if (box.value) {
        box.classList.add('is-filled');
        focusBox(i + 1);
      } else {
        box.classList.remove('is-filled');
      }
      updateSubmitState();
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (!box.value && i > 0) {
          e.preventDefault();
          const prev = boxes[i - 1];
          prev.value = '';
          prev.classList.remove('is-filled');
          focusBox(i - 1);
          updateSubmitState();
        } else {
          box.classList.remove('is-filled');
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusBox(i - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusBox(i + 1);
      }
    });

    box.addEventListener('paste', (e) => {
      e.preventDefault();
      clearErrors();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const digits = pasted.replace(/[^0-9]/g, '').slice(0, boxes.length - i);
      digits.split('').forEach((d, offset) => {
        const target = boxes[i + offset];
        if (target) {
          target.value = d;
          target.classList.add('is-filled');
        }
      });
      const nextIndex = Math.min(i + digits.length, boxes.length - 1);
      focusBox(nextIndex);
      updateSubmitState();
    });

    box.addEventListener('focus', () => box.select());
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = boxes.map((b) => b.value).join('');
    if (code.length !== boxes.length) return;

    // Demo validation: any code ending in an even digit is "valid".
    const valid = Number(code[code.length - 1]) % 2 === 0;

    if (valid) {
      status.textContent = 'Code verified successfully.';
      status.classList.remove('is-error');
      boxes.forEach((b) => (b.disabled = true));
      submitBtn.textContent = 'Verified';
      submitBtn.disabled = true;
    } else {
      status.textContent = 'Incorrect code. Please try again.';
      status.classList.add('is-error');
      boxes.forEach((b) => {
        b.classList.add('is-error');
        if (!reduce) {
          b.addEventListener('animationend', () => b.classList.remove('is-error'), { once: true });
        } else {
          b.classList.remove('is-error');
        }
      });
      boxes.forEach((b) => { b.value = ''; b.classList.remove('is-filled'); });
      focusBox(0);
      updateSubmitState();
    }
  });

  focusBox(0);
})();
