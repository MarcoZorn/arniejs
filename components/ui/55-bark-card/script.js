(function () {
  var canvas = document.querySelector('.bark__canvas');
  var ctx = canvas.getContext('2d');
  var w = canvas.width, h = canvas.height;

  var palette = ['#1a1208', '#241a0e', '#2e2010', '#3d2b14', '#5a3e20', '#9b6b3a'];

  function drawBark() {
    ctx.fillStyle = palette[2];
    ctx.fillRect(0, 0, w, h);

    // vertical grain streaks
    var streaks = 46;
    for (var i = 0; i < streaks; i++) {
      var baseX = (w / streaks) * i;
      ctx.strokeStyle = palette[Math.floor(Math.random() * palette.length)];
      ctx.globalAlpha = 0.15 + Math.random() * 0.25;
      ctx.lineWidth = 1 + Math.random() * 2.5;
      ctx.beginPath();
      var x = baseX + (Math.random() - 0.5) * 6;
      ctx.moveTo(x, 0);
      var steps = 8;
      for (var s = 1; s <= steps; s++) {
        x += (Math.random() - 0.5) * 10;
        ctx.lineTo(x, (h / steps) * s);
      }
      ctx.stroke();
    }

    // horizontal knot rings
    ctx.globalAlpha = 0.35;
    for (var k = 0; k < 3; k++) {
      var cx = w * (0.2 + Math.random() * 0.6);
      var cy = h * (0.2 + Math.random() * 0.6);
      for (var r = 6; r < 34; r += 6) {
        ctx.strokeStyle = palette[4];
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
  }

  drawBark();
})();
