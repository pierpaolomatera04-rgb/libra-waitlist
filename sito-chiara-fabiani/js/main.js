/* ═══════════════════════════════════════
   Dott.ssa Chiara Fabiani · main.js
   ═══════════════════════════════════════ */
(function () {
'use strict';
var all = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Menu ── */
var navToggle = document.getElementById('navToggle');
var nav = document.getElementById('nav');
navToggle.addEventListener('click', function () {
  var open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(function (l) {
  l.addEventListener('click', function () { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); });
});

/* ── Header: si nasconde scendendo, torna salendo ── */
var header = document.getElementById('siteHeader');
var lastY = window.scrollY;
window.addEventListener('scroll', function () {
  var y = window.scrollY;
  header.classList.toggle('scrolled', y > 30);
  if (y > lastY && y > 140 && !nav.classList.contains('open')) header.classList.add('hide');
  else if (y < lastY - 4 || y < 140) header.classList.remove('hide');
  lastY = y;
}, { passive: true });

document.getElementById('year').textContent = new Date().getFullYear();

/* ── L'amaca dell'apertura: da lenta si tende e sostiene ── */
var hk = document.getElementById('hkLine');
if (hk) {
  var from = 86, to = 46, dur = 1800, start = null;
  var setY = function (y) { hk.setAttribute('d', 'M10 14 Q300 ' + y.toFixed(1) + ' 590 14'); };
  if (reduced) setY(to);
  else {
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var overshoot = Math.sin(p * Math.PI) * 4 * (1 - p);
      setY(from + (to - from) * e - overshoot);
      if (p < 1) requestAnimationFrame(step);
    };
    setTimeout(function () { requestAnimationFrame(step); }, 600);
  }
}

/* ── Osservatore "una volta sola" ── */
var once = function (list, cls, opts) {
  if (!('IntersectionObserver' in window)) { list.forEach(function (t) { t.classList.add(cls); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); } });
  }, opts);
  list.forEach(function (t) { io.observe(t); });
};

/* ── Il disegno della sezione illustrata ── */
var sling = document.getElementById('sling');
if (sling) sling.setAttribute('pathLength', '1');
once(all('.pelvis-art'), 'in', { threshold: 0.35 });

/* ── Comparsa allo scorrimento ── */
var els = all('.label, .title, .lead, .pelvis p, .about-text p, .area, .quote-band blockquote, .hang-steps li, .mid-cta, .review, .reviews-foot, .faq details, .info, .map-wrap');
els.forEach(function (el) { el.classList.add('reveal'); });
['.areas', '.hang-steps', '.reviews'].forEach(function (g) {
  all(g).forEach(function (grid) {
    Array.prototype.slice.call(grid.children).forEach(function (c, i) { c.classList.add('d' + (Math.min(i % 3, 3) + 1)); });
  });
});
once(els, 'in', { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
once(all('mark'), 'on', { threshold: 0.8 });

/* ── Mappa caricata solo al clic ── */
var mapBtn = document.getElementById('mapLoad');
if (mapBtn) mapBtn.addEventListener('click', function () {
  var w = document.getElementById('mapWrap');
  w.innerHTML = '<iframe src="' + w.dataset.src + '" title="Mappa dello studio" loading="lazy" allowfullscreen></iframe>';
});
})();

/* ── "Scopri il prezzo": apre il box della proposta ── */
(function () {
  var btn = document.getElementById('priceBtn');
  var card = document.getElementById('offerCard');
  if (!btn || !card) return;
  btn.addEventListener('click', function () {
    var open = card.hidden;
    card.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      card.classList.remove('opening'); void card.offsetWidth; card.classList.add('opening');
      setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
    }
  });
})();

