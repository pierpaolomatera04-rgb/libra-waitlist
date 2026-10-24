/* ═══════════════════════════════════════
   La Casa di Campagna · main.js
   ═══════════════════════════════════════ */
(function () {
  'use strict';
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '393396904793';

  /* ── Intro animata (una volta per sessione) ── */
  (function () {
    var intro = document.getElementById('intro'); if (!intro) return;
    var seen = false;
    try { seen = sessionStorage.getItem('lcc-intro') === '1'; } catch (e) {}
    function close() {
      intro.classList.add('hide');
      document.body.classList.remove('intro-lock');
      try { sessionStorage.setItem('lcc-intro', '1'); } catch (e) {}
      setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 900);
    }
    if (seen || reduced) { intro.classList.add('hide'); document.body.classList.remove('intro-lock'); setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 50); return; }
    document.body.classList.add('intro-lock');
    var timer = setTimeout(close, 2500);
    var skip = function () { clearTimeout(timer); close(); };
    intro.addEventListener('click', skip);
    var sb = intro.querySelector('.intro-skip'); if (sb) sb.addEventListener('click', skip);
    window.addEventListener('wheel', skip, { once: true, passive: true });
    window.addEventListener('touchmove', skip, { once: true, passive: true });
  })();

  /* ── Menu mobile ── */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('on', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); burger.classList.remove('on'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ── Header: si nasconde scendendo, torna salendo ── */
  var header = document.getElementById('header');
  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    if (y > lastY && y > 160 && !nav.classList.contains('open')) header.classList.add('hide');
    else if (y < lastY - 4 || y < 160) header.classList.remove('hide');
    lastY = y;
  }, { passive: true });

  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ── Reveal allo scroll ── */
  var targets = all('.rev, .reveal-group');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else { targets.forEach(function (t) { t.classList.add('in'); }); }

  /* ── Mappa al clic ── */
  var mapBtn = document.getElementById('mapLoad');
  if (mapBtn) mapBtn.addEventListener('click', function () {
    var w = document.getElementById('mapWrap');
    w.innerHTML = '<iframe src="' + w.dataset.src + '" title="Mappa della casa" loading="lazy" allowfullscreen></iframe>';
  });

  /* ── Calcolatore soggiorno: date → notti → prezzo → WhatsApp ── */
  (function () {
    var box = document.getElementById('booking'); if (!box) return;
    var inA = document.getElementById('dtIn'), inB = document.getElementById('dtOut');
    var out = document.getElementById('bkTotal'), wa = document.getElementById('bkWa');
    var RATE = 87.5, MIN = 2;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var iso = function (d) { return d.toISOString().slice(0, 10); };
    inA.min = iso(today);
    var fmt = function (s) { var p = s.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; };
    function calc() {
      var a = inA.value, b = inB.value;
      if (a) { var min = new Date(a); min.setDate(min.getDate() + MIN); inB.min = iso(min); }
      if (!a || !b) { out.innerHTML = 'Scegli arrivo e partenza per vedere il totale.'; wa.href = waBase(); return; }
      var da = new Date(a), db = new Date(b);
      var nights = Math.round((db - da) / 864e5);
      if (nights < MIN) { out.innerHTML = 'Il soggiorno minimo è di <b>' + MIN + ' notti</b>. Scegli una data di partenza più avanti.'; wa.href = waBase(); return; }
      var tot = (nights * RATE);
      var totStr = tot.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      out.innerHTML = nights + ' notti × 87,50 € = <b>' + totStr + ' €</b><br><span style="font-weight:400;font-size:.88rem;color:var(--ink-2)">Intera casa · fino a 3 ospiti</span>';
      var msg = 'Buongiorno, vorrei verificare la disponibilità per La Casa di Campagna dal ' + fmt(a) + ' al ' + fmt(b) + ' (' + nights + ' notti, totale indicativo ' + totStr + ' €).';
      wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    }
    function waBase() { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Buongiorno, vorrei informazioni sulla disponibilità de La Casa di Campagna.'); }
    inA.addEventListener('change', calc); inB.addEventListener('change', calc);
    calc();
  })();

  /* ── Offerta: apre la card ── */
  (function () {
    var btn = document.getElementById('priceBtn'), card = document.getElementById('offerCard');
    if (!btn || !card) return;
    btn.addEventListener('click', function () {
      var open = card.hidden; card.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      if (open) { card.classList.remove('opening'); void card.offsetWidth; card.classList.add('opening'); setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80); }
    });
  })();

  /* ── Offerta: scadenza 14 giorni ── */
  (function () {
    var el = document.getElementById('offerDeadline'); if (!el) return;
    var DAYS = 14, key = 'itsf-offer:' + location.hostname + location.pathname, start = null;
    try { start = parseInt(localStorage.getItem(key), 10) || null; if (!start) { start = Date.now(); localStorage.setItem(key, String(start)); } } catch (e) { start = Date.now(); }
    var end = new Date(start + DAYS * 864e5), left = Math.ceil((end - Date.now()) / 864e5);
    var date = end.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
    if (left > 0) el.innerHTML = '<strong>Offerta valida fino al ' + date + '</strong><span>' + (left === 1 ? 'manca 1 giorno' : 'mancano ' + left + ' giorni') + '</span>';
    else { el.classList.add('expired'); el.innerHTML = '<strong>Offerta scaduta</strong><span>scrivici comunque</span>'; }
  })();
})();
