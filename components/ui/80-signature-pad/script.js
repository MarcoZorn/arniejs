(function () {
  var canvas = document.getElementById('padCanvas');
  var ctx = canvas.getContext('2d');
  var clearBtn = document.getElementById('padClear');
  var status = document.getElementById('padStatus');

  var drawing = false;
  var hasSignature = false;
  var lastX = 0;
  var lastY = 0;

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var imageData = null;
    if (canvas.width > 0 && canvas.height > 0) {
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (err) {
        imageData = null;
      }
    }
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    setupStroke();
  }

  function setupStroke() {
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#241a0e';
  }

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var clientX = e.clientX;
    var clientY = e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    drawing = true;
    var pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
    if (canvas.setPointerCapture && e.pointerId !== undefined) {
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function draw(e) {
    if (!drawing) return;
    var pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;
    if (!hasSignature) {
      hasSignature = true;
      status.textContent = 'Signed';
    }
  }

  function endDraw() {
    drawing = false;
  }

  canvas.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    startDraw(e);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (drawing) e.preventDefault();
    draw(e);
  });
  window.addEventListener('pointerup', endDraw);
  canvas.addEventListener('pointerleave', function () {
    // keep drawing state; user may re-enter while still holding pointer
  });

  clearBtn.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
    status.textContent = 'Awaiting signature…';
  });

  // initial sizing after layout settles
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
})();
