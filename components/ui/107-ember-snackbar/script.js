(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var snackbar = document.getElementById('snackbar');
  var msgEl = document.getElementById('snackbarMsg');
  var actionBtn = document.getElementById('snackbarAction');
  var closeBtn = document.getElementById('snackbarClose');
  var queueOneBtn = document.getElementById('queueOne');
  var queueManyBtn = document.getElementById('queueMany');

  var queue = [];
  var current = null;
  var timer = null;
  var DURATION = 3500;

  function enqueue(message, actionLabel, onAction) {
    queue.push({ message: message, actionLabel: actionLabel || 'Undo', onAction: onAction });
    if (!current) processQueue();
  }

  function processQueue() {
    if (queue.length === 0) {
      current = null;
      return;
    }
    current = queue.shift();
    msgEl.textContent = current.message;
    actionBtn.textContent = current.actionLabel;
    snackbar.classList.add('visible');
    clearTimeout(timer);
    timer = setTimeout(dismiss, DURATION);
  }

  function dismiss() {
    clearTimeout(timer);
    snackbar.classList.remove('visible');
    if (reduceMotion) {
      setTimeout(processQueue, 50);
    } else {
      setTimeout(processQueue, 250);
    }
  }

  actionBtn.addEventListener('click', function () {
    if (current && current.onAction) current.onAction();
    dismiss();
  });

  closeBtn.addEventListener('click', dismiss);

  var plantIndex = 0;
  var plants = ['tomato seedling', 'basil sprout', 'pepper plant', 'squash vine'];

  queueOneBtn.addEventListener('click', function () {
    var name = plants[plantIndex % plants.length];
    plantIndex++;
    enqueue('Removed ' + name + ' from bed', 'Undo', function () {
      msgEl.textContent = 'Restored ' + name;
    });
  });

  queueManyBtn.addEventListener('click', function () {
    enqueue('Watered Field 1', 'Undo');
    enqueue('Watered Field 2', 'Undo');
    enqueue('Watered Field 3', 'Undo');
  });

  if (reduceMotion) {
    snackbar.style.transition = 'none';
  }
})();
