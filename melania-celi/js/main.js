/* ═══════════════════════════════════════
   Dott.ssa Melania Celi · main.js
   ═══════════════════════════════════════ */
(function () {
'use strict';
var d = document.documentElement;
var all = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var WA = '393496821954';
var waLink = function (t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); };

/* ── Apertura: si salta con un tocco o un tasto ── */
var intro = document.querySelector('.intro');
function skipIntro() {
  if (!d.classList.contains('intro-on')) return;
  d.classList.remove('intro-on'); d.classList.add('intro-done', 'intro-skip');
}
if (intro) intro.addEventListener('click', skipIntro);
window.addEventListener('keydown', skipIntro, { once: true });
var introOver = function (cb) {
  if (!d.classList.contains('intro-on')) return cb();
  var t = setInterval(function () { if (!d.classList.contains('intro-on')) { clearInterval(t); cb(); } }, 120);
};

/* ── Si parte sempre dall'inizio ── */
if (location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
window.scrollTo(0, 0);

/* ── Menu ── */
var navToggle = document.getElementById('navToggle'), nav = document.getElementById('nav');
navToggle.addEventListener('click', function () {
  var open = nav.classList.toggle('open'); navToggle.setAttribute('aria-expanded', String(open));
});
all('a', nav).forEach(function (l) { l.addEventListener('click', function () { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }); });

/* ── Menu: sparisce scendendo, torna salendo ── */
var header = document.getElementById('siteHeader'), lastY = window.scrollY;
window.addEventListener('scroll', function () {
  var y = window.scrollY;
  if (y > lastY && y > 140 && !nav.classList.contains('open')) header.classList.add('hide');
  else if (y < lastY - 4 || y < 140) header.classList.remove('hide');
  lastY = y;
}, { passive: true });

document.getElementById('year').textContent = new Date().getFullYear();

/* ── Comparsa allo scorrimento ── */
var once = function (list, cls, opts) {
  if (!('IntersectionObserver' in window)) { list.forEach(function (t) { t.classList.add(cls); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); } });
  }, opts);
  list.forEach(function (t) { io.observe(t); });
};
once(all('.reveal, .final'), 'in', { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
introOver(function () { once(all('mark'), 'on', { threshold: 0.8 }); });

/* ── Parola che cambia nell'hero (crossfade lento) ── */
(function () {
  var words = all('.swap .w'); if (words.length < 2 || reduced) return;
  var i = 0;
  introOver(function () {
    setInterval(function () {
      words[i].classList.remove('on'); i = (i + 1) % words.length; words[i].classList.add('on');
    }, 3000);
  });
})();

/* ── La scheda: il pensiero automatico si barra e si riscrive ── */
(function () {
  var card = document.getElementById('rewrite'); if (!card) return;
  var ex = JSON.parse(card.getAttribute('data-ex'));
  var oldT = card.querySelector('.old-t'), neu = card.querySelector('.new'), dots = all('.card-dots i', card);
  if (reduced) { card.classList.add('strike', 'write'); return; }
  var k = 0;
  function cycle() {
    oldT.textContent = ex[k][0]; neu.textContent = ex[k][1];
    dots.forEach(function (dt, j) { dt.classList.toggle('on', j === k); });
    card.classList.remove('fade');
    setTimeout(function () { card.classList.add('strike'); }, 1100);
    setTimeout(function () { card.classList.add('write'); }, 1900);
    setTimeout(function () { card.classList.add('fade'); }, 6400);
    setTimeout(function () { card.classList.remove('strike', 'write'); k = (k + 1) % ex.length; setTimeout(cycle, 80); }, 7000);
  }
  introOver(function () { setTimeout(cycle, 900); });
})();

/* ── Quiz a temi: scegli un tema, tre frasi vero/falso ── */
(function () {
  var box = document.getElementById('temi'); if (!box) return;
  var temi = all('.temi-data .md-theme').map(function (t) {
    return {
      name: t.dataset.name, wa: t.dataset.wa, sum: t.dataset.sum, help: t.dataset.help,
      q: all('p', t).map(function (p) {
        var b = p.querySelector('b').textContent;
        return { a: p.dataset.a, fix: p.dataset.fix || '', s: b, e: p.textContent.replace(b, '').trim() };
      })
    };
  });
  var card = box.querySelector('.qcard'), body = card.querySelector('.q-body'), end = card.querySelector('.q-end');
  var qNum = body.querySelector('.q-num'), qText = body.querySelector('.q-text'), qFix = body.querySelector('.q-fix');
  var btns = body.querySelector('.q-btns'), res = body.querySelector('.q-res'), verdict = res.querySelector('.verdict');
  var expl = res.querySelector('.q-expl'), next = res.querySelector('.q-next'), strokes = all('.strokes i', box);
  var tname = box.querySelector('.tname');
  var T = null, cur = 0, score = 0;

  function show() {
    var q = T.q[cur];
    qNum.textContent = 'Frase ' + (cur + 1) + ' di ' + T.q.length;
    qText.textContent = q.s; qText.classList.remove('struck');
    qFix.textContent = ''; qFix.classList.remove('on');
    btns.style.display = ''; res.classList.remove('show');
    next.textContent = cur === T.q.length - 1 ? 'Vedi il risultato →' : 'Prossima →';
  }
  function start(i) {
    T = temi[i]; cur = 0; score = 0;
    tname.textContent = T.name;
    strokes.forEach(function (s) { s.classList.remove('done', 'ko'); });
    body.hidden = false; end.hidden = true;
    box.classList.add('playing'); show();
    box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  }
  all('.tema-btn', box).forEach(function (b) { b.addEventListener('click', function () { start(+b.dataset.t); }); });
  all('button', btns).forEach(function (b) {
    b.addEventListener('click', function () {
      var q = T.q[cur], ok = b.dataset.a === q.a;
      if (ok) score++;
      strokes[cur].classList.add('done'); if (!ok) strokes[cur].classList.add('ko');
      verdict.className = 'verdict ' + (ok ? 'ok' : 'ko');
      verdict.textContent = ok ? '✓ Esatto' : (q.a === 'vero' ? 'Non proprio: è vero' : 'Non proprio: è falso');
      expl.textContent = q.e;
      if (q.a === 'falso') { qText.classList.add('struck'); qFix.textContent = q.fix; requestAnimationFrame(function () { qFix.classList.add('on'); }); }
      btns.style.display = 'none'; res.classList.add('show');
    });
  });
  next.addEventListener('click', function () {
    card.classList.add('swapout');
    setTimeout(function () {
      card.classList.remove('swapout');
      cur++;
      if (cur < T.q.length) show();
      else {
        body.hidden = true; end.hidden = false;
        end.querySelector('.score span').textContent = score;
        end.querySelector('.sum').textContent = T.sum;
        end.querySelector('.help span').textContent = T.help;
        end.querySelector('.btn-wa').href = waLink(T.wa);
      }
      card.classList.add('swapin'); setTimeout(function () { card.classList.remove('swapin'); }, 600);
    }, reduced ? 0 : 420);
  });
  function back() { box.classList.remove('playing'); }
  box.querySelector('.back').addEventListener('click', back);
  end.querySelector('.again').addEventListener('click', function () { back(); box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); });
})();

/* ── Il triangolo: tocca un vertice ── */
(function () {
  var panel = document.getElementById('triPanel'); if (!panel) return;
  var info = [
    { h: 'Pensieri', p: 'Quello che ci diciamo su ciò che accade. Spesso sono automatici: arrivano veloci e ci sembrano veri.', ex: 'Andrà male di sicuro.' },
    { h: 'Emozioni', p: 'Ciò che sentiamo: ansia, tristezza, rabbia, vergogna. Sono segnali preziosi, non nemici da combattere.', ex: 'Agitazione, nodo allo stomaco.' },
    { h: 'Comportamenti', p: 'Ciò che facciamo, o evitiamo di fare. A volte danno sollievo subito ma mantengono il problema. In terapia impariamo a riconoscere questo circolo e a interromperlo.', ex: 'Rinuncio all’incontro.' }
  ];
  var nodes = all('.tri .node');
  function pick(k) {
    nodes.forEach(function (n) { n.classList.toggle('on', +n.dataset.k === k); });
    panel.innerHTML = '<h3>' + info[k].h + '</h3><p>' + info[k].p + '</p><p class="ex"><small>Per esempio</small>' + info[k].ex + '</p>';
    panel.classList.remove('swap-in'); void panel.offsetWidth; panel.classList.add('swap-in');
  }
  nodes.forEach(function (n) {
    n.addEventListener('click', function () { pick(+n.dataset.k); });
    n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(+n.dataset.k); } });
  });
})();

