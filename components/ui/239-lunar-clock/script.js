(function () {
  var litPath = document.querySelector('.moon__lit');
  var phaseLabel = document.querySelector('.lunar-card__phase');
  var illumLabel = document.querySelector('.lunar-card__illum');
  var dateLabel = document.querySelector('.lunar-card__date');
  if (!litPath) return;

  var SYNODIC_MONTH = 29.530588853;
  // known new moon reference: 2000-01-06 18:14 UTC
  var REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

  function getMoonPhase(date) {
    var diffDays = (date.getTime() - REFERENCE_NEW_MOON) / 86400000;
    var phase = (diffDays % SYNODIC_MONTH) / SYNODIC_MONTH;
    if (phase < 0) phase += 1;
    return phase; // 0 = new moon, 0.5 = full moon
  }

  function phaseLabelFor(phase) {
    if (phase < 0.03 || phase > 0.97) return 'New Moon';
    if (phase < 0.22) return 'Waxing Crescent';
    if (phase < 0.28) return 'First Quarter';
    if (phase < 0.47) return 'Waxing Gibbous';
    if (phase < 0.53) return 'Full Moon';
    if (phase < 0.72) return 'Waning Gibbous';
    if (phase < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
  }

  function moonLitPath(phase, r, cx, cy) {
    var theta = phase * 2 * Math.PI;
    var rx = Math.abs(r * Math.cos(theta));
    var sweep1 = phase < 0.5 ? 1 : 0;
    var sweep2 = phase < 0.5 ? 0 : 1;

    return 'M ' + cx + ',' + (cy - r) +
      ' A ' + r + ',' + r + ' 0 0,' + sweep1 + ' ' + cx + ',' + (cy + r) +
      ' A ' + rx + ',' + r + ' 0 0,' + sweep2 + ' ' + cx + ',' + (cy - r) + ' Z';
  }

  var now = new Date();
  var phase = getMoonPhase(now);
  var illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

  litPath.setAttribute('d', moonLitPath(phase, 90, 100, 100));

  if (phaseLabel) phaseLabel.textContent = phaseLabelFor(phase);
  if (illumLabel) illumLabel.textContent = illumination + '% illuminated';
  if (dateLabel) {
    dateLabel.textContent = now.toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
})();
