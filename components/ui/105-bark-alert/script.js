(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stack = document.querySelector('.alert-stack');
  var restoreBtn = document.getElementById('restoreBtn');
  var dismissed = [];

  function dismissAlert(alert) {
    dismissed.push(alert);
    if (reduceMotion) {
      alert.style.display = 'none';
    } else {
      alert.classList.add('closing');
    }
    restoreBtn.hidden = false;
  }

  stack.addEventListener('click', function (e) {
    var btn = e.target.closest('.alert-dismiss');
    if (!btn) return;
    var alert = btn.closest('.alert');
    dismissAlert(alert);
  });

  restoreBtn.addEventListener('click', function () {
    dismissed.forEach(function (alert) {
      alert.classList.remove('closing');
      alert.style.display = '';
    });
    dismissed = [];
    restoreBtn.hidden = true;
  });
})();
