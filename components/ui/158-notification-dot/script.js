(function () {
  var toggleBtn = document.getElementById('toggleBtn');
  var dots = [
    document.getElementById('dotBell'),
    document.getElementById('dotMsg')
  ].filter(Boolean);

  if (!toggleBtn || !dots.length) return;

  var isOn = true;

  toggleBtn.addEventListener('click', function () {
    isOn = !isOn;
    dots.forEach(function (dot) {
      dot.classList.toggle('is-off', !isOn);
    });
    toggleBtn.textContent = isOn ? 'Toggle notifications off' : 'Toggle notifications on';
  });
})();
