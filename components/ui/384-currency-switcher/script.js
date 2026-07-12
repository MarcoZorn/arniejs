(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var select = document.querySelector('[data-currency-select]');
  var prices = Array.prototype.slice.call(document.querySelectorAll('.curr-price'));
  if (!select || !prices.length) return;

  // Static illustrative conversion rates, all relative to USD.
  var rates = {
    USD: { rate: 1, symbol: '$', locale: 'en-US' },
    EUR: { rate: 0.92, symbol: '€', locale: 'de-DE' },
    GBP: { rate: 0.78, symbol: '£', locale: 'en-GB' },
    JPY: { rate: 156.3, symbol: '¥', locale: 'ja-JP' }
  };

  function formatPrice(usdValue, currencyCode) {
    var config = rates[currencyCode] || rates.USD;
    var converted = usdValue * config.rate;
    var decimals = currencyCode === 'JPY' ? 0 : 2;

    var formatted;
    try {
      formatted = new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(converted);
    } catch (err) {
      formatted = converted.toFixed(decimals);
    }

    return config.symbol + formatted;
  }

  function applyCurrency(currencyCode) {
    prices.forEach(function (el) {
      var usdValue = parseFloat(el.getAttribute('data-price-usd'));
      if (isNaN(usdValue)) return;

      if (!reduceMotion) {
        el.classList.add('is-updating');
      }

      el.textContent = formatPrice(usdValue, currencyCode);

      if (!reduceMotion) {
        window.setTimeout(function () {
          el.classList.remove('is-updating');
        }, 120);
      }
    });
  }

  select.addEventListener('change', function () {
    applyCurrency(select.value);
  });

  applyCurrency(select.value);
})();
