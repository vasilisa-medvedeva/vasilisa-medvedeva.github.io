/* Scroll buddy — the guide fella greets at the hero and runs the
   page as you scroll, the way the paper plane flies other portfolios.

   The route is built from the page's real landmarks — the 5+ circle in the
   hero, a slalom through the projects grid, the empty column under each
   section title, and the footer CTA — so it survives any copy or layout
   change that keeps those landmarks. He leaves a short tail of footstep
   dots behind him — at most six, graded to transparent with age, the oldest
   dissolving as new ones land.

   He RUNS while the scroll is moving his target distance, STANDS when it
   rests, and WAVES when he reaches the footer — guide-buddy.css's flipbook
   classes (.gb--running / .gb--left / .gb--waving) do all the acting; this
   file only steers.

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
  // the master copy sits in a hidden (display:none) holder, and a gradient
  // there is not a usable paint server in Chrome — url(#…) would resolve to
  // it and paint nothing. The live clone gets its own gradient id.
  var spriteHTML = spriteSrc.innerHTML.split('gb-blob-grad').join('gb-blob-grad-live');

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

  /* Footstep dots: he leaves at most MAX_DOTS behind him, one every
     DOT_EVERY px of path; each is a real element, graded from faint (old)
     to solid (fresh), and the oldest fades out and leaves as new ones
     land — a dissolving tail instead of a permanent drawn route. */
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
  /* When he stops, the whole tail melts — oldest dot first, one beat apart.
     A resumed run isn't interrupted by this: the melting dots are already
     out of the queue, and fresh footsteps start a new tail behind him. */
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

  function anchors () {
    var pts = [];
    var grid = document.querySelector('.projects-grid');
    var footerBig = document.querySelector('.footer__big');
    var stats = document.querySelector('.hero__stats');
    var titleEl = document.querySelector('.hero__title');
    if (stats) {
      // he stands beside his own numbers, their compere
      var sr = stats.getBoundingClientRect();
      pts.push([sr.right + window.scrollX + 62, sr.bottom + window.scrollY - 4]);
    } else if (titleEl) {
      var tr = titleEl.getBoundingClientRect();
      pts.push([tr.left + window.scrollX + 28, tr.bottom + window.scrollY + 88]);
    }
    if (grid) {
      // slalom across the grid's centre gutter — the cards are its slopes
      var g = grid.getBoundingClientRect();
      var gx = g.left + window.scrollX, gy = g.top + window.scrollY;
      // the exit point sits left of centre so he emerges from under the
      // cards on the title-column side — clear of the sections' body text
      [[0.66, 0.08], [0.42, 0.30], [0.68, 0.52], [0.40, 0.72], [0.38, 0.92]]
        .forEach(function (s) { pts.push([gx + g.width * s[0], gy + g.height * s[1]]); });
    }
    // down the quiet column under each section title — except the About
    // section, where he detours to stand BESIDE the two-truths quiz
    var quizIdx = null, quizAim = null, quizZone = null;
    document.querySelectorAll('.info-section .section-title').forEach(function (t, i) {
      var sec = t.closest('.info-section');
      var quiz = sec && sec.querySelector('#guess');
      if (quiz) {
        var q = quiz.getBoundingClientRect();
        pts.push([q.left + window.scrollX - 55, q.top + window.scrollY + 74]);
        quizIdx = pts.length - 1;
        quizAim = [q.left + window.scrollX + 70, q.top + window.scrollY + 60];
        quizZone = [q.top + window.scrollY - 120, q.bottom + window.scrollY + 60];
      } else {
        pts.push(at(t, i % 2 ? 0.6 : 0.25, 1, 0, 90));
      }
    });
    if (footerBig) { pts.push(at(footerBig, 0.19, 0, 0, -4)); }   // feet on top of the word "Let's"
    return { pts: pts, quizAim: quizAim, quizZone: quizZone };
  }

  var pathLen = 0, pathTopY = 0, pathBotY = 0;
  var lastMd = null, idleTimer = null;
  var gridEntryMd = null, gridExitMd = null;

  // place him (and his footsteps) at a path distance — shared by scroll
  // updates and the grid-escape glide
  function placeAt (md) {
    lastMd = md;
    var pt = motion.getPointAtLength(md);
    var pA = motion.getPointAtLength(Math.max(0, md - 2));
    var pB = motion.getPointAtLength(Math.min(pathLen, md + 2));
    buddy.classList.toggle('gb--left', pB.x - pA.x < -0.5);
    // feet on the path: sprite is 72×82, feet ≈ (36, 78) in its own box
    buddy.style.transform = 'translate(' + (pt.x - 36).toFixed(1) + 'px,' + (pt.y - 78).toFixed(1) + 'px)';
    // footstep dots — stepped, so a fast scroll seeds the span it jumped over
    if (lastDotMd === null) { lastDotMd = md; }
    var steps = 0;
    while (Math.abs(md - lastDotMd) >= DOT_EVERY && steps < MAX_DOTS) {
      lastDotMd += (md > lastDotMd ? DOT_EVERY : -DOT_EVERY);
      dropDot(motion.getPointAtLength(lastDotMd));
      steps++;
    }
    if (steps === MAX_DOTS) { lastDotMd = md; }   // huge jump — snap under his feet
    look();
  }

  /* The project cards sit ABOVE his layer — resting inside the grid parks
     him invisibly behind them (an arrow-jump to #projects does exactly
     that). So when the scroll settles mid-grid, he runs himself out to the
     nearest grid edge and back into the light. */
  var gliding = false, glideTimer = null;
  function cancelGlide () {
    if (!gliding) { return; }
    gliding = false;
    clearTimeout(glideTimer);
    buddy.classList.remove('gb--running');
  }
  function maybeEscapeGrid () {
    if (gridEntryMd === null || gridExitMd === null) { return; }
    if (lastMd <= gridEntryMd || lastMd >= gridExitMd) { return; }
    var target = (lastMd - gridEntryMd < gridExitMd - lastMd) ? gridEntryMd : gridExitMd;
    gliding = true;
    buddy.classList.add('gb--running');
    (function step () {
      if (!gliding) { return; }
      var d = target - lastMd;
      if (Math.abs(d) <= 7) {
        placeAt(target);
        gliding = false;
        buddy.classList.remove('gb--running');
        dissolveDots();
        return;
      }
      placeAt(lastMd + (d > 0 ? 7 : -7));
      glideTimer = setTimeout(step, 16);
    })();
  }

  /* Entrance: on the first load he RUNS IN from beyond the left edge to his
     mark beside the numbers, dropping footsteps, then stands and waves.
     Timer-stepped; any real scroll cancels it and hands over to the route. */
  var entranceDone = false, entering = false, entranceTimer = null;
  function cancelEntrance () {
    if (!entering) { return; }
    entering = false;
    clearTimeout(entranceTimer);
    buddy.classList.remove('gb--running');
  }
  function runEntrance () {
    entranceDone = true;
    if (window.scrollY > 60) { update(true); return; }
    entering = true;
    var target = motion.getPointAtLength(0);
    var x = -90, y = target.y, lastDotX = x;
    buddy.classList.remove('gb--left');
    buddy.classList.add('gb--running');
    (function step () {
      if (!entering) { return; }
      x += 4.5;   // an unhurried entrance — half his route-running speed
      buddy.style.transform = 'translate(' + (x - 36).toFixed(1) + 'px,' + (y - 78).toFixed(1) + 'px)';
      if (x - lastDotX >= DOT_EVERY) { lastDotX = x; dropDot({ x: x, y: y }); }
      if (x >= target.x) {
        entering = false;
        buddy.classList.remove('gb--running');
        lastMd = null;
        update(true);        // settle on the route proper (and wave hello)
        dissolveDots();      // the entrance footprints melt behind him
        return;
      }
      entranceTimer = setTimeout(step, 16);
    })();
  }
  var quizZone = null, quizAim = null;

  function update (force) {
    if (!pathLen) { return; }
    if (entering && !force) { cancelEntrance(); }
    if (entering) { return; }
    // read-line just past mid-screen: he finishes each stretch as you read it
    var readY = window.scrollY + window.innerHeight * 0.55;
    var p = Math.max(0, Math.min(1, (readY - pathTopY) / (pathBotY - pathTopY)));
    var md = p * pathLen;
    if (md === lastMd && !force) { return; }
    var moved = lastMd !== null && Math.abs(md - lastMd) > 0.5;
    cancelGlide();
    placeAt(md);

    // Standing poses: he WAVES at both ends of the route (hello under the
    // headline, goodbye on "Let's talk"), and beside the two-truths quiz he
    // POINTS at it and swaps to his laughing face. Never mid-run — the
    // acting waits for the stand.
    function atEdge (pv) { return pv > 0.985 || pv < 0.04; }
    function standPose (pv) {
      buddy.classList.toggle('gb--waving', atEdge(pv));
      // "beside the quiz" = the visitor's read-line is over the quiz zone;
      // the arm aims from wherever he actually stands
      var readNow = window.scrollY + window.innerHeight * 0.55;
      var near = !!(quizZone && quizAim && readNow > quizZone[0] && readNow < quizZone[1]);
      if (near) {
        var cpt = motion.getPointAtLength(pv * pathLen);
        var deg = Math.atan2(quizAim[1] - (cpt.y - 45), quizAim[0] - cpt.x) * 180 / Math.PI;
        buddy.classList.remove('gb--left');
        buddy.style.setProperty('--gb-aim', Math.max(-75, Math.min(35, deg)).toFixed(1) + 'deg');
      }
      buddy.classList.toggle('gb--pointing', near);
      buddy.classList.toggle('gb--laughing', near);
    }
    if (moved) {
      buddy.classList.remove('gb--waving');
      buddy.classList.remove('gb--pointing');
      buddy.classList.remove('gb--laughing');
      buddy.classList.add('gb--running');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        buddy.classList.remove('gb--running');
        standPose(lastMd / pathLen);
        dissolveDots();   // he stopped — the tail melts away behind him
        maybeEscapeGrid();
      }, 170);
    } else if (!buddy.classList.contains('gb--running')) {
      standPose(p);
    }
    look();   // he moved — refresh where his eyes point from the new spot
  }

  function build () {
    var a = anchors();
    var pts = a.pts;
    if (pts.length < 2) { return; }
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.scrollHeight;
    route.style.height = h + 'px';
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    motion.setAttribute('d', smoothPath(pts));
    pathLen = motion.getTotalLength();
    quizAim = a.quizAim; quizZone = a.quizZone;
    // md marks for where the route dives under the cards and re-emerges
    gridEntryMd = null; gridExitMd = null;
    var gEl = document.querySelector('.projects-grid');
    if (gEl) {
      var gr = gEl.getBoundingClientRect();
      var gTop = gr.top + window.scrollY - 30, gBot = gr.bottom + window.scrollY + 30;
      for (var m = 0; m <= pathLen; m += 12) {
        var sp = motion.getPointAtLength(m);
        if (sp.y < gTop) { gridEntryMd = m; }
        if (gridExitMd === null && sp.y > gBot) { gridExitMd = m; }
      }
    }
    cancelGlide();
    clearDots();   // geometry moved — old footprints point at nothing
    // p is anchored to the read-line's position AT scrollY 0 — so he holds
    // his mark on an unscrolled page and starts running with the very first
    // pixel of scroll, no dead zone while the read-line catches up to him
    pathTopY = window.innerHeight * 0.55 + 2;
    // p must be able to reach 1: the read-line maxes out at
    // docHeight − 0.45·vh, and the footer anchor can sit below that
    pathBotY = Math.min(pts[pts.length - 1][1],
                        document.documentElement.scrollHeight - window.innerHeight * 0.45 - 4);
    lastMd = null;
    if (entering) { return; }            // mid-entrance rebuild: geometry only
    if (!entranceDone) { runEntrance(); }
    else { update(true); }
  }

  /* His googly pupils follow the visitor's cursor while he stands — the
     offset is a pair of CSS vars; the sprite flip mirrors x so a flipped
     buddy still looks the right way. Running is excluded in the CSS, where
     the googly spin takes over. */
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

  var rebuildTimer = null;
  function rebuild () { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(build, 150); }
  window.addEventListener('resize', rebuild);
  document.addEventListener('langchange', rebuild);   // RU copy reflows the sections
  window.addEventListener('load', build);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(rebuild); }
  build();
})();
