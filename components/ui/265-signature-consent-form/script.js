(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.sign-wrap');
  if (!wrap) return;

  var canvas = wrap.querySelector('.sign-canvas');
  var placeholder = wrap.querySelector('.sign-pad-placeholder');
  var clearBtn = wrap.querySelector('.sign-clear');
  var consentInput = wrap.querySelector('.sign-consent-input');
  var submitBtn = wrap.querySelector('.sign-submit');
  var success = wrap.querySelector('.sign-success');
  var ctx = canvas.getContext('2d');

  var hasSignature = false;
  var drawing = false;
  var lastPoint = null;

  function setupCanvas() {
    var ratio = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#f0e6d3';
  }

  function getPoint(e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function startDraw(e) {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    lastPoint = getPoint(e);
    if (!hasSignature) {
      hasSignature = true;
      placeholder.classList.add('is-hidden');
      updateSubmitState();
    }
  }

  function moveDraw(e) {
    if (!drawing) return;
    var point = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint = point;
  }

  function endDraw(e) {
    if (!drawing) return;
    drawing = false;
    lastPoint = null;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (err) {
      /* no-op */
    }
  }

  canvas.addEventListener('pointerdown', startDraw);
  canvas.addEventListener('pointermove', moveDraw);
  canvas.addEventListener('pointerup', endDraw);
  canvas.addEventListener('pointercancel', endDraw);
  canvas.addEventListener('pointerleave', function (e) {
    if (drawing) endDraw(e);
  });

  clearBtn.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
    placeholder.classList.remove('is-hidden');
    updateSubmitState();
    success.hidden = true;
  });

  consentInput.addEventListener('change', updateSubmitState);

  function updateSubmitState() {
    var ready = hasSignature && consentInput.checked;
    submitBtn.disabled = !ready;
  }

  submitBtn.addEventListener('click', function () {
    if (submitBtn.disabled) return;
    success.hidden = false;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitted';

    if (!reduceMotion) {
      submitBtn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.97)' },
          { transform: 'scale(1)' }
        ],
        { duration: 220, easing: 'ease-out' }
      );
    }
  });

  window.addEventListener('resize', function () {
    // Preserve the drawing isn't feasible across a raw resize without extra
    // bookkeeping, so we just keep the canvas crisp for the current session.
    var wasEmpty = !hasSignature;
    setupCanvas();
    if (wasEmpty) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  setupCanvas();
  updateSubmitState();
})();
