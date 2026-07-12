(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bell = document.getElementById('notifBell');
  var badge = document.getElementById('notifBadge');
  var panel = document.getElementById('notifPanel');
  var list = document.getElementById('notifList');
  var markAllBtn = document.getElementById('notifMarkAll');

  if (!bell || !badge || !panel || !list || !markAllBtn) return;

  var notifications = [
    { id: 'n1', name: 'Amara Osei', initials: 'AO', color: '#5a7a3a', text: '<strong>Amara Osei</strong> commented on your bed layout.', time: '6m ago', unread: true },
    { id: 'n2', name: 'Rowan Bekele', initials: 'RB', color: '#c4622d', text: '<strong>Rowan Bekele</strong> mentioned you in Growth &amp; automation.', time: '22m ago', unread: true },
    { id: 'n3', name: 'Petra Voss', initials: 'PV', color: '#9b6b3a', text: '<strong>Petra Voss</strong> shared a new irrigation schedule.', time: '1h ago', unread: true },
    { id: 'n4', name: 'Elias Nwachukwu', initials: 'EN', color: '#8fa86e', text: '<strong>Elias Nwachukwu</strong> replied to your comment.', time: '3h ago', unread: false },
    { id: 'n5', name: 'System', initials: 'SY', color: '#a03820', text: 'Frost warning for tomorrow night in your zone.', time: '5h ago', unread: true },
    { id: 'n6', name: 'Tamsin Cole', initials: 'TC', color: '#d4a85a', text: '<strong>Tamsin Cole</strong> invited you to the co-op plot.', time: '1d ago', unread: false }
  ];

  function unreadCount() {
    return notifications.filter(function (n) { return n.unread; }).length;
  }

  function updateBadge() {
    var count = unreadCount();
    if (count > 0) {
      badge.hidden = false;
      badge.textContent = count > 9 ? '9+' : String(count);
    } else {
      badge.hidden = true;
    }
    markAllBtn.disabled = count === 0;
  }

  function render() {
    list.innerHTML = '';

    if (notifications.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'notif-empty';
      empty.textContent = 'Nothing new yet.';
      list.appendChild(empty);
      updateBadge();
      return;
    }

    notifications.forEach(function (n) {
      var item = document.createElement('div');
      item.className = 'notif-item' + (n.unread ? '' : ' is-read');
      item.dataset.id = n.id;
      item.setAttribute('role', 'menuitem');
      item.tabIndex = 0;

      var avatar = document.createElement('div');
      avatar.className = 'notif-avatar';
      avatar.style.setProperty('--av-bg', n.color);
      avatar.textContent = n.initials;
      item.appendChild(avatar);

      var body = document.createElement('div');
      body.className = 'notif-item-body';

      var text = document.createElement('p');
      text.className = 'notif-item-text';
      text.innerHTML = n.text;
      body.appendChild(text);

      var time = document.createElement('span');
      time.className = 'notif-item-time';
      time.textContent = n.time;
      body.appendChild(time);

      item.appendChild(body);

      var dot = document.createElement('span');
      dot.className = 'notif-dot';
      item.appendChild(dot);

      item.addEventListener('click', function () {
        if (!n.unread) return;
        n.unread = false;
        item.classList.add('is-read');
        updateBadge();
      });

      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });

      list.appendChild(item);
    });

    updateBadge();
  }

  function togglePanel(show) {
    var open = show !== undefined ? show : panel.hidden;
    panel.hidden = !open;
    bell.setAttribute('aria-expanded', open ? 'true' : 'false');
    bell.classList.toggle('is-active', open);

    if (open && !reduceMotion) {
      panel.animate(
        [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 160, easing: 'ease-out' }
      );
    }
  }

  bell.addEventListener('click', function (e) {
    e.stopPropagation();
    togglePanel();
  });

  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== bell) {
      togglePanel(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) {
      togglePanel(false);
      bell.focus();
    }
  });

  markAllBtn.addEventListener('click', function () {
    notifications.forEach(function (n) { n.unread = false; });
    render();
  });

  render();
})();
