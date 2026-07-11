(function () {
  var statusEl = document.getElementById('netStatus');
  var labelEl = document.getElementById('netLabel');

  if (!statusEl || !labelEl) return;

  function render() {
    var online = navigator.onLine;
    statusEl.setAttribute('data-online', String(online));
    labelEl.textContent = online ? 'Online' : 'Offline';
  }

  window.addEventListener('online', render);
  window.addEventListener('offline', render);

  render();
})();
