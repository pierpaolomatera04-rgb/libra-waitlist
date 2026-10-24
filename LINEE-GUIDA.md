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

## ⚠️ Regola d'oro: cambiare stile OGNI volta
Le linee guida sono **struttura e meccaniche** (vedi sotto), NON l'aspetto.
Ogni sito deve avere un **look diverso**: palette, coppia di font, forme/accenti e
metafora decorativa vanno cambiati in base al mestiere, così i siti non sembrano
tutti uguali. **Non basta cambiare palette e font**: vanno cambiati anche **layout, struttura,
ordine delle sezioni e componenti**. No agli stessi riquadri ovunque: dare un
tocco moderno e dinamico (gradienti, chip, timeline, animazioni leggere, hero
diversi). Il **quiz può stare anche in alto** (subito dopo l'hero) se rende meglio.
Esempi già fatti (da NON ricopiare uguali):
- Psicologa (Chiara Fabiani): Instrument Serif + Literata, prugna/cipria/salvia,
  hero testo+foto, amaca, cerchio che respira.
- Nail salon (Senena Nails): Syne + Inter, avorio/inchiostro/malva, hero centrato
  con striscia foto, marquee, listino, testimonianze a rotazione.
- Fisioterapista domiciliare (Federico Rafael Rossi): Sora + Inter, blu/teal/verde,
  niente foto (icone e pannelli gradiente), quiz self-check in alto, trattamenti a
  icone, step con linea, chip, zone. Recensioni Google reali.
- Casa vacanze (La Casa di Campagna, Scandriglia): Fraunces + Inter, verde bosco/
  crema/terracotta, intro animata del nome, galleria, calcolatore date→prezzo→
  WhatsApp, banner offerta. Niente quiz: l'elemento interattivo è il calcolatore.

**L'elemento interattivo varia col mestiere**: quiz "vero o falso", self-check,
calcolatore prezzo/preventivo, configuratore… non per forza sempre il quiz.

## Stile (impianto, da reinterpretare ogni volta)
- Font: **Instrument Serif** (titoli, con `<em>` in colore accento), **Literata**
  (testo), **Inter** (interfaccia/UI). Caricati da Google Fonts.
- Palette calda/professionale (token in `:root`): cream, blush, rose, rose-deep,
  plum, plum-2, sage, ink. Si adatta per colore ma si mantiene l'impianto.
- Titoli grandi serif, `.label` con occhiello ad amaca, `<mark>` evidenziato animato.
- Tono: caldo, rassicurante, niente marketing aggressivo. **Niente trattini lunghi
  (— / –) nei testi visibili**: usare virgole/punti.

## Intro animata d'apertura (da QUESTO sito in poi, su tutti)
All'apertura il sito mostra una breve **animazione del nome/logo dell'attività**
(stile "N" di Netflix): il nome/monogramma appare/si anima a schermo pieno su
sfondo in tinta col sito, poi l'overlay si dissolve e compare la homepage.
- Durata ~1,5-2,5s, poi fade-out automatico; skippabile al clic/tap o allo scroll.
- Si mostra una sola volta per sessione (salvare un flag in sessionStorage, con
  try/catch) così non si ripete a ogni navigazione.
- Rispettare `prefers-reduced-motion`: in quel caso niente animazione, overlay via
  subito.
- L'animazione va reinterpretata ogni volta in base allo stile del sito (lettere
  che si compongono, logo che si disegna, zoom, ecc.), non sempre identica.

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
