(function () {
  const input = document.getElementById('pwdInput');
  const toggle = document.getElementById('pwdToggle');
  const segments = Array.from(document.querySelectorAll('.pwd__segment'));
  const strengthLabel = document.getElementById('pwdStrengthLabel');
  const checklist = document.getElementById('pwdChecklist');
  const form = document.getElementById('pwdForm');

  const colors = ['#a03820', '#a03820', '#d4a85a', '#5a7a3a'];
  const labels = ['Enter a password', 'Weak', 'Medium', 'Strong'];

  toggle.addEventListener('click', () => {
    const isVisible = input.type === 'text';
    input.type = isVisible ? 'password' : 'text';
    toggle.setAttribute('aria-pressed', String(!isVisible));
    toggle.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
  });

  function evaluate(password) {
    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password) && /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };

    let varietyScore = 0;
    if (/[a-z]/.test(password)) varietyScore++;
    if (/[A-Z]/.test(password)) varietyScore++;
    if (/[0-9]/.test(password)) varietyScore++;
    if (/[^A-Za-z0-9]/.test(password)) varietyScore++;

    let score = 0;
    if (password.length === 0) {
      score = 0;
    } else {
      if (password.length >= 6) score++;
      if (password.length >= 10) score++;
      if (password.length >= 14) score++;
      score += Math.max(0, varietyScore - 1);
      score = Math.min(4, Math.max(password.length > 0 ? 1 : 0, score));
    }

    return { checks, score };
  }

  function render(password) {
    const { checks, score } = evaluate(password);

    segments.forEach((seg, i) => {
      const active = i < score;
      seg.classList.toggle('is-active', active);
      seg.style.background = active ? colors[score] : 'var(--bg-subtle)';
      seg.style.color = active ? colors[score] : 'transparent';
    });

    strengthLabel.textContent = labels[score];
    strengthLabel.style.color = score === 0 ? 'var(--text-faint)' : colors[score];

    Object.keys(checks).forEach((key) => {
      const li = checklist.querySelector(`[data-check="${key}"]`);
      if (li) li.classList.toggle('is-met', checks[key]);
    });
  }

  input.addEventListener('input', () => render(input.value));
  render('');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { score } = evaluate(input.value);
    if (score < 2) {
      strengthLabel.textContent = 'Password too weak — add more length or variety.';
      strengthLabel.style.color = 'var(--accent-rust)';
      input.focus();
      return;
    }
    strengthLabel.textContent = 'Root password set successfully.';
    strengthLabel.style.color = 'var(--accent-sage)';
  });
})();
