(function () {
  const canvas = document.getElementById('spark');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const N = 40;
  let data = [];
  for (let i = 0; i < N; i++) data.push(0.3 + Math.random() * 0.4);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const step = W / (N - 1);
    const pad = 8;
    const usable = H - pad * 2;

    // area gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(111,220,192,0.35)');
    grad.addColorStop(1, 'rgba(111,220,192,0)');

    ctx.beginPath();
    ctx.moveTo(0, H);
    data.forEach(function (v, i) {
      ctx.lineTo(i * step, pad + (1 - v) * usable);
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    data.forEach(function (v, i) {
      const x = i * step;
      const y = pad + (1 - v) * usable;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#8fa86e';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // head dot
    const lx = W;
    const ly = pad + (1 - data[N - 1]) * usable;
    ctx.beginPath();
    ctx.arc(lx - 1, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#bff3e6';
    ctx.fill();
  }

  function tick() {
    data.shift();
    let next = data[data.length - 1] + (Math.random() - 0.5) * 0.35;
    next = Math.max(0.12, Math.min(0.92, next));
    data.push(next);
    draw();
  }

  draw();
  if (!reduce) setInterval(tick, 900);
})();
