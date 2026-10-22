/* ═══════════════════════════════════════
   Fisioterapia Domiciliare Federico Rafael Rossi · main.js
   ═══════════════════════════════════════ */
(function () {
  'use strict';
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* Menu mobile */
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

  /* Header: si nasconde scendendo, torna salendo */
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

  /* Reveal allo scroll (singoli + gruppi con stagger) */
  var targets = all('.rev, .reveal-group');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else { targets.forEach(function (t) { t.classList.add('in'); }); }

  /* Mappa al clic */
  var mapBtn = document.getElementById('mapLoad');
  if (mapBtn) mapBtn.addEventListener('click', function () {
    var w = document.getElementById('mapWrap');
    w.innerHTML = '<iframe src="' + w.dataset.src + '" title="Mappa dello studio" loading="lazy" allowfullscreen></iframe>';
  });

  /* Self-check: 3 domande Sì/No, al termine messaggio + CTA */
  (function () {
    var box = document.getElementById('quiz2'); if (!box) return;
    var qs = [
      'Hai un dolore o stai recuperando da un infortunio o un intervento?',
      'Ti è scomodo o faticoso raggiungere uno studio di fisioterapia?',
      'Preferiresti fare le sedute comodamente a casa tua?'
    ];
    var qEl = box.querySelector('.q2-q'), opts = box.querySelector('.q2-opts'), fb = box.querySelector('.q2-fb'),
        bar = box.querySelector('.q2-bar i'), step = box.querySelector('.q2-step'), body = box.querySelector('.q2-body'),
        end = box.querySelector('.q2-end'), endMsg = box.querySelector('.q2-endmsg');
    var cur = 0, yes = 0;
    var expl = [
      'Perfetto: la fisioterapia domiciliare è pensata proprio per seguirti passo passo nel recupero.',
      'La fisioterapia a domicilio elimina il problema: i trattamenti arrivano a casa tua.',
      'Allora siamo sulla strada giusta: comodità, tempi tuoi e sedute personalizzate.'
    ];
    function render() {
      qEl.textContent = qs[cur];
      step.textContent = 'Domanda ' + (cur + 1) + ' di ' + qs.length;
      bar.style.width = (cur / qs.length * 100) + '%';
      fb.classList.remove('show'); opts.style.display = 'grid';
    }
    opts.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.choice === 'si') yes++;
        fb.querySelector('.q2-expl').textContent = expl[cur];
        opts.style.display = 'none'; fb.classList.add('show');
        bar.style.width = ((cur + 1) / qs.length * 100) + '%';
      });
    });
    fb.querySelector('.q2-next').addEventListener('click', function () {
      cur++;
      if (cur >= qs.length) {
        body.style.display = 'none'; end.classList.add('show');
        endMsg.textContent = yes >= 2
          ? 'La fisioterapia a domicilio sembra fare proprio al caso tuo. Scrivimi: ne parliamo insieme senza impegno.'
          : 'Scrivimi pure: valutiamo insieme come posso aiutarti, anche a domicilio.';
      } else render();
    });
    var rs = box.querySelector('.q2-restart');
    if (rs) rs.addEventListener('click', function () { cur = 0; yes = 0; body.style.display = ''; end.classList.remove('show'); render(); });
    render();
  })();

  /* Offerta: apre la card */
  (function () {
    var btn = document.getElementById('priceBtn'), card = document.getElementById('offerCard');
    if (!btn || !card) return;
    btn.addEventListener('click', function () {
      var open = card.hidden; card.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      if (open) { card.classList.remove('opening'); void card.offsetWidth; card.classList.add('opening'); setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80); }
    });
  })();

  /* Offerta: scadenza 14 giorni */
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
