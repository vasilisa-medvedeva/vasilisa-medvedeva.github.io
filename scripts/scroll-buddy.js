/* Scroll buddy — the guide fella comes down from the splash and runs the
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

  /* ── Micro-sounds — tiny synthesized SFX, no audio files, no licences.
     Off by default behind the ♪ toggle (choice persisted); every gain is
     whisper-level. The AudioContext is only created on the first enable
     (a click — so autoplay policy is satisfied), and resumed on the first
     gesture of a later visit if the toggle was left on. ── */
  var Sound = (function () {
    var KEY = 'plxSound';
    var enabled = false;
    try { enabled = localStorage.getItem(KEY) === '1'; } catch (e) {}
    var ctx = null;
    function ac () {
      if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      if (ctx.state === 'suspended') { ctx.resume(); }
      return ctx;
    }
    function tone (freq, dur, type, gain, delay, slideTo) {
      if (!enabled) { return; }
      try {
        var c = ac(), t = c.currentTime + (delay || 0);
        var o = c.createOscillator(), g = c.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t);
        if (slideTo) { o.frequency.exponentialRampToValueAtTime(slideTo, t + dur); }
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(gain, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + dur + 0.02);
      } catch (e) {}
    }
    return {
      isOn: function () { return enabled; },
      set: function (on) {
        enabled = on;
        try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
        if (on) { ac(); tone(440, 0.08, 'triangle', 0.05); tone(660, 0.1, 'triangle', 0.05, 0.08); }
      },
      wave: function () {   // a cartoonish two-syllable "hel-LO!" (English
        // prosody: short rising pickup, then the higher, longer syllable
        // easing down — not the flat «при-вет» pair)
        tone(470, 0.09, 'triangle', 0.05, 0, 540);
        tone(760, 0.16, 'triangle', 0.05, 0.1, 620);
      },
      plink: function (i) { // melting footstep dot, lower with each one
        tone(Math.max(240, 640 - i * 60), 0.12, 'sine', 0.03);
      }
    };
  })();
  // a toggle left ON last visit needs one real gesture before audio may resume
  ['pointerdown', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function once () {
      window.removeEventListener(ev, once);
      if (Sound.isOn()) { Sound.set(true); }
    }, { once: true });
  });

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
        if (fading.length > 1) { Sound.plink(i); }
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

  /* ♪ toggle — lives only while the runner does (same media conditions),
     so touch and small screens never see a dead sound button */
  var soundBtn = document.createElement('button');
  soundBtn.type = 'button';
  soundBtn.className = 'buddy-sound' + (Sound.isOn() ? ' is-on' : '');
  soundBtn.textContent = '♪';
  function labelSound () {
    var ru = (typeof window.lang === 'function' && window.lang() === 'ru');
    var label = Sound.isOn() ? (ru ? 'Выключить звук' : 'Sound off')
                             : (ru ? 'Включить звук' : 'Sound on');
    soundBtn.setAttribute('aria-label', label);
    soundBtn.title = label;
    soundBtn.setAttribute('aria-pressed', Sound.isOn() ? 'true' : 'false');
  }
  labelSound();
  document.addEventListener('langchange', labelSound);
  soundBtn.addEventListener('click', function () {
    Sound.set(!Sound.isOn());
    soundBtn.classList.toggle('is-on', Sound.isOn());
    labelSound();
  });
  document.body.appendChild(soundBtn);

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
    // footstep dots — stepped, so a fast scroll seeds the span it jumped over
    if (lastDotMd === null) { lastDotMd = md; }
    var steps = 0;
    while (Math.abs(md - lastDotMd) >= DOT_EVERY && steps < MAX_DOTS) {
      lastDotMd += (md > lastDotMd ? DOT_EVERY : -DOT_EVERY);
      dropDot(motion.getPointAtLength(lastDotMd));
      steps++;
    }
    if (steps === MAX_DOTS) { lastDotMd = md; }   // huge jump — snap under his feet

    // he WAVES at both ends of the route — greeting at the 5+, goodbye at
    // "Let's talk" — but never mid-run: the wave waits for the stand.
    function atEdge (pv) { return pv > 0.985 || pv < 0.04; }
    function setWaving (on) {
      if (on && !buddy.classList.contains('gb--waving')) { Sound.wave(); }
      buddy.classList.toggle('gb--waving', on);
    }
    if (moved) {
      buddy.classList.remove('gb--waving');
      buddy.classList.add('gb--running');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        buddy.classList.remove('gb--running');
        setWaving(atEdge(lastMd / pathLen));
        dissolveDots();   // he stopped — the tail melts away behind him
      }, 170);
    } else if (!buddy.classList.contains('gb--running')) {
      setWaving(atEdge(p));
    }
    look();   // he moved — refresh where his eyes point from the new spot
  }

  function build () {
    var pts = anchors();
    if (pts.length < 2) { return; }
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.scrollHeight;
    route.style.height = h + 'px';
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    motion.setAttribute('d', smoothPath(pts));
    pathLen = motion.getTotalLength();
    clearDots();   // geometry moved — old footprints point at nothing
    pathTopY = pts[0][1];
    // p must be able to reach 1: the read-line maxes out at
    // docHeight − 0.45·vh, and the footer anchor can sit below that
    pathBotY = Math.min(pts[pts.length - 1][1],
                        document.documentElement.scrollHeight - window.innerHeight * 0.45 - 4);
    lastMd = null;
    update(true);
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
