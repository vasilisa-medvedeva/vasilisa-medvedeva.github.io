/* Looping CSS demos ([data-anim] blocks) idle until the user scrolls to them:
   every animation inside starts paused (see the [data-anim] rule in each page's
   styles) and resumes — in sync, from 0% — once the block is ~a third visible. */
(function () {
  var demos = document.querySelectorAll('[data-anim]');
  if (!demos.length) return;
  if (!('IntersectionObserver' in window)) {
    demos.forEach(function (d) { d.classList.add('anim-live'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('anim-live');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  demos.forEach(function (d) { io.observe(d); });
})();
