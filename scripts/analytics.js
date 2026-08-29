/* Google Analytics 4 — custom events for the portfolio.
   The base gtag.js snippet lives in the <head> of each page (it defines the
   global `gtag`). This file only wires custom events. It never calls
   preventDefault, never touches layout or styles, and no-ops safely when GA
   is blocked or an element is missing. Vanilla JS, no libraries.

   Every conversion-ish event (contact_*, cv_download) also carries the
   visit's FIRST-TOUCH source, so the reports can answer the one question
   that matters here: which channel actually produced a conversation.

   NOTE — custom parameters (src_source, project_name, store, app, …) stay
   invisible in GA4 reports until they are registered under
   Admin → Custom definitions. Registering them is a one-off UI step. */
(function () {
  'use strict';

  // 'ru' / 'en' — i18n.js keeps <html lang> in step with the switcher
  function pageLang() {
    return (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  }

  /* Fire a GA4 event; silently do nothing if gtag never loaded (blocker, etc.).
     Every event carries the language it happened in — that is what answers
     "which language should the cases actually be written in". */
  function send(name, params) {
    if (typeof window.gtag !== 'function') { return; }
    var p = params || {};
    p.page_lang = pageLang();
    window.gtag('event', name, p);
  }

  // forEach over a NodeList in a way that's safe on older engines too.
  function each(list, fn) {
    if (list) { Array.prototype.forEach.call(list, fn); }
  }

  // Which page is this? Served as "/", "/index.html" or "/home.html" etc.
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var isIndex = (file === '' || file === 'index.html');
  var CASE_PAGES = ['home.html', 'nomerogram.html', 'drompdd.html', 'dromfines.html'];
  // pages long enough for reading depth to mean anything — the case pages
  // plus the front page, which is the funnel itself
  var READ_PAGES = CASE_PAGES.concat(['index.html', '']);

  // Filename an <a> points at (ignores #hash and ?query), lowercased.
  function linkFile(a) {
    try {
      return (new URL(a.href, location.href).pathname.split('/').pop() || '').toLowerCase();
    } catch (e) {
      return '';
    }
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ── First-touch source ────────────────────────────────────────────────
     Where this visit came from, decided once and kept for the session:
     UTM wins, else the referrer's host, else "direct". GA4's own attribution
     doesn't follow custom events well at this traffic size, so the source
     rides along as plain parameters on the events that count. */
  var SRC_KEY = 'analytics_source';
  var srcCache = null;
  function firstTouch() {
    if (srcCache) { return srcCache; }
    try {
      var saved = sessionStorage.getItem(SRC_KEY);
      if (saved) { return (srcCache = JSON.parse(saved)); }
    } catch (e) { /* private mode — fall through and recompute each time */ }

    var q = null;
    try { q = new URLSearchParams(location.search); } catch (e) {}
    var src = {
      source:   (q && q.get('utm_source'))   || '',
      medium:   (q && q.get('utm_medium'))   || '',
      campaign: (q && q.get('utm_campaign')) || ''
    };
    if (!src.source && document.referrer) {
      try {
        var host = new URL(document.referrer).hostname.replace(/^www\./, '');
        if (host && host !== location.hostname) {
          src.source = host;
          src.medium = src.medium || 'referral';
        }
      } catch (e) {}
    }
    if (!src.source) { src.source = 'direct'; src.medium = src.medium || 'none'; }

    try { sessionStorage.setItem(SRC_KEY, JSON.stringify(src)); } catch (e) {}
    return (srcCache = src);
  }

  // send() plus the visit's source — for anything that counts as a conversion
  function sendConversion(name, params) {
    var s = firstTouch();
    var p = params || {};
    p.src_source = s.source;
    p.src_medium = s.medium;
    if (s.campaign) { p.src_campaign = s.campaign; }
    send(name, p);
  }

  /* ── Active time ───────────────────────────────────────────────────────
     Wall-clock lies about reading: a page left open in a background tab
     racks up minutes. This counts only the time the tab is actually
     visible, and is what separates "read the case" from "scrolled past it". */
  var activeMs = 0;
  var since = document.hidden ? null : Date.now();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (since) { activeMs += Date.now() - since; since = null; }
    } else if (!since) {
      since = Date.now();
    }
  });
  function activeSeconds() {
    return Math.round((activeMs + (since ? Date.now() - since : 0)) / 1000);
  }

  // short id for the case this page is about — used as an event parameter
  function pageApp() {
    if (file.indexOf('nomerogram') === 0) { return 'nomerogram'; }
    if (file.indexOf('dromfines') === 0)  { return 'drom_fines'; }
    if (file.indexOf('drompdd') === 0)    { return 'drom_pdd'; }
    if (file.indexOf('home') === 0)       { return 'plannix'; }
    return 'index';
  }

  // flow filename → prototype name (kept stable: these names are already
  // in the historical data from when this lived inline in home.html)
  function protoName(src) {
    if (!src) { return null; }
    if (src.indexOf('create-chats')       !== -1) { return 'chat_organization'; }
    if (src.indexOf('attach-photo')       !== -1) { return 'photo_layouts'; }
    if (src.indexOf('login')              !== -1) { return 'login'; }
    if (src.indexOf('nomerogram-scan')    !== -1) { return 'nomerogram_scan'; }
    if (src.indexOf('dromfines-payment')  !== -1) { return 'dromfines_payment'; }
    if (src.indexOf('drompdd-paid')       !== -1) { return 'drompdd_paid'; }
    return null;
  }

  onReady(function () {
    // ── (г) Contact links in the header — present on every page ──
    var header = document.querySelector('.site-header');
    if (header) {
      each(header.querySelectorAll('a[href$=".pdf"]'), function (a) {
        a.addEventListener('click', function () { sendConversion('cv_download'); });
      });
      each(header.querySelectorAll('a[href*="linkedin"]'), function (a) {
        a.addEventListener('click', function () { sendConversion('contact_linkedin'); });
      });
      each(header.querySelectorAll('a[href^="mailto:"]'), function (a) {
        a.addEventListener('click', function () { sendConversion('contact_email'); });
      });
    }
    // Telegram: header + footer "Let's talk" — any t.me link on the page.
    each(document.querySelectorAll('a[href*="t.me"]'), function (a) {
      a.addEventListener('click', function () { sendConversion('contact_telegram'); });
    });
    // Instagram: the "Bit About Me" link (and anywhere else it appears).
    each(document.querySelectorAll('a[href*="instagram"]'), function (a) {
      a.addEventListener('click', function () { sendConversion('contact_instagram'); });
    });

    // ── index.html only: quiz + project links ──
    if (isIndex) {
      // (а) quiz_click — the "two truths and a lie" answer buttons (About section)
      var quiz = document.getElementById('guess');
      if (quiz) {
        each(quiz.querySelectorAll('.guess__option'), function (btn, i) {
          btn.addEventListener('click', function () {
            var label = btn.querySelector('span:not(.guess__mark)');
            var answer = (label ? label.textContent : btn.textContent).trim();
            send('quiz_click', {
              location: 'about_section',
              answer: answer,                                             // which statement they picked
              option_index: i + 1,                                        // 1-based position
              outcome: btn.hasAttribute('data-lie') ? 'correct' : 'wrong' // did they spot the lie?
            });
          });
        });
      }

      // (б) project_open on every project click + (в) first_project_click once per session
      var FIRST_KEY = 'analytics_first_project_click';
      each(document.querySelectorAll('a[href]'), function (a) {
        if (CASE_PAGES.indexOf(linkFile(a)) === -1) { return; }
        a.addEventListener('click', function () {
          var nameEl = a.querySelector('.project-card__name');
          var projectName = (nameEl ? nameEl.textContent : a.textContent).trim();
          send('project_open', {
            project_name: projectName,
            active_seconds: activeSeconds()   // how long the front page held them first
          });
          try {
            if (!sessionStorage.getItem(FIRST_KEY)) {
              sessionStorage.setItem(FIRST_KEY, '1');
              send('first_project_click', { project_name: projectName });
            }
          } catch (e) { /* sessionStorage unavailable (private mode) — skip */ }
        });
      });
    }

    /* ── store_open — the live apps on the case pages ──
       The strongest signal on the site: they believed the case enough to go
       look at the shipped product. */
    each(document.querySelectorAll('a[href*="apps.apple.com"], a[href*="play.google.com"]'), function (a) {
      var store = a.href.indexOf('apps.apple.com') !== -1 ? 'app_store' : 'google_play';
      a.addEventListener('click', function () {
        sendConversion('store_open', { store: store, app: pageApp() });
      });
    });

    /* ── outbound_click — any other link off the site ──
       Catches drom.ru and anything added later, without needing a new rule.
       Contacts and stores are already covered above and are skipped here. */
    var COVERED = /t\.me|linkedin|instagram|apps\.apple\.com|play\.google\.com|mailto:|fonts\.(googleapis|gstatic)\.com/;
    each(document.querySelectorAll('a[href^="http"]'), function (a) {
      if (COVERED.test(a.href)) { return; }
      var host = '';
      try { host = new URL(a.href).hostname.replace(/^www\./, ''); } catch (e) { return; }
      if (!host || host === location.hostname) { return; }
      a.addEventListener('click', function () {
        send('outbound_click', { host: host, page_app: pageApp() });
      });
    });

    /* ── Prototypes — index.html and home.html ──
       Lived inline at the bottom of home.html until now; moved here so the
       four prototypes on the front page are covered too. */
    var frames = document.querySelectorAll('iframe[src*="flows/"]');

    // Events the embedded prototypes post out: { source:'proto', event, prototype, detail }.
    // Only same-origin messages from one of OUR iframes are accepted, so a
    // foreign script or extension can't inject fake analytics events.
    if (frames.length) {
      window.addEventListener('message', function (e) {
        var d = e && e.data;
        if (!d || typeof d !== 'object' || d.source !== 'proto') { return; }
        if (e.origin !== location.origin && e.origin !== 'null') { return; }   // file:// reports "null"
        var fromProto = false;
        for (var i = 0; i < frames.length; i++) {
          if (frames[i].contentWindow === e.source) { fromProto = true; break; }
        }
        if (!fromProto) { return; }
        send(d.event, { prototype: d.prototype, detail: d.detail, page_app: pageApp() });
      });
    }

    // prototype_view — once per iframe, when it is first ≥50% on screen
    if (frames.length && 'IntersectionObserver' in window) {
      var viewed = new WeakSet();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || viewed.has(entry.target)) { return; }
          var name = protoName(entry.target.getAttribute('src'));
          if (!name) { return; }
          viewed.add(entry.target);
          send('prototype_view', { prototype: name, page_app: pageApp() });
          io.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      each(frames, function (f) { io.observe(f); });
    }

    // design_system_open — the link through to the design-system viewer
    var dsLink = document.querySelector('a[href="overview.html"]');
    if (dsLink) {
      dsLink.addEventListener('click', function () { send('design_system_open', { page_app: pageApp() }); });
    }

    /* ── lang_switch — someone actively changed the language ──
       i18n.js also fires langchange on its first paint, so a no-op change
       is ignored: only a real switch counts. */
    var langNow = pageLang();
    document.addEventListener('langchange', function (e) {
      var to = ((e && e.detail && e.detail.lang) || pageLang()).toLowerCase().slice(0, 2);
      if (to === langNow) { return; }
      var from = langNow;
      langNow = to;
      send('lang_switch', { from: from, to: to, page_app: pageApp() });
    });

    /* ── (д) scroll_depth + case_read — front page and case pages ──
       scroll_depth answers "how far down did they get"; case_read is the
       honest one: 75% of the page AND 45 seconds of visible time, so a fast
       flick to the footer doesn't count as reading. */
    if (READ_PAGES.indexOf(file) !== -1) {
      var thresholds = [25, 50, 75, 100];
      var fired = {};
      var pageTitle = document.title;
      var readSent = false, readTimer = null;

      function maybeRead(percent) {
        if (readSent || percent < 75) { return; }
        var short = 45 - activeSeconds();
        if (short <= 0) {
          readSent = true;
          clearTimeout(readTimer);
          send('case_read', { page: pageTitle, page_app: pageApp(), active_seconds: activeSeconds() });
        } else {
          // deep enough but not long enough — wait out the rest, in case they
          // are reading rather than scrolling (a hidden tab won't tick down)
          clearTimeout(readTimer);
          readTimer = setTimeout(function () { maybeRead(75); }, short * 1000 + 250);
        }
      }

      var checkScroll = function () {
        var doc = document.documentElement;
        var scrollable = doc.scrollHeight - window.innerHeight;
        var percent = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100;
        for (var i = 0; i < thresholds.length; i++) {
          var t = thresholds[i];
          if (!fired[t] && percent >= t) {
            fired[t] = true;
            send('scroll_depth', { percent: t, page: pageTitle, page_app: pageApp() });
          }
        }
        maybeRead(percent);
        if (fired[100] && readSent) {
          window.removeEventListener('scroll', checkScroll);
        }
      };
      window.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();   // a short page can already be "fully scrolled" on load
    }
  });
})();
