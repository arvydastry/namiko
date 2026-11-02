# NAMIKO – naujo el. parduotuvės dizaino versija (XStore stilistika)

**Gyva peržiūra (GitHub Pages):** https://arvydastry.github.io/namiko/ · prekė: https://arvydastry.github.io/namiko/preke.html · pirkimas: https://arvydastry.github.io/namiko/pirkimas.html

**Hero variantai palyginimui:** https://arvydastry.github.io/namiko/hero-variantai.html (V1 XStore karuselė, V2 skonio pasirinkimas, V3 įkūrėjo nuotrauka) – failai `src/pages/hero-variantai.html`, `assets/css/hero-variants.css`, `assets/js/hero-variants.js`.

Statinis, naršyklėje atidaromas dizaino prototipas namiko.lt perdarymui. Trys puslapiai:

| Failas | Puslapis |
|---|---|
| `index.html` | Pagrindinis puslapis |
| `preke.html` | Prekės puslapis (Fermentuotas AVIŽŲ gėrimo koncentratas, 750 ml) |
| `pirkimas.html` | Supaprastintas vieno puslapio pirkimo procesas (checkout) |

Peržiūra: atidarykite `index.html` naršyklėje arba paleiskite lokalų serverį:

```bash
python3 -m http.server 8765
```

ir eikite į http://localhost:8765/ (serverio konfigūracija yra `.claude/launch.json`).

## Koncepcija

Esama svetainė (Astra + Elementor, pilkas hero, tamsiai žalia) neatsako į du klausimus per pirmas 3 sekundes: **kas parduodama** ir **kokia nauda pirkėjui**. Naujas dizainas:

1. **Hero – XStore karuselė (3 skaidrės):** 1) prekės ženklo žinutė, 2) rinkinys PRADEDANTIESIEMS 17 € vietoj 18 €, 3) avižų rinkinys 6× 49 € vietoj 54 €. Rodyklės, taškai, skaitiklis, automatinis keitimas kas 6 s (sustoja užvedus pelę ar paspaudus, išjungtas su `prefers-reduced-motion`). Pirma skaidrė iškart pasako: *fermentuoti gėrimų koncentratai su gyvomis gerosiomis bakterijomis*, nauda (šaukštelis prie kiekvieno valgio – virškinimui ir savijautai), kaina („nuo 9 €, užtenka ~1 mėn.“) ir du CTA: *Pirkti dabar* / *Kaip vartoti?*. Produkto nuotrauka baltame bloke ant lygaus žalsvo apskritimo su dviem plokščiomis etiketėmis („Be pridėtinio cukraus“, „Pagaminta Lietuvoje“) – be morfuojančių formų, stiklo efektų ar švytėjimų.
2. **Judanti privalumų juosta „Kodėl pirkti iš NAMIKO“** – tamsi juosta su stiklinėmis kortelėmis, kurios nepertraukiamai slenka (marquee, ~60 px/s, sustoja užvedus pelę ar fokusuojant, su `prefers-reduced-motion` tampa statine eilute). Kortelės: unikalus receptas nuo 2005 m., gaminama ūkyje Kaišiadorių r., perkant daugiau – pigiau, užsakymas per 1 minutę, prenumerata kas mėnesį, nemokamas pristatymas nuo 35 €. Techniškai: `.marquee` + `.marquee-track`, sąrašą JS dubliuoja (`aria-hidden`), greitis skaičiuojamas pagal plotį.
3. **Kaip tai veikia – 1-2-3** (suplakti → šaukštelis prie kiekvieno valgio → gerosios bakterijos dirba). Trys 4:5 nuotraukų kortelės iš Pexels su numeriu, stikliniu „chip“ (1 arbatinis šaukštelis / pusryčiai · pietūs · vakarienė / 1 buteliukas ≈ 1 mėnuo), hover priartinimu ir punktyrine jungtimi; mobiliame – kompaktiškos eilutės (nuotrauka kairėje, tekstas dešinėje). Nuotraukos `assets/img/how-1..3.jpg` (Pexels licencija, autoriai: Ksenia Chernaya, Elena Leya, olia danilevich – nuorodos žemiau).
4. **Populiariausi koncentratai** – XStore stiliaus prekių kortelės (ženkliukai, norų sąrašas/greita peržiūra ant hover, kaina + „≈ 0,30 €/dienai“, „Į krepšelį“).
5. **Dvi reklaminės juostos** – rinkinys PRADEDANTIESIEMS (17 € vietoj 18 €) ir avižų 6×0,75 l (49 € vietoj 54 €).
6. **Kodėl NAMIKO** – 6 argumentai + Ramūno nuotrauka su visa linija (nuotrauka iš namiko.lt).
7. **Rinkiniai** – 4 kortelės su kaina už buteliuką ir sutaupymu (duomenys iš namiko.lt).
8. **„Padovanok sveikatą artimajam“ – dovanų prenumerata.** Konfigūratorius: rinkinys (PRADEDANTIESIEMS 17 €, KLASIKA 25 €, ŠEIMAI 44 € per mėn.) + trukmė (3 / 6 / 12 mėn. su −5 / −10 / −15 % nuolaida) → kaina per mėnesį, nuolaida ir bendra suma; CTA veda į `pirkimas.html?gift=<rinkinys>&months=<n>`, kur santrauka rodo prenumeratos eilutę, o kontaktų kortelėje atsiranda „Dovanos gavėjas“ (vardas, telefonas, palinkėjimas kortelėje, pirmo siuntinio data).
9. **Atsiliepimai, DUK, naujienlaiškis, poraštė su rekvizitais.**

