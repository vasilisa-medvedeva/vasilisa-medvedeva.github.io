/* Consent notice — the visible half of GA4 Consent Mode v2.

   The <head> of every page declares all consent types DENIED before gtag
   configures itself, and replays a stored decision straight away. This file
   only asks the question and records the answer:

     localStorage.consent_analytics = 'granted' | 'denied'

   Saying yes calls gtag('consent','update', { analytics_storage: 'granted' })
   so the current page starts storing immediately — no reload needed. Saying
   no stores the refusal, so the card never comes back. Escape counts as no:
   dismissing a consent request is a refusal, not agreement.

   Advertising consent types are never granted — this site runs no ads, so
   ad_storage / ad_user_data / ad_personalization stay denied for good.

   The card is skipped entirely where GA is already off: the self-traffic
   opt-out and localhost. Vanilla JS, no libraries. */
(function () {
  'use strict';

  var KEY = 'consent_analytics';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* private mode — the ask returns next visit */ }
  }

  // Already answered, or GA is off anyway — nothing to ask.
  if (stored()) { return; }
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') { return; }
  try { if (localStorage.getItem('ga_optout') === '1') { return; } } catch (e) {}

  var COPY = {
    en: {
      text: 'I use Google Analytics to see which cases people actually read. Until you agree it runs without cookies.',
      yes: 'Allow',
      no: 'No thanks',
      label: 'Analytics consent'
    },
    ru: {
      text: 'Я использую Google Analytics, чтобы понимать, какие кейсы читают. До вашего согласия он работает без куки.',
      yes: 'Разрешить',
      no: 'Не надо',
      label: 'Согласие на аналитику'
    }
  };
  // i18n.js writes window.lang() and fires 'langchange'; before it loads the
  // <html lang> attribute already carries the right answer.
  function lang() {
    var l = (typeof window.lang === 'function' && window.lang()) ||
            document.documentElement.lang || 'en';
    return l.toLowerCase().slice(0, 2) === 'ru' ? 'ru' : 'en';
  }

  var card = null;

  function close(answer) {
    remember(answer);
    if (answer === 'granted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('langchange', render);
    if (card) {
      card.classList.remove('is-in');
      var gone = card;
      setTimeout(function () { gone.remove(); }, 300);
      card = null;
    }
  }

  function onKey(e) {
    if (e.key === 'Escape' && card) { close('denied'); }
  }

  function render() {
    if (!card) { return; }
    var c = COPY[lang()];
    card.setAttribute('aria-label', c.label);
    card.querySelector('.consent__text').textContent = c.text;
    card.querySelector('.consent__btn--yes').textContent = c.yes;
    card.querySelector('.consent__btn--no').textContent = c.no;
  }

  function build() {
    card = document.createElement('div');
    card.className = 'consent';
    card.setAttribute('role', 'region');
    card.innerHTML =
      '<p class="consent__text"></p>' +
      '<div class="consent__actions">' +
        '<button class="consent__btn consent__btn--yes" type="button"></button>' +
        '<button class="consent__btn consent__btn--no" type="button"></button>' +
      '</div>';
    render();
    document.body.appendChild(card);
    card.querySelector('.consent__btn--yes').addEventListener('click', function () { close('granted'); });
    card.querySelector('.consent__btn--no').addEventListener('click', function () { close('denied'); });
    document.addEventListener('keydown', onKey);
    document.addEventListener('langchange', render);   // the switch flips while it is open
    requestAnimationFrame(function () { card.classList.add('is-in'); });
  }

  function start() {
    // a beat after the page settles, so the work is what greets the visitor
    setTimeout(build, 1500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
