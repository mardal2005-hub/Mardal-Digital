# Mardal Digital — studio

Porteføljen og salgsverktøyet til **Mardal Digital**, et lite digitalt designstudio.
Siden er selve beviset på arbeidet: en egen, distinkt visuell identitet som bevisst
skiller seg fra kundeprosjektene.

Bygget som en statisk side (HTML, CSS, litt vanilla JavaScript) — ingen rammeverk,
ingen byggeprosess. Rask, enkel å hoste, enkel å utvide.

## Design & identitet

- **Palett:** kald near-black (`#0A0B0D`) med lagdelte gråtoner (`#141519`, `#1B1D22`,
  `#24262C`) for dybde, varm off-white (`#F2F0EA`) og lys grå (`#A9ABB2`) tekst.
  Én dempet kald-blå aksent (`#5B79E6`) brukt svært sparsomt — nummerering,
  hårstreker, hover og enkelte detaljer. Ingen oransje/beige, ingen gradienter.
- **Typografi som identitet:** `Space Grotesk` (display + små uppercase-labels) +
  `Inter` (brødtekst). Ekstremt store overskrifter, tight tracking, nummerering.
- **Hero:** `MARDAL` i solid off-white over `DIGITAL` som outline — kontrast via
  tone, ikke farge — med metadata forankret asymmetrisk i hjørnene.
- **Layout:** 12-kolonners editorial rutenett, asymmetri, vertikale hårstreker,
  mye whitespace, overlappende mockups.
- **Struktur:** `01 Intro → 02 Selected Work → 03 Tjenester → 04 Prosess →
  05 Om → 06 Kontakt`.
- **Interaksjon:** minimal custom cursor, kort preloader, reveal-on-scroll, subtil
  parallax, live Oslo-klokke — alt bak `prefers-reduced-motion`.
- **MD-monogram:** logo, favicon og grafisk element.

## Struktur

```
.
├── index.html          # Hele siden (hero, arbeid, capabilities, approach, om, kontakt)
├── personvern.html     # Personvernerklæring i samme stil
├── css/styles.css      # Designsystemet
├── js/main.js          # Cursor, reveal, parallax, meny, klokke
├── assets/img/         # MD-favicon, og-image, Førre Bygg-mockups (SVG)
├── robots.txt · sitemap.xml · CNAME · .nojekyll
```

## Kjøre lokalt

```bash
python3 -m http.server 8000   # åpne http://localhost:8000
```

## Portefølje — legge til nye prosjekter

Porteføljen er laget for å skaleres: ett prosjekt kan stå stort og imponerende,
og nye legges til uten at siden ser tom ut i mellomtiden.

- **Stor case:** dupliser `<article class="case">` i `#work` og bytt ut tittel, meta,
  bilder (`assets/img/…`) og tekst.
- **Kommende:** radene i `.work-list` (`02`, `03`, …) er plassholdere som fylles inn
  etter hvert som nye kunder kommer til. Ingen falske prosjekter.

## Ting som skal fylles inn

| Hva | Hvor |
|-----|------|
| Domene | `CNAME`, meta i `index.html`, `robots.txt`, `sitemap.xml` (satt til `mardaldigital.no` — endre ved behov) |
| E-post | `hei@mardaldigital.no` i `index.html` / `personvern.html` |
| Sosiale lenker | `href="#"` i kontaktseksjonen (`class="socials"`) |
| Førre Bygg-bilder | SVG-mockups i `assets/img/` kan byttes med ekte skjermbilder |

## Publisere

Statisk side med gratis HTTPS: GitHub Pages (`.nojekyll` er med), Netlify, Vercel
eller Cloudflare Pages.
