(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.querySelector('[data-gift-toggle]');
  var wrapLine = document.querySelector('[data-wrap-line]');
  var panel = document.querySelector('[data-gift-panel]');
  var totalEl = document.querySelector('[data-order-total]');
  var messageInput = document.querySelector('[data-gift-message]');
  var countEl = document.querySelector('[data-gift-count]');

  if (!toggle) return;

  var basePrice = 58.0;
  var giftWrapPrice = 4.0;
  var maxChars = messageInput ? parseInt(messageInput.getAttribute('maxlength'), 10) || 120 : 120;

  function updateTotal() {
    var total = basePrice + (toggle.checked ? giftWrapPrice : 0);
    if (totalEl) {
      totalEl.textContent = '$' + total.toFixed(2);
    }
  }

  function updateCount() {
    if (!messageInput || !countEl) return;
    var len = messageInput.value.length;
    countEl.textContent = String(len);
    countEl.parentElement.classList.toggle('is-near-limit', len >= maxChars - 10);
  }

  toggle.addEventListener('change', function () {
    var on = toggle.checked;

    if (wrapLine) wrapLine.hidden = !on;
    if (panel) panel.hidden = !on;

    updateTotal();

    if (!on && messageInput) {
      messageInput.value = '';
      updateCount();
    }

    if (reduceMotion || !panel || !on) return;

    panel.animate(
      [
        { opacity: 0, transform: 'translateY(-4px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 200, easing: 'ease-out' }
    );
  });

  if (messageInput) {
    messageInput.addEventListener('input', updateCount);
  }

  updateTotal();
  updateCount();
})();
