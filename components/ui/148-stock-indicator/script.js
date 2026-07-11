(function () {
  var liveIndicator = document.getElementById('liveIndicator');
  var liveLabel = document.getElementById('liveLabel');
  var cycleBtn = document.getElementById('cycleBtn');

  if (!liveIndicator || !liveLabel || !cycleBtn) return;

  var states = [
    { state: 'in-stock', label: 'In Stock' },
    { state: 'low-stock', label: 'Only 3 left' },
    { state: 'out-of-stock', label: 'Out of Stock' }
  ];
  var index = 0;

  cycleBtn.addEventListener('click', function () {
    index = (index + 1) % states.length;
    var next = states[index];
    liveIndicator.setAttribute('data-state', next.state);
    liveLabel.textContent = next.label;
  });
})();
