# Linee guida siti — iltuositofacile.com

Template di riferimento per i siti vetrina dei professionisti (anteprime vendute).
Ricavato dal sito "Dott.ssa Francesca Farroni". **Leggere questo file a inizio sessione.**

## Struttura file (NON single-file: cartella multi-file)
```
index.html
privacy.html          (noindex)
css/style.css
js/main.js
assets/               ritratto.jpg, og.jpg (1200x630), favicon-48.png,
                      apple-touch-icon.png (180), icon-512.png
favicon.ico
```
Pubblicazione su **Cloudflare Pages** (Upload assets): il contenuto della cartella
va alla radice, con `index.html` in root.

## Stile
- Font: **Instrument Serif** (titoli, con `<em>` in colore accento), **Literata**
  (testo), **Inter** (interfaccia/UI). Caricati da Google Fonts.
- Palette calda/professionale (token in `:root`): cream, blush, rose, rose-deep,
  plum, plum-2, sage, ink. Si adatta per colore ma si mantiene l'impianto.
- Titoli grandi serif, `.label` con occhiello ad amaca, `<mark>` evidenziato animato.
- Tono: caldo, rassicurante, niente marketing aggressivo. **Niente trattini lunghi
  (— / –) nei testi visibili**: usare virgole/punti.

## Sezioni (ordine tipico)
1. Header sticky (monogramma iniziali + nome + nav + CTA "Prenota"); si nasconde
   scorrendo giù, riappare salendo.
2. Hero: kicker, h1 con `<em>`, linea decorativa animata, sottotitolo con `<mark>`,
   2 CTA, foto ritratto con figcaption.
3. Facts strip (4 dati chiave su sfondo scuro).
4. **Quiz "Vero o falso?"** a mazzo di carte (3 domande + risultato), punteggio,
   CTA WhatsApp. Domande a tema, corrette e non diagnostiche.
5. Sezione illustrata che spiega il "concetto" del professionista (SVG animato).
6. Chi sono (sfondo blush, capolettera `.drop`, firma serif corsivo).
7. Aree di intervento (card con `.area-dot`).
8. Citazione (quote-band). NON inventare recensioni se non esistono.
9. Percorso in 4 step "appesi" alla linea.
10. (eventuale) sezione principi/come lavoro.
11. FAQ (`<details>`).
12. Chiusura "il respiro" (cerchio che respira) + CTA.
13. Contatti: info + mappa **lazy-load** (si carica solo al clic, cookie-friendly).
14. **Proposta/anteprima commerciale** (`#proposta`): prezzo lancio 250€ (da 500€),
    regalo scheda Google + link recensioni, scadenza 14 giorni (salvata in
    localStorage). WhatsApp verso **Pier 331 468 3568 / wa.me/393314683568**,
    messaggio con il nome della professionista. "Da togliere quando definitivo".
15. Footer con credito "Sito realizzato da iltuositofacile.com".
16. Pulsante WhatsApp flottante tondo (numero della professionista).

## Meccaniche JS (js/main.js)
- Menu mobile, header hide/show allo scroll, anno dinamico.
- Reveal allo scroll (IntersectionObserver, una volta sola), `<mark>` animato.
- Linea hero animata; SVG sezione illustrata animato.
- Quiz a carte con flip, punteggio, coriandoli, restart.
- Mappa caricata al clic (`#mapWrap[data-src]`).
- Proposta: "Scopri il prezzo" apre la card; countdown 14 giorni in localStorage.

## Marcatori da lasciare come promemoria
Commenti `<!-- DA CONFERMARE ... -->` / `DA COMPLETARE` per: indirizzo completo,
P.IVA, n. iscrizione Albo, email, coordinate mappa, seconde sedi.

## Dati committente (iltuositofacile.com)
- Contatto commerciale: **Pier — 331 468 3568 — wa.me/393314683568**.
