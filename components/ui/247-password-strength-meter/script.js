(function () {
  var card = document.querySelector('.pwmeter-card');
  if (!card) return;

  var input = card.querySelector('.pwmeter-input');
  var toggle = card.querySelector('.pwmeter-toggle');
  var bar = card.querySelector('.pwmeter-bar');
  var word = card.querySelector('.pwmeter-strength-word');
  var checks = Array.prototype.slice.call(card.querySelectorAll('.pwmeter-check'));

  var words = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  function evaluate(value) {
    var rules = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value)
    };

    checks.forEach(function (li) {
      var rule = li.getAttribute('data-rule');
      li.classList.toggle('is-met', !!rules[rule]);
    });

    var metCount = Object.keys(rules).filter(function (k) { return rules[k]; }).length;
    var level = value.length === 0 ? 0 : Math.max(1, Math.min(4, Math.ceil(metCount * 4 / 5)));

    bar.setAttribute('data-level', String(level));
    bar.setAttribute('aria-valuenow', String(level));
    word.textContent = words[level];
  }

  input.addEventListener('input', function () {
    evaluate(input.value);
  });

  toggle.addEventListener('click', function () {
    var isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(isPassword));
    toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    input.focus();
  });

  evaluate('');
})();