Prekės puslapis: galerija su miniatiūromis, kaina + „≈ 0,30 € per dieną“, 4 pagrindiniai argumentai, **kiekio pasirinkimas 1 / 3 / 6 buteliukai** (3× ir 6× – tikros rinkinių kainos 25 € ir 49 €), „Į krepšelį“ + „Pirkti dabar“ (tiesiai į apmokėjimą), pristatymo/grąžinimo blokas, „Dažnai perkama kartu“ (= rinkinys KLASIKA 25 €), skirtukai (aprašymas, sudėtis ir maistinė vertė, vartojimas ir laikymas, tyrimai, atsiliepimai), susijusios prekės, **lipni „į krepšelį“ juosta** slenkant žemyn.

Pirkimo procesas: **vienas puslapis, be registracijos** (svečio pirkimas), 3 žingsnių juosta (krepšelis → pristatymas ir apmokėjimas → patvirtinimas), kontaktai → pristatymo būdas (paštomatai / kurjeris / atsiėmimas; paštomato ar adreso laukai atsiranda tik pasirinkus) → apmokėjimas (el. bankininkystė / kortelė / pavedimas). Dešinėje – užsakymo santrauka su kiekių keitimu, **nemokamo pristatymo progreso juosta** („Iki nemokamo pristatymo trūksta X €“), nuolaidos kodas (sutrauktas), sumos ir pagalbos kontaktai. Pateikus formą rodomas 3 žingsnis „Užsakymas priimtas“ su patarimais, ką daryti gavus siuntą.

## Dizaino sistema

