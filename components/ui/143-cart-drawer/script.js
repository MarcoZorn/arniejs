(function () {
  var openBtn = document.getElementById('openCartBtn');
  var closeBtn = document.getElementById('closeCartBtn');
  var overlay = document.getElementById('cartOverlay');
  var drawer = document.getElementById('cartDrawer');
  var list = document.getElementById('cartList');
  var emptyState = document.getElementById('emptyState');
  var subtotalValue = document.getElementById('subtotalValue');
  var itemCountLabel = document.getElementById('itemCountLabel');
  var cartCount = document.getElementById('cartCount');
  var checkoutBtn = document.getElementById('checkoutBtn');

  if (!openBtn || !drawer || !list) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openDrawer() {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  function formatMoney(n) {
    return '$' + n.toFixed(2);
  }

  function recalc() {
    var items = list.querySelectorAll('.cart-item');
    var subtotal = 0;
    var totalQty = 0;

    items.forEach(function (item) {
      var price = parseFloat(item.getAttribute('data-price'));
      var qty = parseInt(item.querySelector('[data-qty]').textContent, 10);
      subtotal += price * qty;
      totalQty += qty;
    });

    subtotalValue.textContent = formatMoney(subtotal);
    itemCountLabel.textContent = '(' + items.length + ')';
    if (cartCount) cartCount.textContent = totalQty;

    var hasItems = items.length > 0;
    emptyState.hidden = hasItems;
    list.hidden = !hasItems;
    checkoutBtn.disabled = !hasItems;
  }

  list.addEventListener('click', function (e) {
    var qtyBtn = e.target.closest('[data-action]');
    var removeBtn = e.target.closest('.cart-item__remove');
    var item = e.target.closest('.cart-item');
    if (!item) return;

    if (qtyBtn) {
      var qtyEl = item.querySelector('[data-qty]');
      var qty = parseInt(qtyEl.textContent, 10);
      if (qtyBtn.getAttribute('data-action') === 'inc') {
        qty = Math.min(qty + 1, 9);
      } else {
        qty = Math.max(qty - 1, 1);
      }
      qtyEl.textContent = qty;
      recalc();
      return;
    }

    if (removeBtn) {
      if (reduceMotion) {
        item.remove();
        recalc();
        return;
      }
      item.classList.add('is-removing');
      var handled = false;
      item.addEventListener('transitionend', function onEnd(ev) {
        if (ev.target !== item || handled) return;
        handled = true;
        item.remove();
        recalc();
      });
      setTimeout(function () {
        if (!handled) {
          handled = true;
          item.remove();
          recalc();
        }
      }, 500);
    }
  });

  checkoutBtn.addEventListener('click', function () {
    checkoutBtn.textContent = 'Processing…';
    checkoutBtn.disabled = true;
    setTimeout(function () {
      checkoutBtn.textContent = 'Checkout';
      recalc();
    }, 1200);
  });

  recalc();
})();
