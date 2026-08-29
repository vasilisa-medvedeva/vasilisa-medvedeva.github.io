/* Scroll buddy — the guide fella greets at the hero and runs the page as
   you scroll, the way the paper plane flies other portfolios.

   The route is built from the page's real landmarks, and it RESPECTS THE
   TYPOGRAPHY: it starts below-left of the headline (never over the "5+"),
   slips PAST each section title beside its measured text box instead of
   through it, and he only ever STANDS at curated safe stops — if the
   scroll rests mid-route, he keeps running to the nearest stop on his own,
   so he never parks on top of text. He leaves a short tail of footstep
   dots that melts when he settles.

   Three behaviours from the sprite's existing drawings: he RUNS between
   stops, WAVES at the route's two ends (hello at the hero, goodbye on the
   word "Let's"), and at each section stop he POINTS at that section's
   content (pose C + raised pupils, aimed via --gb-aim).

   Sprite: cloned from the hidden #gb-sprite-src master copy in the page
   markup. guide-buddy.css hides .gb on touch, small screens and reduced
   motion — this script bails out in the same conditions: the runner is a
   desktop flourish, never a mobility tax. */
(function () {
  'use strict';
  if (matchMedia('(max-width: 900px)').matches ||
      matchMedia('(hover: none)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  var spriteSrc = document.getElementById('gb-sprite-src');
  if (!spriteSrc) { return; }
  var spriteHTML = spriteSrc.innerHTML;

  var route = document.createElement('div');
  route.className = 'buddy-route';
  route.setAttribute('aria-hidden', 'true');
  route.innerHTML =
    '<svg class="buddy-route__trail" fill="none">' +
      '<path id="buddyMotionPath"/>' +
    '</svg>' +
    '<div class="gb"><div class="gb__sprite">' + spriteHTML + '</div></div>';
  document.body.appendChild(route);

  var svg = route.querySelector('.buddy-route__trail');
  var motion = route.querySelector('#buddyMotionPath');
  var buddy = route.querySelector('.gb');

  /* Footstep dots: at most MAX_DOTS behind him, one every DOT_EVERY px of
     path, graded from faint (old) to solid (fresh); the whole tail melts
     once he settles at a stop. */
  var MAX_DOTS = 6, DOT_EVERY = 30;
  var dotQueue = [], lastDotMd = null;
  function dropDot (pt) {
    var dot = document.createElement('i');
    dot.className = 'buddy-dot';
    dot.style.transform = 'translate(' + (pt.x - 2.5).toFixed(1) + 'px,' + (pt.y - 2.5).toFixed(1) + 'px)';
    route.appendChild(dot);
    dotQueue.push(dot);
    if (dotQueue.length > MAX_DOTS) {
      var old = dotQueue.shift();
      old.style.opacity = '0';
      setTimeout(function () { old.remove(); }, 400);
    }
    for (var i = 0; i < dotQueue.length; i++) {
      dotQueue[i].style.opacity = (0.15 + 0.65 * (i + 1) / dotQueue.length).toFixed(2);
    }
  }
  function clearDots () {
    dotQueue.forEach(function (d) { d.remove(); });
    dotQueue = [];
    lastDotMd = null;
  }
  function dissolveDots () {
    var fading = dotQueue;
    dotQueue = [];
    lastDotMd = null;
    fading.forEach(function (d, i) {
      setTimeout(function () {
        d.style.opacity = '0';
        setTimeout(function () { d.remove(); }, 400);
      }, i * 110);
    });
  }

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

  /* Anchors + safe stops. A stop is the only place he is allowed to settle:
     kind 'wave' (route ends), 'point' (aims at a section's content) or
     'stand'. Everything between stops is transit — crossed at a run. */
  function anchors () {
    var pts = [], stops = [];
    function add (pt, stop) {
      pts.push(pt);
      if (stop) { stop.i = pts.length - 1; stops.push(stop); }
    }
    var title = document.querySelector('.hero__title');
    var aside = document.querySelector('.hero__aside');
    var grid = document.querySelector('.projects-grid');
    var footerBig = document.querySelector('.footer__big');
    // below-left of the headline — reads clean, he never covers the "5+"
    if (title) { add(at(title, 0.06, 1, 30, 100), { kind: 'wave' }); }
    if (aside) { pts.push(at(aside, 0.2, 1, 0, 46)); }   // duck under the intro column
    if (grid) {
      // slalom across the cards' central gutter (transit only — no stop
      // inside the grid, so he can never settle on a card's text)
      var g = grid.getBoundingClientRect();
      var gx = g.left + window.scrollX, gy = g.top + window.scrollY;
      [[0.66, 0.08], [0.42, 0.30], [0.62, 0.52], [0.40, 0.72], [0.60, 0.92]]
        .forEach(function (s) { pts.push([gx + g.width * s[0], gy + g.height * s[1]]); });
    }
    document.querySelectorAll('.info-section').forEach(function (sec) {
      var t = sec.querySelector('.section-title');
      if (!t) { return; }
      var body = sec.querySelector('.info-section__body');
      // the element spans its whole column — measure the actual TEXT box,
      // and slip past on its right so the route never crosses the glyphs
      var range = document.createRange();
      range.selectNodeContents(t);
      var tr = range.getBoundingClientRect();
      var crossX = tr.right + window.scrollX + 52;
      add([crossX, tr.top + window.scrollY - 26]);
      add([crossX, tr.bottom + window.scrollY + 14]);
      // …then settle in the empty column below the title, pointing at the content
      add(at(t, 0.28, 1, 0, 108), { kind: body ? 'point' : 'stand', aim: body ? at(body, 0.1, 0.1) : null });
    });
    if (footerBig) { add(at(footerBig, 0.19, 0, 0, -4), { kind: 'wave' }); }   // feet on "Let's"
    return { pts: pts, stops: stops };
  }

  var pathLen = 0, pathTopY = 0, pathBotY = 0;
  var stops = [];          // [{md, kind, aim}]
  var lastMd = null, idleTimer = null;
  var glideTimer = null;

  function clearPose () {
    buddy.classList.remove('gb--waving');
    buddy.classList.remove('gb--pointing');
  }
  function applyPose (stop) {
    clearPose();
    if (stop.kind === 'wave') {
      buddy.classList.add('gb--waving');
    } else if (stop.kind === 'point' && stop.aim) {
      // aim the pose-C arm from his shoulder toward the section content
      var pt = motion.getPointAtLength(stop.md);
      var deg = Math.atan2(stop.aim[1] - (pt.y - 45), stop.aim[0] - pt.x) * 180 / Math.PI;
      buddy.classList.remove('gb--left');   // the content is always to his right
      buddy.style.setProperty('--gb-aim', Math.max(-80, Math.min(35, deg)).toFixed(1) + 'deg');
      buddy.classList.add('gb--pointing');
    }
  }

  // place him (and his footsteps) at a path distance — shared by scroll
  // updates and the settle-glide
  function applyMd (md) {
    var pt = motion.getPointAtLength(md);
    var pA = motion.getPointAtLength(Math.max(0, md - 2));
    var pB = motion.getPointAtLength(Math.min(pathLen, md + 2));
    buddy.classList.toggle('gb--left', pB.x - pA.x < -0.5);
    // feet on the path: sprite is 72×82, feet ≈ (36, 78) in its own box
    buddy.style.transform = 'translate(' + (pt.x - 36).toFixed(1) + 'px,' + (pt.y - 78).toFixed(1) + 'px)';
    if (lastDotMd === null) { lastDotMd = md; }
    var steps = 0;
    while (Math.abs(md - lastDotMd) >= DOT_EVERY && steps < MAX_DOTS) {
      lastDotMd += (md > lastDotMd ? DOT_EVERY : -DOT_EVERY);
      dropDot(motion.getPointAtLength(lastDotMd));
      steps++;
    }
    if (steps === MAX_DOTS) { lastDotMd = md; }
    lastMd = md;
    look();
  }

  /* He never parks mid-route: when the scroll rests, he runs on to the
     nearest stop by himself (timer-stepped, so it keeps working when the
     tab is backgrounded), settles, poses, and lets the tail melt. */
  var GLIDE_STEP = 9;      // px per 16ms ≈ 540 px/s
  var GLIDE_MAX = 900;     // farther than this → he just stands where he is
  function cancelGlide () {
    if (glideTimer) { clearTimeout(glideTimer); glideTimer = null; }
  }
  function settle () {
    buddy.classList.remove('gb--running');
    var best = null;
    stops.forEach(function (st) {
      if (best === null || Math.abs(st.md - lastMd) < Math.abs(best.md - lastMd)) { best = st; }
    });
    if (!best || Math.abs(best.md - lastMd) > GLIDE_MAX) { dissolveDots(); return; }
    if (Math.abs(best.md - lastMd) < 4) {
      applyMd(best.md);
      applyPose(best);
      dissolveDots();
      return;
    }
    buddy.classList.add('gb--running');
    (function step () {
      var d = best.md - lastMd;
      if (Math.abs(d) <= GLIDE_STEP) {
        applyMd(best.md);
        buddy.classList.remove('gb--running');
        applyPose(best);
        dissolveDots();
        glideTimer = null;
        return;
      }
      applyMd(lastMd + (d > 0 ? GLIDE_STEP : -GLIDE_STEP));
      glideTimer = setTimeout(step, 16);
    })();
  }

  function update (force) {
    if (!pathLen) { return; }
    // read-line just past mid-screen: he finishes each stretch as you read it
    var readY = window.scrollY + window.innerHeight * 0.55;
    var p = Math.max(0, Math.min(1, (readY - pathTopY) / (pathBotY - pathTopY)));
    var md = p * pathLen;
    if (md === lastMd && !force) { return; }
    var moved = lastMd !== null && Math.abs(md - lastMd) > 0.5;
    cancelGlide();
    applyMd(md);
    if (moved) {
      clearPose();
      buddy.classList.add('gb--running');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(settle, 170);
    } else if (force) {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(settle, 170);
    }
  }

  /* His googly pupils follow the visitor's cursor while he stands — the
     offset is a pair of CSS vars; the sprite flip mirrors x so a flipped
     buddy still looks the right way. Running and pointing are excluded in
     the CSS (googly spin / raised pupils take over there). */
  var cursorX = null, cursorY = null;
  function look () {
    if (cursorX === null || lastMd === null || !pathLen) { return; }
    var pt = motion.getPointAtLength(lastMd);
    var dx = cursorX - (pt.x - window.scrollX);
    var dy = cursorY - (pt.y - window.scrollY - 58);   // ≈ his eye line
    var m = Math.hypot(dx, dy) || 1;
    var k = Math.min(3.2, m / 60);
    var lx = dx / m * k;
    if (buddy.classList.contains('gb--left')) { lx = -lx; }
    buddy.style.setProperty('--look-x', lx.toFixed(2) + 'px');
    buddy.style.setProperty('--look-y', (dy / m * k).toFixed(2) + 'px');
  }
  window.addEventListener('mousemove', function (e) {
    cursorX = e.clientX; cursorY = e.clientY;
    look();
  }, { passive: true });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(false); });
  }, { passive: true });

  function build () {
    var a = anchors();
    if (a.pts.length < 2) { return; }
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.scrollHeight;
    route.style.height = h + 'px';
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    motion.setAttribute('d', smoothPath(a.pts));
    pathLen = motion.getTotalLength();
    // md of each stop: nearest point on the path to its anchor (dense sample)
    var samples = [];
    for (var m = 0; m <= pathLen; m += 10) { samples.push(motion.getPointAtLength(m)); }
    stops = a.stops.map(function (st) {
      var target = a.pts[st.i], bestMd = 0, bestD = Infinity;
      samples.forEach(function (sp, si) {
        var d = (sp.x - target[0]) * (sp.x - target[0]) + (sp.y - target[1]) * (sp.y - target[1]);
        if (d < bestD) { bestD = d; bestMd = si * 10; }
      });
      return { md: Math.min(bestMd, pathLen), kind: st.kind, aim: st.aim };
    });
    cancelGlide();
    clearDots();   // geometry moved — old footprints point at nothing
    pathTopY = a.pts[0][1];
    // p must be able to reach 1: the read-line maxes out at
    // docHeight − 0.45·vh, and the footer anchor can sit below that
    pathBotY = Math.min(a.pts[a.pts.length - 1][1],
                        document.documentElement.scrollHeight - window.innerHeight * 0.45 - 4);
    lastMd = null;
    update(true);
  }

  var rebuildTimer = null;
  function rebuild () { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(build, 150); }
  window.addEventListener('resize', rebuild);
  document.addEventListener('langchange', rebuild);   // RU copy reflows the sections
  window.addEventListener('load', build);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(rebuild); }
  build();
})();
