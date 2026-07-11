(function () {
  const fan = document.getElementById('fan');
  if (!fan) return;

  // touch devices don't have hover, so tap toggles the fanned-out state
  fan.addEventListener('click', () => {
    fan.classList.toggle('is-active');
  });
})();
