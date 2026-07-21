/* Google Analytics 4 — custom events for the portfolio.
   The base gtag.js snippet lives in the <head> of each page (it defines the
   global `gtag`). This file only wires custom events. It never calls
   preventDefault, never touches layout or styles, and no-ops safely when GA
   is blocked or an element is missing. Vanilla JS, no libraries. */
(function () {
  'use strict';

  // Fire a GA4 event; silently do nothing if gtag never loaded (blocker, etc.).
  function send(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  }

  // forEach over a NodeList in a way that's safe on older engines too.
  function each(list, fn) {
    if (list) { Array.prototype.forEach.call(list, fn); }
  }

  // Which page is this? Served as "/", "/index.html" or "/home.html" etc.
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var isIndex = (file === '' || file === 'index.html');
  var CASE_PAGES = ['home.html', 'nomerogram.html', 'drompdd.html', 'dromfines.html'];

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

  onReady(function () {
    // ── (г) Contact links in the header — present on every page ──
    var header = document.querySelector('.site-header');
    if (header) {
      each(header.querySelectorAll('a[href$=".pdf"]'), function (a) {
        a.addEventListener('click', function () { send('cv_download'); });
      });
      each(header.querySelectorAll('a[href*="linkedin"]'), function (a) {
        a.addEventListener('click', function () { send('contact_linkedin'); });
      });
      each(header.querySelectorAll('a[href^="mailto:"]'), function (a) {
        a.addEventListener('click', function () { send('contact_email'); });
      });
    }
    // Telegram: header + footer "Let's talk" — any t.me link on the page.
    each(document.querySelectorAll('a[href*="t.me"]'), function (a) {
      a.addEventListener('click', function () { send('contact_telegram'); });
    });
    // Instagram: the "Bit About Me" link (and anywhere else it appears).
    each(document.querySelectorAll('a[href*="instagram"]'), function (a) {
      a.addEventListener('click', function () { send('contact_instagram'); });
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
          send('project_open', { project_name: projectName });
          try {
            if (!sessionStorage.getItem(FIRST_KEY)) {
              sessionStorage.setItem(FIRST_KEY, '1');
              send('first_project_click', { project_name: projectName });
            }
          } catch (e) { /* sessionStorage unavailable (private mode) — skip */ }
        });
      });
    }

    // ── (д) scroll_depth — case pages only; 25/50/75/100, once each ──
    if (CASE_PAGES.indexOf(file) !== -1) {
      var thresholds = [25, 50, 75, 100];
      var fired = {};
      var pageTitle = document.title;
      var checkScroll = function () {
        var doc = document.documentElement;
        var scrollable = doc.scrollHeight - window.innerHeight;
        var percent = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100;
        for (var i = 0; i < thresholds.length; i++) {
          var t = thresholds[i];
          if (!fired[t] && percent >= t) {
            fired[t] = true;
            send('scroll_depth', { percent: t, page: pageTitle });
          }
        }
        if (fired[100]) {
          window.removeEventListener('scroll', checkScroll);
        }
      };
      window.addEventListener('scroll', checkScroll, { passive: true });
    }
  });
})();
