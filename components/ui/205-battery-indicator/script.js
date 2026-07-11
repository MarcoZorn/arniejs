(function () {
  var fill = document.getElementById('batteryFill');
  var levelEl = document.getElementById('batteryLevel');
  var stateEl = document.getElementById('batteryState');

  if (!fill || !levelEl || !stateEl) return;

  function render(battery) {
    var pct = Math.round(battery.level * 100);
    fill.style.width = pct + '%';
    fill.classList.toggle('is-low', pct <= 20 && !battery.charging);
    fill.classList.toggle('is-charging', battery.charging);
    levelEl.textContent = pct + '%';
    stateEl.textContent = battery.charging ? 'Charging' : 'On battery';
  }

  if (!('getBattery' in navigator)) {
    stateEl.textContent = 'Battery Status API not supported in this browser.';
    levelEl.textContent = 'N/A';
    return;
  }

  navigator.getBattery().then(function (battery) {
    render(battery);
    battery.addEventListener('levelchange', function () { render(battery); });
    battery.addEventListener('chargingchange', function () { render(battery); });
  }).catch(function () {
    stateEl.textContent = 'Battery status unavailable.';
    levelEl.textContent = 'N/A';
  });
})();
