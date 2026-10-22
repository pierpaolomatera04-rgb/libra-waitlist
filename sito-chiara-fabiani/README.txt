SITO DOTT.SSA CHIARA FABIANI — Pronto per Cloudflare Pages
==========================================================

Struttura cartella:
  index.html        -> la homepage
  privacy.html      -> informativa privacy e cookie
  css/style.css     -> grafica
  js/main.js        -> animazioni, quiz, mappa
  assets/           -> foto, favicon, immagine social (og)
  favicon.ico

PUBBLICARE SU CLOUDFLARE PAGES (senza Git):
  1. dash.cloudflare.com -> Workers & Pages -> Create -> Pages -> "Upload assets".
  2. Trascina TUTTO il contenuto di questa cartella (non la cartella stessa:
     index.html deve stare alla radice del progetto).
  3. Dai un nome al progetto e clicca Deploy.
  4. Dominio personalizzato: nel progetto -> Custom domains.

DA PERSONALIZZARE / CONFERMARE (cerca i commenti "DA CONFERMARE/COMPLETARE"):
  - Indirizzo completo dello studio (numero civico e CAP) in index.html e privacy.html
  - P.IVA nel footer e nella privacy
  - Mappa: l'embed usa "Via Cesare Beccaria, Roma"; se serve il punto esatto,
    sostituisci data-src del blocco #mapWrap in index.html
  - Email (se la vuoi mostrare)

NOTA: la sezione "Proposta / Scopri il prezzo" in fondo è l'anteprima commerciale
(iltuositofacile.com). Va rimossa quando il sito diventa definitivo per la cliente.
