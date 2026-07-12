(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.querySelector('[data-cart-list]');
  var emptyState = document.querySelector('[data-empty]');
  var subtotalOut = document.querySelector('[data-subtotal]');
  var checkoutBtn = document.querySelector('[data-checkout]');
  if (!list || !emptyState || !subtotalOut || !checkoutBtn) return;

  function formatMoney(value) {
    return '$' + value.toFixed(2);
  }

  function updateItemTotal(item) {
    var price = parseFloat(item.dataset.price);
    var qty = parseInt(item.dataset.qty, 10);
    var total = item.querySelector('[data-item-total]');
    total.textContent = formatMoney(price * qty);
    item.querySelector('[data-qty-out]').textContent = qty;
  }

  function recalcSubtotal() {
    var items = Array.prototype.slice.call(list.querySelectorAll('[data-item]'));
    var subtotal = items.reduce(function (sum, item) {
      return sum + parseFloat(item.dataset.price) * parseInt(item.dataset.qty, 10);
    }, 0);

    subtotalOut.textContent = formatMoney(subtotal);

    var isEmpty = items.length === 0;
    emptyState.hidden = !isEmpty;
    list.hidden = isEmpty;
    checkoutBtn.disabled = isEmpty;
  }

  function removeItem(item) {
    function finish() {
      item.remove();
      recalcSubtotal();
    }

    if (reduceMotion) {
      finish();
      return;
    }

    item.classList.add('is-removing');
    window.setTimeout(finish, 200);
  }

  list.addEventListener('click', function (evt) {
    var item = evt.target.closest('[data-item]');
    if (!item) return;

    if (evt.target.closest('[data-increase]')) {
      item.dataset.qty = String(parseInt(item.dataset.qty, 10) + 1);
      updateItemTotal(item);
      recalcSubtotal();
      return;
    }

    if (evt.target.closest('[data-decrease]')) {
      var next = parseInt(item.dataset.qty, 10) - 1;
      if (next <= 0) {
        removeItem(item);
        return;
      }
      item.dataset.qty = String(next);
      updateItemTotal(item);
      recalcSubtotal();
      return;
    }

    if (evt.target.closest('[data-remove]')) {
      removeItem(item);
    }
  });

  checkoutBtn.addEventListener('click', function () {
    if (checkoutBtn.disabled) return;
    var original = checkoutBtn.textContent;
    checkoutBtn.textContent = 'Heading to checkout…';
    window.setTimeout(function () {
      checkoutBtn.textContent = original;
    }, 1800);
  });

  recalcSubtotal();
})();
