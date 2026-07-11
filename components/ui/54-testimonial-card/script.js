(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stars = document.querySelectorAll('.testimonial__stars svg');
  var rating = parseInt(document.querySelector('.testimonial__stars').dataset.rating, 10) || 0;

  stars.forEach(function (star, i) {
    star.style.opacity = i < rating ? '1' : '.25';
    if (reduce) return;
    star.style.transition = 'transform .2s ease';
    star.addEventListener('pointerenter', function () {
      star.style.transform = 'scale(1.2)';
    });
    star.addEventListener('pointerleave', function () {
      star.style.transform = '';
    });
  });
})();
