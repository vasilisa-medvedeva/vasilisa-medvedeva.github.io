/* Scroll buddy — the guide fella comes down from the splash and runs the
   page as you scroll, the way the paper plane flies other portfolios.

   The route is built from the page's real landmarks — the 5+ circle in the
   hero, a slalom through the projects grid, the empty column under each
   section title, and the footer CTA — so it survives any copy or layout
   change that keeps those landmarks. A dotted trail is revealed exactly as
   far as he has run (dash-offset on a mask over the dotted path, same trick
   as a dash-reveal, but the dots stay dots).

   He RUNS while the scroll is moving his target distance, STANDS when it
   rests, and WAVES when he reaches the footer — guide-buddy.css's flipbook
   classes (.gb--running / .gb--left / .gb--waving) do all the acting; this
   file only steers.

   Sprite: the splash's inline drawing, stashed in window.__gbSpriteHTML by
   the inline script under the splash markup (the splash node itself can be
   gone before this file loads). guide-buddy.css hides .gb on touch, small
   screens and reduced motion — this script bails out in the same conditions:
   the runner is a desktop flourish, never a mobility tax. */
(function () {
  'use strict';
  if (matchMedia('(max-width: 900px)').matches ||
      matchMedia('(hover: none)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  var spriteHTML = window.__gbSpriteHTML;
  if (!spriteHTML) { return; }

  var route = document.createElement('div');
  route.className = 'buddy-route';
  route.setAttribute('aria-hidden', 'true');
  route.innerHTML =
    '<svg class="buddy-route__trail" fill="none">' +
      '<defs><mask id="buddyTrailMask">' +
        '<path id="buddyTrailMaskPath" fill="none" stroke="#fff" stroke-width="9"/>' +
      '</mask></defs>' +
      '<path id="buddyTrailDots" fill="none" mask="url(#buddyTrailMask)"/>' +
      '<path id="buddyMotionPath"/>' +
    '</svg>' +
    '<div class="gb"><div class="gb__sprite">' + spriteHTML + '</div></div>';
  document.body.appendChild(route);

  var svg = route.querySelector('.buddy-route__trail');
  var motion = route.querySelector('#buddyMotionPath');
  var dots = route.querySelector('#buddyTrailDots');
  var maskPath = route.querySelector('#buddyTrailMaskPath');
  var buddy = route.querySelector('.gb');

  /* Catmull-Rom through the anchor points → one smooth bezier chain */
  function smoothPath (pts) {
    var d = 'M ' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C ' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)
         + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)
         + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }

  // element point in document coords: fractions of its box + a px nudge
  function at (el, fx, fy, dx, dy) {
    var r = el.getBoundingClientRect();
    return [r.left + r.width * fx + (dx || 0) + window.scrollX,
            r.top + r.height * fy + (dy || 0) + window.scrollY];
  }

  function anchors () {
    var pts = [];
    var circle = document.querySelector('.hero__circle');
    var grid = document.querySelector('.projects-grid');
    var footerBig = document.querySelector('.footer__big');
    if (circle) { pts.push(at(circle, 0.5, 1, 44, 30)); }   // at the 5+'s feet
    if (grid) {
      // slalom across the grid's centre gutter — the cards are its slopes
      var g = grid.getBoundingClientRect();
      var gx = g.left + window.scrollX, gy = g.top + window.scrollY;
      [[0.66, 0.08], [0.42, 0.30], [0.68, 0.52], [0.40, 0.72], [0.60, 0.92]]
        .forEach(function (s) { pts.push([gx + g.width * s[0], gy + g.height * s[1]]); });
    }
    // down the quiet column under each section title
    document.querySelectorAll('.info-section .section-title').forEach(function (t, i) {
      pts.push(at(t, i % 2 ? 0.6 : 0.25, 1, 0, 90));
    });
    if (footerBig) { pts.push(at(footerBig, 1, 0.45, 46, 0)); }   // beside "Let's talk →"
    return pts;
  }

  var pathLen = 0, pathTopY = 0, pathBotY = 0;
  var lastMd = null, idleTimer = null;

  function update (force) {
    if (!pathLen) { return; }
    // read-line just past mid-screen: he finishes each stretch as you read it
    var readY = window.scrollY + window.innerHeight * 0.55;
    var p = Math.max(0, Math.min(1, (readY - pathTopY) / (pathBotY - pathTopY)));
    var md = p * pathLen;
    if (md === lastMd && !force) { return; }
    var moved = lastMd !== null && Math.abs(md - lastMd) > 0.5;
    lastMd = md;

    var pt = motion.getPointAtLength(md);
    var pA = motion.getPointAtLength(Math.max(0, md - 2));
    var pB = motion.getPointAtLength(Math.min(pathLen, md + 2));
    buddy.classList.toggle('gb--left', pB.x - pA.x < -0.5);
    // feet on the path: sprite is 72×82, feet ≈ (36, 78) in its own box
    buddy.style.transform = 'translate(' + (pt.x - 36).toFixed(1) + 'px,' + (pt.y - 78).toFixed(1) + 'px)';
    maskPath.style.strokeDashoffset = pathLen - md;

    var atEnd = p > 0.985;
    buddy.classList.toggle('gb--waving', atEnd);   // made it — wave at "Let's talk"
    if (moved && !atEnd) {
      buddy.classList.add('gb--running');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { buddy.classList.remove('gb--running'); }, 170);
    }
  }

  function build () {
    var pts = anchors();
    if (pts.length < 2) { return; }
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.scrollHeight;
    route.style.height = h + 'px';
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var d = smoothPath(pts);
    motion.setAttribute('d', d);
    dots.setAttribute('d', d);
    maskPath.setAttribute('d', d);
    pathLen = motion.getTotalLength();
    maskPath.style.strokeDasharray = pathLen;
    pathTopY = pts[0][1];
    // p must be able to reach 1: the read-line maxes out at
    // docHeight − 0.45·vh, and the footer anchor can sit below that
    pathBotY = Math.min(pts[pts.length - 1][1],
                        document.documentElement.scrollHeight - window.innerHeight * 0.45 - 4);
    lastMd = null;
    update(true);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(false); });
  }, { passive: true });

  var rebuildTimer = null;
  function rebuild () { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(build, 150); }
  window.addEventListener('resize', rebuild);
  document.addEventListener('langchange', rebuild);   // RU copy reflows the sections
  window.addEventListener('load', build);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(rebuild); }
  build();
})();
