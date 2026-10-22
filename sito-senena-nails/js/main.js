/* ═══════════════════════════════════════
   Senena Nails · main.js
   ═══════════════════════════════════════ */
(function () {
  'use strict';
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* Menu mobile */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('topnav');
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
  var bar = document.getElementById('topbar');
  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    bar.classList.toggle('scrolled', y > 20);
    if (y > lastY && y > 160 && !nav.classList.contains('open')) bar.classList.add('hide');
    else if (y < lastY - 4 || y < 160) bar.classList.remove('hide');
    lastY = y;
  }, { passive: true });

  /* Anno */
  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

  /* Reveal allo scroll */
  var rev = all('.rev');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    rev.forEach(function (el) { io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('in'); }); }

  /* Mappa al clic */
  var mapBtn = document.getElementById('mapLoad');
  if (mapBtn) mapBtn.addEventListener('click', function () {
    var w = document.getElementById('mapWrap');
    w.innerHTML = '<iframe src="' + w.dataset.src + '" title="Mappa Senena Nails" loading="lazy" allowfullscreen></iframe>';
  });

  /* Testimonianze a rotazione */
  (function () {
    var box = document.getElementById('testi'); if (!box) return;
    var data = [
      { t: 'Davvero super efficiente e gentile. Unghie semipermanente fatte con cura e attenzione ai dettagli. Consiglio.', a: 'Benedetta Macagno · Google' },
      { t: 'Gentilezza, professionalità e ottimi prodotti… quindi risultati eccellenti!!', a: 'Laura M. · Google' },
      { t: 'Super Serena, veloce, brava e sempre disponibile.', a: 'Francesca · Google' }
    ];
    var q = box.querySelector('blockquote'), c = box.querySelector('cite'), dots = box.querySelector('.testi-dots');
    var i = 0, timer;
    data.forEach(function (_, n) {
      var b = document.createElement('button'); b.setAttribute('aria-label', 'Recensione ' + (n + 1));
      if (n === 0) b.classList.add('on');
      b.addEventListener('click', function () { show(n); reset(); });
      dots.appendChild(b);
    });
    function show(n) {
      i = n; q.style.opacity = 0;
      setTimeout(function () {
        q.textContent = '"' + data[n].t + '"'; c.textContent = data[n].a; q.style.opacity = 1;
        Array.prototype.slice.call(dots.children).forEach(function (d, k) { d.classList.toggle('on', k === n); });
      }, 200);
    }
    function reset() { clearInterval(timer); timer = setInterval(function () { show((i + 1) % data.length); }, 5000); }
    show(0); reset();
  })();

  /* Quiz compatto */
  (function () {
    var box = document.getElementById('quiz2'); if (!box) return;
    var qs = [
      { q: 'Il semipermanente rovina le unghie?', a: 'no', e: 'Applicato e rimosso nel modo giusto, da mani esperte, non rovina l’unghia. I danni nascono quasi sempre dalle rimozioni fai-da-te.' },
      { q: 'Le cuticole vanno sempre tagliate via?', a: 'no', e: 'Meglio spingerle con delicatezza e idratarle. Tagliarle in modo aggressivo può irritare e indebolire la zona.' },
      { q: 'Le unghie devono "respirare" tra un semipermanente e l’altro?', a: 'no', e: 'Le unghie non respirano: non prendono ossigeno dall’aria. Con una corretta cura non servono pause obbligate.' }
    ];
    var qEl = box.querySelector('.q2-q'), opts = box.querySelector('.q2-opts'), fb = box.querySelector('.q2-fb'),
        bar = box.querySelector('.q2-bar i'), step = box.querySelector('.q2-step'), body = box.querySelector('.q2-body'), end = box.querySelector('.q2-end');
    var cur = 0, score = 0;
    function render() {
      qEl.textContent = qs[cur].q;
      step.textContent = 'Domanda ' + (cur + 1) + ' di ' + qs.length;
      bar.style.width = ((cur) / qs.length * 100) + '%';
      fb.classList.remove('show'); opts.style.display = 'grid';
    }
    opts.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var ok = b.dataset.choice === qs[cur].a; if (ok) score++;
        fb.querySelector('.q2-verdict').className = 'q2-verdict ' + (ok ? 'ok' : 'ko');
        fb.querySelector('.q2-verdict').textContent = ok ? '✓ Esatto' : 'Non proprio: la risposta è «Falso»';
        fb.querySelector('.q2-expl').textContent = qs[cur].e;
        opts.style.display = 'none'; fb.classList.add('show');
        bar.style.width = ((cur + 1) / qs.length * 100) + '%';
      });
    });
    fb.querySelector('.q2-next').addEventListener('click', function () {
      cur++;
      if (cur >= qs.length) { body.style.display = 'none'; end.classList.add('show'); box.querySelector('.q2-score').textContent = score + '/' + qs.length; }
      else render();
    });
    var rs = box.querySelector('.q2-restart');
    if (rs) rs.addEventListener('click', function () { cur = 0; score = 0; body.style.display = ''; end.classList.remove('show'); render(); });
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
