(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const svCanvas = document.getElementById('svCanvas');
  const svCtx = svCanvas.getContext('2d');
  const svCursor = document.getElementById('svCursor');
  const hueCanvas = document.getElementById('hueCanvas');
  const hueCtx = hueCanvas.getContext('2d');
  const hueThumb = document.getElementById('hueThumb');
  const preview = document.getElementById('preview');
  const hexInput = document.getElementById('hexInput');
  const presetsRow = document.getElementById('presets');

  const state = { h: 22, s: 0.68, v: 0.77 }; // starts near --accent-terra

  const PRESETS = [
    { name: 'Terracotta', hex: '#c4622d' },
    { name: 'Sand', hex: '#d4a85a' },
    { name: 'Moss', hex: '#5a7a3a' },
    { name: 'Rust', hex: '#a03820' },
    { name: 'Clay', hex: '#9b6b3a' },
    { name: 'Sage', hex: '#8fa86e' },
    { name: 'Deep bark', hex: '#3d2b14' },
    { name: 'Bone', hex: '#f0e6d3' }
  ];

  function hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return [h, s, v];
  }

  function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return null;
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  }

  function drawHue() {
    const w = hueCanvas.width, h = hueCanvas.height;
    const grad = hueCtx.createLinearGradient(0, 0, w, 0);
    for (let i = 0; i <= 360; i += 30) {
      const [r, g, b] = hsvToRgb(i, 1, 1);
      grad.addColorStop(i / 360, `rgb(${r},${g},${b})`);
    }
    hueCtx.fillStyle = grad;
    hueCtx.fillRect(0, 0, w, h);
  }

  function drawSV() {
    const w = svCanvas.width, h = svCanvas.height;
    const [r, g, b] = hsvToRgb(state.h, 1, 1);
    svCtx.fillStyle = `rgb(${r},${g},${b})`;
    svCtx.fillRect(0, 0, w, h);

    const whiteGrad = svCtx.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    svCtx.fillStyle = whiteGrad;
    svCtx.fillRect(0, 0, w, h);

    const blackGrad = svCtx.createLinearGradient(0, 0, 0, h);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
    svCtx.fillStyle = blackGrad;
    svCtx.fillRect(0, 0, w, h);
  }

  function updateUI() {
    const [r, g, b] = hsvToRgb(state.h, state.s, state.v);
    const hex = rgbToHex(r, g, b);
    preview.style.background = hex;
    hexInput.value = hex;

    const svRect = { w: svCanvas.clientWidth, h: svCanvas.clientHeight };
    svCursor.style.left = (state.s * svRect.w) + 'px';
    svCursor.style.top = ((1 - state.v) * svRect.h) + 'px';
    const [cr, cg, cb] = hsvToRgb(state.h, state.s, state.v);
    svCursor.style.background = state.v > 0.6 && state.s < 0.4 ? '#1a1208' : '#fff';

    const hueW = hueCanvas.clientWidth;
    hueThumb.style.left = ((state.h / 360) * hueW) + 'px';

    svCanvas.setAttribute('aria-valuetext', hex);
  }

  function setFromHex(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    state.h = h; state.s = s; state.v = v;
    drawSV();
    updateUI();
  }

  function pointerToSV(clientX, clientY) {
    const rect = svCanvas.getBoundingClientRect();
    let x = (clientX - rect.left) / rect.width;
    let y = (clientY - rect.top) / rect.height;
    x = Math.min(1, Math.max(0, x));
    y = Math.min(1, Math.max(0, y));
    state.s = x;
    state.v = 1 - y;
    updateUI();
  }

  function pointerToHue(clientX) {
    const rect = hueCanvas.getBoundingClientRect();
    let x = (clientX - rect.left) / rect.width;
    x = Math.min(1, Math.max(0, x));
    state.h = x * 360;
    drawSV();
    updateUI();
  }

  let draggingSV = false;
  let draggingHue = false;

  svCanvas.addEventListener('pointerdown', (e) => {
    draggingSV = true;
    svCanvas.setPointerCapture(e.pointerId);
    pointerToSV(e.clientX, e.clientY);
  });
  svCanvas.addEventListener('pointermove', (e) => {
    if (draggingSV) pointerToSV(e.clientX, e.clientY);
  });
  svCanvas.addEventListener('pointerup', (e) => {
    draggingSV = false;
    svCanvas.releasePointerCapture(e.pointerId);
  });
  svCanvas.addEventListener('keydown', (e) => {
    const step = 0.02;
    if (e.key === 'ArrowRight') { state.s = Math.min(1, state.s + step); updateUI(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { state.s = Math.max(0, state.s - step); updateUI(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { state.v = Math.min(1, state.v + step); updateUI(); e.preventDefault(); }
    if (e.key === 'ArrowDown') { state.v = Math.max(0, state.v - step); updateUI(); e.preventDefault(); }
  });

  hueCanvas.addEventListener('pointerdown', (e) => {
    draggingHue = true;
    hueCanvas.setPointerCapture(e.pointerId);
    pointerToHue(e.clientX);
  });
  hueCanvas.addEventListener('pointermove', (e) => {
    if (draggingHue) pointerToHue(e.clientX);
  });
  hueCanvas.addEventListener('pointerup', (e) => {
    draggingHue = false;
    hueCanvas.releasePointerCapture(e.pointerId);
  });
  hueCanvas.addEventListener('keydown', (e) => {
    const step = 4;
    if (e.key === 'ArrowRight') { state.h = Math.min(360, state.h + step); drawSV(); updateUI(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { state.h = Math.max(0, state.h - step); drawSV(); updateUI(); e.preventDefault(); }
  });

  hexInput.addEventListener('change', () => {
    let v = hexInput.value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      setFromHex(v);
    } else {
      hexInput.value = preview.style.background ? rgbToHex(...hexToRgb(hexInput.dataset.last || '#c4622d')) : '#c4622d';
    }
  });

  PRESETS.forEach((p) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.background = p.hex;
    btn.setAttribute('aria-label', p.name + ' ' + p.hex);
    btn.title = p.name + ' — ' + p.hex;
    btn.addEventListener('click', () => setFromHex(p.hex));
    presetsRow.appendChild(btn);
  });

  drawHue();
  drawSV();
  updateUI();

  window.addEventListener('resize', () => {
    if (!reduce) updateUI();
  });
})();
