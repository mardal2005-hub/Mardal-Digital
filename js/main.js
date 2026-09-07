/* ============================================================
   MARDAL DIGITAL — main.js  (premium byrå-versjon)
   Lette, raffinerte interaksjoner. Respekterer reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Header + sticky mobil-CTA */
  var header = document.getElementById('header');
  var sticky = document.getElementById('stickyCta');
  window.addEventListener('scroll', function () {
    var s = window.pageYOffset;
    if (header) header.classList.toggle('scrolled', s > 20);
    if (sticky) sticky.classList.toggle('show', s > 700);
  }, { passive: true });

  /* Mobilmeny */
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    var setMenu = function (open) {
      mobileNav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    mobileNav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Reveal */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Count-up */
  function fmt(v, dec) { return dec > 0 ? v.toFixed(dec).replace('.', ',') : Math.round(v).toString(); }
  var counters = document.querySelectorAll('[data-count]');
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = fmt(target, dec) + suffix; return; }
    var dur = 1400, start = performance.now();
    var step = function (now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, dec) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target, dec) + suffix;
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    } else { counters.forEach(runCount); }
  }

  /* Book-lenke → kontaktskjema (plassholder) */
  var bookLink = document.getElementById('bookLink');
  if (bookLink) {
    bookLink.addEventListener('click', function (e) {
      e.preventDefault();
      var f = document.getElementById('navn');
      if (f) { f.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); setTimeout(function () { f.focus(); }, reduce ? 0 : 500); }
    });
  }

  /* Kontaktskjema — Formspree hvis konfigurert, ellers e-post-fallback */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action') || '';
      var data = new FormData(form);
      if (action.indexOf('your-form-id') !== -1) {
        var body = 'Navn: ' + (data.get('navn') || '') + '\nE-post: ' + (data.get('epost') || '') + '\n\n' + (data.get('melding') || '');
        window.location.href = 'mailto:mardal2005@gmail.com?subject=' + encodeURIComponent('Henvendelse fra nettsiden') + '&body=' + encodeURIComponent(body);
        form.classList.add('sent'); return;
      }
      fetch(action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (r.ok) form.classList.add('sent'); else alert('Noe gikk galt. Send oss gjerne en e-post på mardal2005@gmail.com'); })
        .catch(function () { alert('Noe gikk galt. Send oss gjerne en e-post på mardal2005@gmail.com'); });
    });
  }
})();
