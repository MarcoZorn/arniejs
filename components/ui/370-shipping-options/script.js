(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ITEM_COST = 58.0;

  var radios = Array.prototype.slice.call(document.querySelectorAll('[data-shipping-radio]'));
  var shippingOut = document.querySelector('[data-shipping-cost]');
  var totalOut = document.querySelector('[data-order-total]');
  var itemCostOut = document.querySelector('[data-item-cost]');
  var totalRow = totalOut ? totalOut.closest('.sho-summary-row') : null;
  if (!radios.length || !shippingOut || !totalOut || !itemCostOut) return;

  function formatMoney(value) {
    return '$' + value.toFixed(2);
  }

  itemCostOut.textContent = formatMoney(ITEM_COST);

  function update() {
    var checked = radios.filter(function (r) { return r.checked; })[0];
    var price = checked ? parseFloat(checked.closest('[data-price]').dataset.price) : 0;

    shippingOut.textContent = price === 0 ? 'Free' : formatMoney(price);
    totalOut.textContent = formatMoney(ITEM_COST + price);

    if (!reduceMotion && totalRow) {
      totalRow.animate(
        [{ opacity: 0.4 }, { opacity: 1 }],
        { duration: 180, easing: 'ease-out' }
      );
    }
  }

  radios.forEach(function (radio) {
    radio.addEventListener('change', update);
  });

  update();
})();
