(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var form = document.querySelector('.addr-form');
  if (!form) return;

  var countrySelect = form.querySelector('#addr-country');
  var stateSelect = form.querySelector('#addr-state');
  var status = form.querySelector('.addr-status');

  var REGIONS = {
    US: {
      label: 'State',
      placeholder: 'Select a state…',
      options: [
        { value: 'CA', label: 'California' },
        { value: 'NY', label: 'New York' },
        { value: 'TX', label: 'Texas' },
        { value: 'WA', label: 'Washington' }
      ]
    },
    CA: {
      label: 'Province',
      placeholder: 'Select a province…',
      options: [
        { value: 'ON', label: 'Ontario' },
        { value: 'QC', label: 'Quebec' },
        { value: 'BC', label: 'British Columbia' },
        { value: 'AB', label: 'Alberta' }
      ]
    },
    DE: {
      label: 'State',
      placeholder: 'Select a state…',
      options: [
        { value: 'BY', label: 'Bavaria' },
        { value: 'BE', label: 'Berlin' },
        { value: 'NW', label: 'North Rhine-Westphalia' },
        { value: 'HE', label: 'Hesse' }
      ]
    },
    AU: {
      label: 'State / Territory',
      placeholder: 'Select a state or territory…',
      options: [
        { value: 'NSW', label: 'New South Wales' },
        { value: 'VIC', label: 'Victoria' },
        { value: 'QLD', label: 'Queensland' },
        { value: 'WA', label: 'Western Australia' }
      ]
    }
  };

  function populateStates(countryCode) {
    stateSelect.innerHTML = '';

    var region = REGIONS[countryCode];

    if (!region) {
      var placeholderOpt = document.createElement('option');
      placeholderOpt.value = '';
      placeholderOpt.textContent = 'Choose a country first…';
      stateSelect.appendChild(placeholderOpt);
      stateSelect.disabled = true;
      return;
    }

    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = region.placeholder;
    stateSelect.appendChild(placeholder);

    region.options.forEach(function (opt) {
      var el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.label;
      stateSelect.appendChild(el);
    });

    stateSelect.disabled = false;
  }

  countrySelect.addEventListener('change', function () {
    populateStates(countrySelect.value);
    clearError('state');
  });

  function setError(fieldName, message) {
    var errEl = form.querySelector('[data-error-for="' + fieldName + '"]');
    var input = form.querySelector('[name="' + fieldName + '"]');
    if (errEl) errEl.textContent = message || '';
    if (input) input.classList.toggle('is-invalid', !!message);
  }

  function clearError(fieldName) {
    setError(fieldName, '');
  }

  function validate() {
    var valid = true;
    var fields = ['street', 'city', 'postal', 'country', 'state'];

    fields.forEach(function (name) {
      var input = form.querySelector('[name="' + name + '"]');
      var value = input ? input.value.trim() : '';

      if (!value) {
        setError(name, 'This field is required.');
        valid = false;
      } else {
        clearError(name);
      }
    });

    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = validate();

    if (!isValid) {
      status.textContent = 'A few fields still need attention above.';
      status.style.color = 'var(--accent-rust)';

      var firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.style.color = 'var(--accent-sage)';
    status.textContent = 'Address planted. We’ll ship to ' + form.querySelector('#addr-city').value.trim() + '.';

    if (!reduceMotion) {
      var card = document.querySelector('.addr-card');
      if (card) {
        card.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.01)' },
            { transform: 'scale(1)' }
          ],
          { duration: 260, easing: 'ease-out' }
        );
      }
    }
  });

  // Clear individual field errors as the user fixes them.
  form.querySelectorAll('.addr-input').forEach(function (input) {
    input.addEventListener('input', function () {
      if (input.value.trim()) clearError(input.name);
    });
  });
})();