/* ── QUIZ "Vero o falso?" a mazzo di carte ── */
(function () {
  var quiz = document.getElementById('quiz');
  if (!quiz) return;
  var cards = Array.prototype.slice.call(quiz.querySelectorAll('.qcard'));
  var qs = cards.filter(function (c) { return !c.classList.contains('q-end'); });
  var dots = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-progress i'));
  var scoreEl = document.getElementById('quizScore'), msgEl = document.getElementById('quizMsg');
  var cur = 0, score = 0;
  var msgs = ['Ora sai qualcosa in più: il resto te lo spiego di persona.', 'Buon inizio! Il resto te lo spiego di persona.', 'Molto bene! Ne sai già parecchio.', 'Perfetto, tutte giuste!'];
  var layout = function () {
    cards.forEach(function (c, i) {
      c.classList.remove('active', 'behind-1', 'behind-2', 'behind-3', 'hidden-card');
      if (i < cur) return;
      var d = i - cur;
      c.classList.add(d === 0 ? 'active' : d === 1 ? 'behind-1' : d === 2 ? 'behind-2' : 'behind-3');
      c.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      c.querySelectorAll('button, a').forEach(function (b) { b.tabIndex = d === 0 ? 0 : -1; });
    });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === cur && cur < qs.length); });
  };
  var burst = function (el) {
    var r = el.getBoundingClientRect(), q = quiz.getBoundingClientRect();
    for (var i = 0; i < 10; i++) {
      var p = document.createElement('span'); p.className = 'q-pop';
      var a = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 50;
      p.style.left = (r.left - q.left + r.width / 2) + 'px'; p.style.top = (r.top - q.top + r.height / 2) + 'px';
      p.style.setProperty('--dx', Math.cos(a) * dist + 'px'); p.style.setProperty('--dy', Math.sin(a) * dist + 'px');
      quiz.appendChild(p); setTimeout(function (n) { return function () { n.remove(); }; }(p), 1000);
    }
  };
  quiz.style.position = 'relative';
  qs.forEach(function (c, i) {
    c.querySelectorAll('[data-choice]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (c.classList.contains('flipped')) return;
        var ok = b.dataset.choice === c.dataset.answer;
        if (ok) { score++; burst(b); }
        var v = c.querySelector('.q-verdict');
        v.className = 'q-verdict ' + (ok ? 'ok' : 'ko');
        v.textContent = ok ? '✓ Esatto!' : (c.dataset.answer === 'si' ? 'Non proprio: la risposta è sì' : 'Non proprio: la risposta è no');
        dots[i].classList.add(ok ? 'ok' : 'ko');
        setTimeout(function () { c.classList.add('flipped'); c.querySelector('.q-next').focus({ preventScroll: true }); }, ok ? 350 : 150);
      });
    });
    c.querySelector('.q-next').addEventListener('click', function () {
      c.classList.add('gone'); c.classList.remove('active');
      cur++;
      if (cur === qs.length) { scoreEl.textContent = score; msgEl.textContent = msgs[score] || msgs[0]; }
      setTimeout(layout, 120);
    });
  });
  var restart = quiz.querySelector('.q-restart');
  if (restart) restart.addEventListener('click', function () {
    cur = 0; score = 0;
    cards.forEach(function (c) { c.classList.remove('gone', 'flipped'); });
    dots.forEach(function (d) { d.classList.remove('ok', 'ko'); });
    layout();
  });
  layout();
})();

/* ── Proposta: offerta valida 14 giorni dalla prima visione (salvata su questo dispositivo) ── */
(function () {
  var el = document.getElementById('offerDeadline');
  if (!el) return;
  var DAYS = 14, key = 'itsf-offer-start:' + location.hostname + location.pathname, start = null;
  try { start = parseInt(localStorage.getItem(key), 10) || null; if (!start) { start = Date.now(); localStorage.setItem(key, String(start)); } } catch (e) { start = Date.now(); }
  var end = new Date(start + DAYS * 864e5);
  var left = Math.ceil((end - Date.now()) / 864e5);
  var date = end.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
  if (left > 0) {
    el.innerHTML = '<b class="pd-line">Offerta valida fino al <strong>' + date + '</strong></b><span>' + (left === 1 ? 'manca 1 giorno' : 'mancano ' + left + ' giorni') + '</span>';
  } else {
    el.classList.add('expired');
    el.innerHTML = '<strong>Offerta scaduta</strong><span>scrivici comunque: vediamo cosa possiamo fare</span>';
  }
})();
