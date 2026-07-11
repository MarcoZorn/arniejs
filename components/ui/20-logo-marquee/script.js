(function () {
  // inline SVG glyphs (simple geometric marks)
  const icons = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17l-6 3.4 1.4-6.8L2.3 9l6.9-.7z"/></svg>',
    ring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="8"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
    hex: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l8.5 5v10L12 22l-8.5-5V7z"/></svg>',
    tri: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 16H3z"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="2.4"/><circle cx="12" cy="12" r="2.4"/><circle cx="18" cy="12" r="2.4"/></svg>'
  };

  const rowA = [
    ['star', 'Northwind'], ['ring', 'Orbital'], ['bolt', 'Voltage'],
    ['hex', 'Hexforce'], ['tri', 'Apex Labs'], ['dots', 'Continuum'],
    ['ring', 'Lumen'], ['star', 'Polaris']
  ];
  const rowB = [
    ['bolt', 'Fusionary'], ['hex', 'Basalt'], ['dots', 'Meridian'],
    ['tri', 'Delta Nine'], ['star', 'Astra'], ['ring', 'Halo Systems'],
    ['bolt', 'Quanta'], ['hex', 'Bedrock']
  ];

  function logoEl(icon, name) {
    const el = document.createElement('span');
    el.className = 'logo';
    el.innerHTML = icons[icon] + '<span>' + name + '</span>';
    return el;
  }

  // Fill a track twice so translateX(-50%) loops seamlessly.
  function fillTrack(track, data) {
    const frag = document.createDocumentFragment();
    for (let copy = 0; copy < 2; copy++) {
      data.forEach(([icon, name]) => frag.appendChild(logoEl(icon, name)));
    }
    track.appendChild(frag);
  }

  const tracks = document.querySelectorAll('[data-track]');
  fillTrack(tracks[0], rowA);
  fillTrack(tracks[1], rowB);
})();
