(function () {
  const scene = document.getElementById('scene');
  const cube = document.getElementById('cube');
  const dots = Array.from(document.getElementById('dots').querySelectorAll('.dot'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Target snap angles per face.
  const FACES = {
    front:  { x: 0,   y: 0 },
    right:  { x: 0,   y: -90 },
    back:   { x: 0,   y: -180 },
    left:   { x: 0,   y: -270 },
    top:    { x: -90, y: 0 },
    bottom: { x: 90,  y: 0 }
  };

  let rotX = -18, rotY = 24;      // current rotation
  let velX = 0, velY = 0;          // inertia velocity
  let autoSpin = !reduce.matches;  // idle auto-rotate
  let dragging = false;
  let last = null;

  // Compute half from actual size so transform stays centered.
  function measure() {
    const s = scene.getBoundingClientRect().width;
    return s / 2;
  }
  let HALF = measure();

  function draw() {
    cube.style.transform =
      `translateZ(-${HALF}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  }

  let snapTarget = null;

  function loop() {
    if (dragging) {
      // handled in pointermove
    } else if (snapTarget) {
      rotX += (snapTarget.x - rotX) * 0.12;
      rotY += (snapTarget.y - rotY) * 0.12;
      if (Math.abs(snapTarget.x - rotX) < 0.05 && Math.abs(snapTarget.y - rotY) < 0.05) {
        rotX = snapTarget.x; rotY = snapTarget.y; snapTarget = null;
      }
    } else {
      // inertia decay
      rotX += velX;
      rotY += velY;
      velX *= 0.94;
      velY *= 0.94;
      if (Math.abs(velX) < 0.01) velX = 0;
      if (Math.abs(velY) < 0.01) velY = 0;
      if (autoSpin && velX === 0 && velY === 0) rotY += 0.18;
      rotX = Math.max(-90, Math.min(90, rotX));
    }
    draw();
    requestAnimationFrame(loop);
  }

  function onDown(e) {
    dragging = true;
    snapTarget = null;
    scene.classList.add('dragging');
    last = { x: e.clientX, y: e.clientY };
    scene.setPointerCapture(e.pointerId);
  }
  function onMove(e) {
    if (!dragging) return;
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    last = { x: e.clientX, y: e.clientY };
    velY = dx * 0.4;
    velX = -dy * 0.4;
    rotY += velY;
    rotX = Math.max(-90, Math.min(90, rotX + velX));
  }
  function onUp(e) {
    if (!dragging) return;
    dragging = false;
    scene.classList.remove('dragging');
    try { scene.releasePointerCapture(e.pointerId); } catch (err) {}
  }

  scene.addEventListener('pointerdown', onDown);
  scene.addEventListener('pointermove', onMove);
  scene.addEventListener('pointerup', onUp);
  scene.addEventListener('pointercancel', onUp);
  scene.addEventListener('pointerleave', onUp);

  function selectFace(name) {
    const t = FACES[name];
    if (!t) return;
    autoSpin = false;
    // Choose an equivalent target Y near current to avoid long spins.
    let ty = t.y;
    while (ty - rotY > 180) ty -= 360;
    while (ty - rotY < -180) ty += 360;
    snapTarget = { x: t.x, y: ty };
    velX = velY = 0;
    dots.forEach((d) => d.setAttribute('aria-selected', String(d.dataset.face === name)));
  }

  dots.forEach((d) => d.addEventListener('click', () => selectFace(d.dataset.face)));

  window.addEventListener('resize', () => { HALF = measure(); });
  reduce.addEventListener('change', () => { autoSpin = !reduce.matches; });

  draw();
  requestAnimationFrame(loop);
})();
