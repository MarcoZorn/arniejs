(function () {
  const weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const titleEl = document.getElementById('calendarTitle');
  const gridEl = document.getElementById('calendarGrid');
  const weekdaysEl = document.getElementById('calendarWeekdays');
  const selectedEl = document.getElementById('calendarSelected');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;

  function buildWeekdays() {
    weekdaysEl.innerHTML = '';
    weekdayNames.forEach((d) => {
      const span = document.createElement('span');
      span.textContent = d;
      weekdaysEl.appendChild(span);
    });
  }

  function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function render() {
    titleEl.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    gridEl.innerHTML = '';

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, outside: true, year: viewMonth === 0 ? viewYear - 1 : viewYear, month: viewMonth === 0 ? 11 : viewMonth - 1 });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, outside: false, year: viewYear, month: viewMonth });
    }

    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    let trailingDay = 1;
    while (cells.length % 7 !== 0 || cells.length < 42) {
      cells.push({ day: trailingDay, outside: true, year: nextYear, month: nextMonth });
      trailingDay++;
      if (cells.length >= 42) break;
    }

    cells.forEach((cell) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calendar__day';
      btn.textContent = String(cell.day);
      btn.setAttribute('role', 'gridcell');

      const cellDate = new Date(cell.year, cell.month, cell.day);
      cellDate.setHours(0, 0, 0, 0);

      if (cell.outside) btn.classList.add('is-outside');
      if (isSameDay(cellDate, today)) btn.classList.add('is-today');
      if (selectedDate && isSameDay(cellDate, selectedDate)) btn.classList.add('is-selected');

      btn.addEventListener('click', () => {
        selectedDate = cellDate;
        if (cell.outside) {
          viewYear = cell.year;
          viewMonth = cell.month;
        }
        render();
        updateSelectedLabel();
      });

      gridEl.appendChild(btn);
    });
  }

  function updateSelectedLabel() {
    if (!selectedDate) {
      selectedEl.textContent = 'No date selected';
      return;
    }
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedEl.textContent = 'Selected: ' + selectedDate.toLocaleDateString(undefined, options);
  }

  prevBtn.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    render();
  });

  nextBtn.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    render();
  });

  gridEl.addEventListener('keydown', (e) => {
    const focusable = Array.from(gridEl.querySelectorAll('.calendar__day'));
    const idx = focusable.indexOf(document.activeElement);
    if (idx === -1) return;

    let nextIdx = null;
    if (e.key === 'ArrowRight') nextIdx = idx + 1;
    else if (e.key === 'ArrowLeft') nextIdx = idx - 1;
    else if (e.key === 'ArrowDown') nextIdx = idx + 7;
    else if (e.key === 'ArrowUp') nextIdx = idx - 7;

    if (nextIdx !== null && focusable[nextIdx]) {
      e.preventDefault();
      focusable[nextIdx].focus();
    }
  });

  buildWeekdays();
  render();
  updateSelectedLabel();
})();
