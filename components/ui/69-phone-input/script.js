(function () {
  const countries = [
    { name: 'United States', flag: '🇺🇸', dial: '+1', format: '(201) 555-0123' },
    { name: 'United Kingdom', flag: '🇬🇧', dial: '+44', format: '7911 123456' },
    { name: 'Canada', flag: '🇨🇦', dial: '+1', format: '(416) 555-0123' },
    { name: 'Germany', flag: '🇩🇪', dial: '+49', format: '1512 3456789' },
    { name: 'France', flag: '🇫🇷', dial: '+33', format: '6 12 34 56 78' },
    { name: 'Italy', flag: '🇮🇹', dial: '+39', format: '312 345 6789' },
    { name: 'Spain', flag: '🇪🇸', dial: '+34', format: '612 34 56 78' },
    { name: 'India', flag: '🇮🇳', dial: '+91', format: '98765 43210' },
    { name: 'Japan', flag: '🇯🇵', dial: '+81', format: '90-1234-5678' },
    { name: 'Australia', flag: '🇦🇺', dial: '+61', format: '0412 345 678' },
    { name: 'Brazil', flag: '🇧🇷', dial: '+55', format: '(11) 91234-5678' },
    { name: 'Mexico', flag: '🇲🇽', dial: '+52', format: '55 1234 5678' },
    { name: 'South Africa', flag: '🇿🇦', dial: '+27', format: '071 234 5678' },
    { name: 'Portugal', flag: '🇵🇹', dial: '+351', format: '912 345 678' },
    { name: 'Netherlands', flag: '🇳🇱', dial: '+31', format: '6 12345678' }
  ];

  const countryBtn = document.getElementById('countryBtn');
  const countryFlag = document.getElementById('countryFlag');
  const countryDial = document.getElementById('countryDial');
  const dropdown = document.getElementById('countryDropdown');
  const phoneInput = document.getElementById('phoneInput');
  const phoneHint = document.getElementById('phoneHint');

  let activeIndex = 0;
  let open = false;

  function buildDropdown() {
    dropdown.innerHTML = '';
    countries.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'phone__option';
      li.setAttribute('role', 'option');
      li.tabIndex = -1;
      li.dataset.index = String(i);
      li.innerHTML = `
        <span class="phone__option-flag">${c.flag}</span>
        <span class="phone__option-name">${c.name}</span>
        <span class="phone__option-dial">${c.dial}</span>
      `;
      li.addEventListener('click', () => selectCountry(i));
      dropdown.appendChild(li);
    });
  }

  function selectCountry(i) {
    activeIndex = i;
    const c = countries[i];
    countryFlag.textContent = c.flag;
    countryDial.textContent = c.dial;
    phoneInput.placeholder = c.format;
    phoneHint.textContent = `Format: ${c.name}, e.g. ${c.format}`;
    Array.from(dropdown.children).forEach((el, idx) => el.classList.toggle('is-active', idx === i));
    closeDropdown();
  }

  function openDropdown() {
    open = true;
    dropdown.hidden = false;
    countryBtn.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeydown);
  }

  function closeDropdown() {
    open = false;
    dropdown.hidden = true;
    countryBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onKeydown);
    countryBtn.focus();
  }

  function onDocClick(e) {
    if (!dropdown.contains(e.target) && e.target !== countryBtn && !countryBtn.contains(e.target)) {
      closeDropdown();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(countries.length - 1, activeIndex + 1);
      focusOption();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      focusOption();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectCountry(activeIndex);
    }
  }

  function focusOption() {
    Array.from(dropdown.children).forEach((el, idx) => {
      el.classList.toggle('is-active', idx === activeIndex);
      if (idx === activeIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  countryBtn.addEventListener('click', () => {
    if (open) {
      closeDropdown();
    } else {
      openDropdown();
      focusOption();
    }
  });

  buildDropdown();
  selectCountry(0);
})();
