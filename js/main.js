/* ============================================================
   MARDAL DIGITAL — main.js
   Kontrollerte, subtile interaksjoner. Respekterer reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* ---------- År + live Oslo-klokke ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var clockEl = document.getElementById('clock');
  if (clockEl) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('no-NO', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Europe/Oslo'
      });
    } catch (e) { fmt = null; }
    var tick = function () {
      clockEl.innerHTML = 'Oslo — <b>' + (fmt ? fmt.format(new Date()) : '') + '</b>';
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Preloader ---------- */
  var loader = document.getElementById('loader');
  var hero = document.getElementById('hero');
  function startHero() { if (hero) hero.classList.add('ready'); }

  if (loader && !reduce) {
    var finish = function () {
      if (loader.classList.contains('done')) return;
      loader.classList.add('done');
      startHero();
    };
    window.addEventListener('load', function () { setTimeout(finish, 1150); });
    setTimeout(finish, 1900); // fallback
  } else {
    if (loader) loader.style.display = 'none';
    startHero();
  }

  /* ---------- Mobil meny ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    var setMenu = function (open) {
      mobileNav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Header: skjul ved scroll ned, bakgrunn når scrollet ---------- */
  var header = document.getElementById('header');
  var lastY = window.pageYOffset;
  if (header) {
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      header.classList.toggle('scrolled', y > 40);
      if (y > lastY && y > 320) header.classList.add('hidden');
      else header.classList.remove('hidden');
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- Subtil parallax (kun der det gir mening) ---------- */
  var pEls = document.querySelectorAll('[data-parallax]');
  if (pEls.length && !reduce) {
    var ticking = false;
    var run = function () {
      var vh = window.innerHeight;
      pEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
        var prog = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translate3d(0,' + (prog * speed * 100).toFixed(2) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(run); ticking = true; }
    }, { passive: true });
    run();
  }

  /* ---------- Custom cursor ---------- */
  if (fine && !reduce) {
    var cur = document.querySelector('.cursor');
    var lbl = cur ? cur.querySelector('.cursor__label') : null;
    if (cur) {
      document.body.classList.add('cursor-ready');
      var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
      addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        document.body.classList.add('cursor-active');
      });
      document.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-active'); });
      (function loop() {
        cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
        cur.style.transform = 'translate(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px) translate(-50%,-50%)';
        requestAnimationFrame(loop);
      })();

      document.querySelectorAll('a, button, [data-cursor]').forEach(function (el) {
        var mode = el.getAttribute('data-cursor');
        el.addEventListener('mouseenter', function () {
          if (mode === 'media') {
            document.body.classList.add('cursor-media');
            if (lbl) lbl.textContent = el.getAttribute('data-cursor-label') || 'Se';
          } else {
            document.body.classList.add('cursor-link');
          }
        });
        el.addEventListener('mouseleave', function () {
          document.body.classList.remove('cursor-media', 'cursor-link');
        });
      });
    }
  }
})();
