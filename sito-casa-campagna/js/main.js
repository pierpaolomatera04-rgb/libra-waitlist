/* ═══════════════════════════════════════
   La Casa di Campagna · main.js
   ═══════════════════════════════════════ */
(function () {
  'use strict';
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '393396904793';

  /* ── Intro premium a sipario (una volta per sessione) ── */
  (function () {
    var intro = document.getElementById('intro'); if (!intro) return;
    var seen = false;
    try { seen = sessionStorage.getItem('lcc-intro') === '1'; } catch (e) {}
    var remove = function () { if (intro.parentNode) intro.parentNode.removeChild(intro); };
    if (seen || reduced) { document.body.classList.remove('intro-lock'); document.body.classList.add('ready'); remove(); return; }
    // nome lettera per lettera
    var nm = intro.querySelector('.il-name'), txt = nm.textContent, i = 0;
    nm.innerHTML = txt.split('').map(function (c) {
      if (c === ' ') return ' ';
      return '<span class="ch" aria-hidden="true" style="--i:' + (i++) + '">' + c + '</span>';
    }).join('');
    document.body.classList.add('intro-lock');
    var done = false;
    function open() {
      if (done) return; done = true;
      intro.classList.add('open');
      document.body.classList.remove('intro-lock');
      setTimeout(function () { document.body.classList.add('ready'); }, 350);
      try { sessionStorage.setItem('lcc-intro', '1'); } catch (e) {}
      setTimeout(remove, 1400);
    }
    var timer = setTimeout(open, 3700);
    var skip = function () { clearTimeout(timer); open(); };
    intro.addEventListener('click', skip);
    window.addEventListener('wheel', skip, { once: true, passive: true });
    window.addEventListener('touchmove', skip, { once: true, passive: true });
    window.addEventListener('keydown', skip, { once: true });
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

  /* ── Header: trasparente sull'hero, solido allo scroll; si nasconde scendendo ── */
  var header = document.getElementById('header');
  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    header.classList.toggle('solid', y > 60);
    if (y > lastY && y > 220 && !nav.classList.contains('open')) header.classList.add('hide');
    else if (y < lastY - 4 || y < 220) header.classList.remove('hide');
    lastY = y;
  }, { passive: true });

  /* ── Barra di avanzamento + hero che sfuma allo scroll ── */
  (function () {
    var bar = document.getElementById('progress'), heroIn = document.querySelector('.hero-in');
    var ticking = false;
    function upd() {
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
      if (heroIn && !reduced && document.body.classList.contains('ready')) {
        var k = Math.min(1, y / (window.innerHeight * .7));
        heroIn.style.opacity = 1 - k * .9; heroIn.style.transform = 'translateY(' + (y * .25) + 'px)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(upd); ticking = true; } }, { passive: true });
  })();

  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ── Reveal ── */
  var targets = all('.rev, .reveal-group, .imgrev');
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

  /* ── Quiz trekking ── */
  (function () {
    var box = document.getElementById('quizc'); if (!box) return;
    var qs = [
      { q: 'Ti piacerebbe esplorare i sentieri dei Monti Lucretili?', e: 'Perfetto: la casa è il punto di partenza ideale per i cammini della Sabina.' },
      { q: 'Hai già con te bastoncini, zaini e cartine dei sentieri?', e: 'Nessun problema: qui trovi il kit completo da trekking incluso nel soggiorno, non devi portare nulla.' },
      { q: 'Ti farebbe piacere qualche consiglio sui percorsi più belli?', e: 'Con piacere: ti indichiamo i sentieri e le mete migliori in base ai tuoi giorni.' }
    ];
    var qEl = box.querySelector('.qz-q'), opts = box.querySelector('.qz-opts'), fb = box.querySelector('.qz-fb'),
        bar = box.querySelector('.qz-bar i'), step = box.querySelector('.qz-step'), body = box.querySelector('.qz-body'), end = box.querySelector('.qz-end');
    var cur = 0;
    function render() {
      qEl.textContent = qs[cur].q;
      step.textContent = '0' + (cur + 1) + ' / 0' + qs.length;
      bar.style.width = (cur / qs.length * 100) + '%';
      fb.classList.remove('show'); opts.style.display = 'grid';
    }
    opts.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        fb.querySelector('.qz-expl').textContent = qs[cur].e;
        opts.style.display = 'none'; fb.classList.add('show');
        bar.style.width = ((cur + 1) / qs.length * 100) + '%';
      });
    });
    fb.querySelector('.qz-next').addEventListener('click', function () {
      cur++;
      if (cur >= qs.length) { body.style.display = 'none'; end.classList.add('show'); }
      else render();
    });
    var rs = box.querySelector('.qz-restart');
    if (rs) rs.addEventListener('click', function () { cur = 0; body.style.display = ''; end.classList.remove('show'); render(); });
    render();
  })();

  /* ── Preventivo: notti (stepper) + arrivo → totale → WhatsApp ── */
  (function () {
    var box = document.getElementById('quote'); if (!box) return;
    var RATE = 87.5, MIN = 2;
    var minus = document.getElementById('nMinus'), plus = document.getElementById('nPlus'), val = document.getElementById('nVal');
    var dt = document.getElementById('qDate'), big = document.getElementById('qBig'), wa = document.getElementById('qWa');
    var nights = MIN;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    if (dt) dt.min = today.toISOString().slice(0, 10);
    var money = function (n) { return n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    function paint() {
      val.textContent = nights;
      minus.disabled = nights <= MIN; minus.style.opacity = nights <= MIN ? .35 : 1;
      var tot = nights * RATE;
      big.innerHTML = money(tot) + ' <small>€</small>';
      big.classList.remove('bump'); void big.offsetWidth; big.classList.add('bump');
      var msg = 'Buongiorno, vorrei verificare la disponibilità de La Casa di Campagna per ' + nights + ' notti';
      if (dt && dt.value) { var p = dt.value.split('-'); msg += ' con arrivo il ' + p[2] + '/' + p[1] + '/' + p[0]; }
      msg += ' (totale indicativo ' + money(tot) + ' €, intera casa fino a 3 ospiti).';
      wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    }
    minus.addEventListener('click', function () { if (nights > MIN) { nights--; paint(); } });
    plus.addEventListener('click', function () { if (nights < 30) { nights++; paint(); } });
    if (dt) dt.addEventListener('change', paint);
    paint();
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
