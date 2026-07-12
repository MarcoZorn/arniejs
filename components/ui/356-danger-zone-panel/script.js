(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pulse(el) {
    if (reduceMotion || !el) return;
    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }],
      { duration: 200, easing: 'ease-out' }
    );
  }

  function setupAction(name) {
    var trigger = document.querySelector('[data-trigger="' + name + '"]');
    var confirm = document.querySelector('[data-confirm="' + name + '"]');
    var cancel = document.querySelector('[data-cancel="' + name + '"]');
    var confirmBtn = document.querySelector('[data-confirm-btn="' + name + '"]');
    var success = document.querySelector('[data-success="' + name + '"]');
    if (!trigger || !confirm || !cancel || !confirmBtn || !success) return;

    trigger.addEventListener('click', function () {
      confirm.hidden = false;
      trigger.hidden = true;
      var firstFocusable = confirm.querySelector('input, button');
      if (firstFocusable) firstFocusable.focus();
    });

    cancel.addEventListener('click', function () {
      confirm.hidden = true;
      trigger.hidden = false;
      trigger.focus();
    });

    confirmBtn.addEventListener('click', function () {
      if (confirmBtn.disabled) return;
      confirm.hidden = true;
      success.hidden = false;
      pulse(success);
    });
  }

  setupAction('deactivate');
  setupAction('delete');

  // Delete requires typing DELETE exactly before the button enables.
  var deleteInput = document.querySelector('[data-delete-input]');
  var deleteConfirmBtn = document.querySelector('[data-confirm-btn="delete"]');
  if (deleteInput && deleteConfirmBtn) {
    deleteInput.addEventListener('input', function () {
      deleteConfirmBtn.disabled = deleteInput.value.trim() !== 'DELETE';
    });
  }
})();
