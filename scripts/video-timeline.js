/* Doodle video timeline: draws a hand-drawn progress line into every
   [data-video-timeline] mount. Two modes:
   — video mode (default): binds to the nearest <video> in the same <figure>
     and mirrors its playback;
   — clock mode (data-duration="12"): a free-running loop for the scripted CSS
     demos. It starts in sync with the demo: when the nearest [data-anim]
     ancestor goes .anim-live (scripts/demo-anim.js), or on a bubbling
     'demo-cycle' event fired by JS-driven demos at each cycle start;
   — controlled mode (data-duration + data-controlled): for the Pyroblast flow
     demos, which run once on the Demo button. Hidden until a document-level
     'demo-start' event, holds near the end if the estimate runs short, snaps
     full and fades out on 'demo-end', hides at once on 'demo-stop'.
   The fill path re-traces the wobbly track via pathLength=1 + stroke-dashoffset,
   so the "ink" follows the same crooked line. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  /* one wobbly line, drawn once and shared by track and fill */
  var TRACK_D = 'M13 10.6C58 8.9 104 12.1 150 10.2 196 8.5 242 11.8 287 10.4';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function fmt(seconds) {
    var s = Math.max(0, Math.floor(seconds));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  document.querySelectorAll('[data-video-timeline]').forEach(function (mount) {
    var clockDur = parseFloat(mount.getAttribute('data-duration') || '');
    var scope = mount.closest('figure, .pay-demo, .pdd-demo, .scan-demo') || mount.parentElement;
    var video = !clockDur && scope ? scope.querySelector('video') : null;
    if (!clockDur && !video) return;
    /* the scripted demos freeze under reduced motion — a ticking bar would lie */
    if (clockDur && reduced) { mount.style.display = 'none'; return; }

    var svg = el('svg', { viewBox: '0 0 300 20', class: 'video-timeline__svg' });
    svg.appendChild(el('path', { class: 'video-timeline__track', d: TRACK_D }));
    var fill = el('path', { class: 'video-timeline__fill', d: TRACK_D, pathLength: '1' });
    svg.appendChild(fill);

    var time = document.createElement('span');
    time.className = 'video-timeline__time';

    mount.appendChild(svg);
    mount.appendChild(time);

    function paint(progress, elapsed) {
      fill.style.strokeDashoffset = String(1 - Math.min(1, progress));
      time.textContent = fmt(elapsed);
    }

    if (clockDur) {
      /* ── clock mode ── */
      var controlled = mount.hasAttribute('data-controlled');
      var startAt = null;
      var raf = 0;
      paint(0, 0);
      function tick(now) {
        var t = (now - startAt) / 1000;
        /* a one-shot demo holds just short of done until 'demo-end' confirms */
        t = controlled ? Math.min(t, clockDur - 0.5) : t % clockDur;
        paint(t / clockDur, t);
        raf = requestAnimationFrame(tick);
      }
      function restart() {
        startAt = performance.now();
        paint(0, 0);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
      if (controlled) {
        var hideTimer = 0;
        document.addEventListener('demo-start', function () {
          clearTimeout(hideTimer);
          mount.classList.add('is-live');
          restart();
        });
        document.addEventListener('demo-end', function () {
          cancelAnimationFrame(raf);
          paint(1, clockDur);
          hideTimer = setTimeout(function () { mount.classList.remove('is-live'); }, 900);
        });
        document.addEventListener('demo-stop', function () {
          cancelAnimationFrame(raf);
          mount.classList.remove('is-live');
        });
        return;
      }
      var animRoot = mount.closest('[data-anim]');
      if (animRoot) {
        if (animRoot.classList.contains('anim-live')) restart();
        else {
          new MutationObserver(function (_, obs) {
            if (animRoot.classList.contains('anim-live')) { restart(); obs.disconnect(); }
          }).observe(animRoot, { attributes: true, attributeFilter: ['class'] });
        }
      }
      if (scope) scope.addEventListener('demo-cycle', restart);
      return;
    }

    /* ── video mode ── */
    function render() {
      var d = video.duration;
      if (!isFinite(d) || !d) return;
      paint(video.currentTime / d, video.currentTime);
    }

    paint(0, 0);
    var vraf = 0;
    function loop() { render(); vraf = requestAnimationFrame(loop); }
    video.addEventListener('play', function () { cancelAnimationFrame(vraf); loop(); });
    video.addEventListener('pause', function () { cancelAnimationFrame(vraf); render(); });
    video.addEventListener('loadedmetadata', render);
    video.addEventListener('timeupdate', render);
    render();
    if (!video.paused) loop();
  });
})();
