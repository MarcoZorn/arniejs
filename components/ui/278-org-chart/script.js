(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var container = document.getElementById('orgc-chart');
  if (!container) return;

  // Nested org data: each person has a name, role, and a `reports` array of direct reports.
  var DATA = {
    name: 'Marisol Vega',
    role: 'Founder & CEO',
    reports: [
      {
        name: 'Devon Ashworth',
        role: 'VP Growing Operations',
        reports: [
          { name: 'Priya Anand', role: 'Field Manager', reports: [] },
          { name: 'Tomas Reyes', role: 'Field Manager', reports: [] },
          { name: 'Kenji Osei', role: 'Irrigation Lead', reports: [] }
        ]
      },
      {
        name: 'Harriet Lowe',
        role: 'VP Product',
        reports: [
          { name: 'Sam Okafor', role: 'Design Lead', reports: [] },
          { name: 'Leah Bianchi', role: 'Engineering Lead', reports: [
            { name: 'Nadia Farouk', role: 'Frontend Engineer', reports: [] },
            { name: 'Owen Petit', role: 'Backend Engineer', reports: [] }
          ] }
        ]
      },
      {
        name: 'Carlos Mbeki',
        role: 'VP Operations',
        reports: [
          { name: 'Ines Tavares', role: 'Logistics Manager', reports: [] }
        ]
      }
    ]
  };

  function initials(name) {
    return name.split(' ').map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase();
  }

  function countDescendants(person) {
    if (!person.reports || !person.reports.length) return 0;
    var total = person.reports.length;
    person.reports.forEach(function (child) {
      total += countDescendants(child);
    });
    return total;
  }

  function buildNode(person) {
    var li = document.createElement('li');

    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'orgc-card';
    card.setAttribute('aria-expanded', 'true');

    var hasReports = person.reports && person.reports.length > 0;
    var total = countDescendants(person);

    var avatarHtml = '<span class="orgc-avatar">' + initials(person.name) + '</span>';
    var nameHtml = '<span class="orgc-name">' + person.name + '</span>';
    var roleHtml = '<span class="orgc-role">' + person.role + '</span>';
    var countHtml = hasReports ? '<span class="orgc-count">' + total + ' report' + (total === 1 ? '' : 's') + '</span>' : '';
    var toggleHtml = hasReports ? '<span class="orgc-toggle-icon" aria-hidden="true">−</span>' : '';

    card.innerHTML = avatarHtml + nameHtml + roleHtml + countHtml + toggleHtml;
    li.appendChild(card);

    if (hasReports) {
      var ul = document.createElement('ul');
      person.reports.forEach(function (child) {
        ul.appendChild(buildNode(child));
      });
      li.appendChild(ul);

      card.addEventListener('click', function () {
        var collapsed = li.classList.toggle('is-collapsed');
        card.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        var icon = card.querySelector('.orgc-toggle-icon');
        if (icon) icon.textContent = collapsed ? '+' : '−';
      });
    }

    return li;
  }

  var rootUl = document.createElement('ul');
  rootUl.appendChild(buildNode(DATA));
  container.appendChild(rootUl);
})();
