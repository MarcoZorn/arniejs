(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = document.querySelector('.return-wrap');
  if (!wrap) return;

  var card = wrap.querySelector('[data-return-card]');
  var form = wrap.querySelector('[data-return-form]');
  var errorEl = wrap.querySelector('[data-return-error]');
  if (!card || !form || !errorEl) return;

  var reasonSelect = form.querySelector('#return-reason');
  var reasonLabels = {
    'wrong-size': 'Wrong size',
    'changed-mind': 'Changed my mind',
    'damaged': 'Item damaged',
    'other': 'Other'
  };

  function shake() {
    if (reduceMotion) return;
    card.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 220, easing: 'ease-out' }
    );
  }

  function generateReference() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'RTN-' + code;
  }

  function renderConfirmation(productName, orderId, reasonLabel) {
    var ref = generateReference();

    var confirm = document.createElement('div');
    confirm.className = 'return-confirm';
    confirm.setAttribute('role', 'status');

    var icon = document.createElement('div');
    icon.className = 'return-confirm-icon';
    icon.setAttribute('aria-hidden', 'true');

    var title = document.createElement('h2');
    title.className = 'return-confirm-title';
    title.textContent = 'Return request received';

    var text1 = document.createElement('p');
    text1.className = 'return-confirm-text';
    text1.textContent = productName + ' (' + orderId + ') — ' + reasonLabel;

    var text2 = document.createElement('p');
    text2.className = 'return-confirm-text';
    text2.textContent = 'We’ll email your prepaid return label shortly.';

    var refBadge = document.createElement('span');
    refBadge.className = 'return-confirm-ref';
    refBadge.textContent = ref;

    confirm.appendChild(icon);
    confirm.appendChild(title);
    confirm.appendChild(text1);
    confirm.appendChild(text2);
    confirm.appendChild(refBadge);

    card.innerHTML = '';
    card.appendChild(confirm);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var selectedOrder = form.querySelector('input[name="order"]:checked');
    var reasonValue = reasonSelect ? reasonSelect.value : '';

    if (!selectedOrder) {
      errorEl.textContent = 'Select which order you’d like to return.';
      shake();
      return;
    }

    if (!reasonValue) {
      errorEl.textContent = 'Choose a reason for the return.';
      if (reasonSelect) reasonSelect.classList.add('is-invalid');
      shake();
      return;
    }

    errorEl.textContent = '';
    if (reasonSelect) reasonSelect.classList.remove('is-invalid');

    var productName = selectedOrder.getAttribute('data-order-name') || 'Your item';
    var orderId = selectedOrder.value;
    var reasonLabel = reasonLabels[reasonValue] || reasonValue;

    renderConfirmation(productName, orderId, reasonLabel);
  });

  if (reasonSelect) {
    reasonSelect.addEventListener('change', function () {
      if (reasonSelect.value) {
        reasonSelect.classList.remove('is-invalid');
        if (errorEl.textContent === 'Choose a reason for the return.') {
          errorEl.textContent = '';
        }
      }
    });
  }

  var orderInputs = Array.prototype.slice.call(form.querySelectorAll('input[name="order"]'));
  orderInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      if (errorEl.textContent === 'Select which order you’d like to return.') {
        errorEl.textContent = '';
      }
    });
  });
})();