/* ── Mappa caricata solo al clic ── */
(function () {
  var ph = document.getElementById('mapLoad'); if (!ph) return;
  var load = function (e) {
    if (e && e.target.closest('a')) return;
    var w = document.getElementById('mapWrap');
    w.innerHTML = '<iframe src="' + w.dataset.src + '" title="Mappa dello studio" loading="lazy" allowfullscreen></iframe>';
  };
  ph.addEventListener('click', load);
  ph.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); } });
})();
})();

/* ── "Scopri il prezzo": apre il box della proposta ── */
(function () {
  var btn = document.getElementById('priceBtn'), card = document.getElementById('offerCard');
  if (!btn || !card) return;
  btn.addEventListener('click', function () {
    var open = card.hidden; card.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    if (open) {
      card.classList.remove('opening'); void card.offsetWidth; card.classList.add('opening');
      setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
    }
  });
})();

/* ── Proposta: offerta valida 14 giorni dalla prima visione (salvata su questo dispositivo) ── */
(function () {
  var el = document.getElementById('offerDeadline'); if (!el) return;
  var DAYS = 14, key = 'itsf-offer-start:' + location.hostname + location.pathname, start = null;
  try { start = parseInt(localStorage.getItem(key), 10) || null; if (!start) { start = Date.now(); localStorage.setItem(key, String(start)); } } catch (e) { start = Date.now(); }
  var end = new Date(start + DAYS * 864e5), left = Math.ceil((end - Date.now()) / 864e5);
  var date = end.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
  if (left > 0) el.innerHTML = '<b class="pd-line">Offerta valida fino al <strong>' + date + '</strong></b><span>' + (left === 1 ? 'manca 1 giorno' : 'mancano ' + left + ' giorni') + '</span>';
  else { el.classList.add('expired'); el.innerHTML = '<strong>Offerta scaduta</strong><span>scrivici comunque: vediamo cosa possiamo fare</span>'; }
})();