- **Šriftas:** Hanken Grotesk (atviras HK Grotesk atitikmuo – tas pats, kurį naudoja XStore demo). Google Fonts.
- **Spalvos:** `--ink #171A17` (tekstas, tamsūs XStore mygtukai), `--green #3E7A3A` (prekės ženklo žalia – kitokia nei dabartinė #0E6E0E), `--honey #E8A921` (medaus akcentas), `--cream #F7F3EB` (šiltos sekcijos), `--sale #D23F31` (akcijų ženkliukai).
- **Mygtukai:** XStore stiliaus – kvadratiški (4 px), uppercase, 0.1em tarpai; pagrindinis – žalias, antrinis – tamsus/kontūrinis.
- **Komponentai:** viršutinė promo juosta, antraštė su paieška ir kategorijų pasirinkimu, ikonos (paskyra / norų sąrašas / krepšelis su skaitikliu ir suma), meniu su HOT ženkleliu, prekių kortelės, ženkliukai, features juosta, lipni add-to-cart juosta, 3 žingsnių checkout juosta.
- **Flat, XStore principai:** be gradientų, švytėjimų ir permatomų (glass) paviršių; kampų spinduliai tik 3 / 8 / 12 px; šešėliai tik ant nuotraukų ir hover būsenose; vientisa balta lipni antraštė; sekcijų antraštės centruotos, po tinkleliais – kontūrinis „Visos prekės“ mygtukas.
- **Judesys:** švelnūs „reveal“ efektai slenkant, judanti privalumų juosta, nuotraukų priartinimas hover metu. Viskas išjungiama su `prefers-reduced-motion`.
- Mobilioji versija: patikrinta 375 px pločiu (be horizontalaus slinkimo), hamburger meniu, lipnus „Pirkti dabar“ CTA.
- Pixel-perfect patikra (1400 px): prekių kortelių ir rinkinių mygtukai eilutėse lygiuoja 0 px nuokrypiu, atsiliepimų ir juostos kortelės vienodo aukščio, mygtukų aukščiai tik 40 / 48 / 56 px, h2 dydis vienodas visose sekcijose.

## Struktūra

```
namiko/
├── index.html, preke.html, pirkimas.html   ← sugeneruoti puslapiai (deliverable)
├── assets/css/style.css                    ← visa dizaino sistema (CSS kintamieji viršuje)
├── assets/js/main.js                       ← meniu, demo krepšelis, skirtukai, galerija, lipni juosta, checkout skaičiavimai
├── assets/img/                             ← prekių nuotraukos ir logotipas iš namiko.lt
├── src/pages/*.html                        ← puslapių šaltiniai su {{sprite}} {{header}} {{footer}} žymomis
├── src/partials/*.html                     ← bendros dalys (ikonų sprite, antraštė, poraštė)
├── build.py                                ← `python3 build.py` sujungia src → šakninius .html
└── screenshots/                            ← desktop ir mobile ekrano nuotraukos
```

Redaguojant antraštę ar poraštę keiskite `src/partials/` ir paleiskite `python3 build.py`.

## Demo duomenys, kuriuos reikia pakeisti tikrais

- Įvertinimai ir atsiliepimų skaičiai (4,9 / 5, „120+ atsiliepimų“, „(37)“ prie prekių) – pažymėti HTML komentarais `DEMO DUOMENYS`.
- Atsiliepimų citatos – sutrumpintos ištraukos iš namiko.lt „Atsiliepimai“; vardai sutrumpinti.
- Pristatymo kainos ir terminai (2,99 € / 4,99 €, 1–2 d. d.) ir paštomatų sąrašas – pavyzdiniai.
- Užsakymo numeris patvirtinimo žingsnyje, bankų sąrašas prie el. bankininkystės.
- Dovanų prenumerata: nuolaidos 5 / 10 / 15 % pagal trukmę ir „apmokėjimas iš karto už visą laikotarpį“ – pasiūlymas, sąlygas reikia nuspręsti (WooCommerce Subscriptions arba All Products for Subscriptions; XStore su jais suderinamas).
- Krepšelis veikia tik kaip demonstracija (localStorage), paieška ir nuorodos „Paskyra“, „Prisijungti“, taisyklės – be funkcijos.

Prekių pavadinimai, kainos, akcijos, rinkinių sudėtis, maistinė vertė, sudėtis, vartojimo ir laikymo instrukcijos, rekvizitai – tikri, paimti iš namiko.lt (2026-11-02).

## Perkėlimas į XStore (WooCommerce)

- Antraštė: XStore Header Builder – top bar (promo + telefonas), logo + paieška su kategorijomis + ikonos, meniu su „HOT“ label.
- Pagrindinis: Elementor + XStore elementai (Banner, Products grid „Best sellers“, Features/Icon box, Testimonials, FAQ accordion).
- Prekės puslapis: XStore Single Product Builder – galerija kairėje (vertikalios miniatiūros), kiekio pasirinkimą 1/3/6 realizuoti kaip Grouped/variable produktą arba „Bundles“ įskiepį, „Sticky add to cart“ įjungti Theme Options → Single Product.
- Checkout: XStore Checkout Builder – one-page layout, svečio pirkimas, „Free shipping progress bar“ (XStore Sales Booster), paštomatų įskiepiai (Omniva/LP Express).

## Pexels nuotraukos (licencija leidžia naudoti nemokamai, autoriaus nurodymas – geroji praktika)

| Failas | Autorius | Šaltinis |
|---|---|---|
| `assets/img/how-1.jpg` | Ksenia Chernaya | https://www.pexels.com/photo/photo-of-person-holding-spoon-4048706/ |
| `assets/img/how-2.jpg` | Elena Leya | https://www.pexels.com/photo/food-on-yellow-and-red-bowl-9568317/ |
| `assets/img/how-3.jpg` | olia danilevich | https://www.pexels.com/photo/a-woman-holding-a-water-with-lemon-9004761/ |

Alternatyvos, jei norėsite keisti: 5947086 (pilamas baltas gėrimas iš buteliuko į stiklinę), 12788320 (šeimos pusryčiai), 7530825 (besišypsanti vyresnė moteris su stikline).

