# Nastavitev aplikacije, korak za korakom

Ta navodila so za ljudi, ki niso programerji. Večino dela opravi Claude. Ti ustvariš račune,
potrdiš prijave in prilepiš ključe, ki jih želiš uporabiti. Do delujoče aplikacije na tvojem
računalniku traja okoli 30 minut, objava na internetu pa še 15.

## Kako začneš

1. Odpri **Claude Code** v mapi, kamor želiš aplikacijo (na primer `Dokumenti/moja-aplikacija`).
2. Če aplikacije še nimaš, napiši:
   > Ustvari mi zasebno kopijo predloge LukaLeskovsek/saas-starter in jo odpri.
3. Ko si v mapi aplikacije, napiši:
   > Nastavi mi aplikacijo.

Claude najprej preveri, kaj je že narejeno, in začne pri prvem koraku, ki manjka. Če prekineš, se
kasneje vrneš z »nadaljuj nastavitev«.

## Kaj potrebuješ

| Kaj | Zakaj | Cena |
|---|---|---|
| Računalnik z macOS ali Windows | tu teče aplikacija med razvojem | – |
| Claude Code (naročnina Claude) | gradi in nastavlja aplikacijo | tvoja naročnina |
| Račun **GitHub** | tvoja zasebna kopija kode | brezplačno |
| Račun **Supabase** | baza in prijava uporabnikov | brezplačni paket zadošča |
| Račun **Vercel** (neobvezno) | aplikacija na internetu | brezplačni paket zadošča |
| **OpenRouter**, **Resend**, **Sentry** (neobvezno) | umetna inteligenca, e-pošta, spremljanje napak | AI po porabi, z omejitvijo; ostalo brezplačno za začetek |
| Upravljalnik gesel (npr. 1Password, Bitwarden ali tisti v brskalniku) | tja shraniš geslo baze | – |

## Zlato pravilo za ključe

Ključ je kot geslo. **Nikoli ga ne prilepi v klepet s Claudom.** Claude ti odpre pravo stran in
datoteko `.env.local` v urejevalniku. Ti ključ kopiraš s strani in ga prilepiš v datoteko, shraniš
in zapreš. Claude nato preveri samo, ali je ključ na pravem mestu (z ukazom `npm run env:check`),
vrednosti pa nikoli ne vidi.

Za osnovno delovanje aplikacije skrivnega ključa sploh ne potrebuješ: naslov in javni ključ
Supabase vpiše Claude sam.

Če ključ po pomoti prilepiš v klepet, ga v nadzorni plošči ponudnika zamenjaj z novim.

## Koraki

Pri vsakem koraku piše, kaj naredi Claude in kaj ti.

### 1. Orodja na računalniku
- **Claude** preveri, ali imaš Node 22, git in GitHub CLI. Česar ni, ti odpre stran za prenos.
- **Ti** namestiš, kar manjka, in se prijaviš v GitHub. Claude ti pove, kaj napisati
  (`! gh auth login --web`), prijavo pa potrdiš v brskalniku.

### 2. Tvoja zasebna kopija na GitHubu
- **Claude** ustvari zasebni repozitorij iz predloge in ga poveže s tvojo mapo.
- **Ti** izbereš ime.

### 3. Supabase: projekt in povezava s Claudom
- **Ti** v brskalniku ustvariš projekt:
  - ime izbereš sam;
  - regija: **Central EU (Frankfurt)**;
  - geslo baze shraniš v upravljalnik gesel, ne pošlješ ga Claudu.
- Za vsako aplikacijo uporabi svoj projekt Supabase. Če imaš na delavnici še internal-os, ima ta svoj
  projekt.
- **Claude** poveže Supabase s seboj, vendar samo za ta en projekt.
- **Ti** zapreš in znova odpreš Claude Code, napišeš `/mcp`, izbereš **supabase → Authenticate** in
  potrdiš v brskalniku. Nato napišeš »nadaljuj nastavitev«.

### 4. Ključi v `.env.local`
- **Claude** sam vpiše naslov projekta in javni ključ ter preveri, da je vse na mestu.

### 5. Nastavitve prijave
- **Claude** odpre dve strani v Supabase.
- **Ti** pri **Email** izklopiš **Confirm email** in shraniš. Tako je nov uporabnik po registraciji
  takoj prijavljen.
- **Ti** pri **URL Configuration** vpišeš **Site URL** `http://localhost:3000` in pri
  **Redirect URLs** dodaš `http://localhost:3000/**`. To potrebuje povezava za pozabljeno geslo.

### 6. Baza
- **Claude** pripravi tabele. Najprej preveri, kaj je že narejeno, in nič ne ponovi dvakrat.

### 7. Zagon in tvoj prvi račun
- **Claude** zažene aplikacijo na `http://localhost:3000`.
- **Ti** klikneš **Začni**, ustvariš račun (e-pošta in geslo) in prideš na nadzorno ploščo.

### 8. Dodatne storitve (neobvezno)
Vsako lahko dodaš tudi kasneje.
- **Umetna inteligenca:**
  - brez ključa dobiš demo odgovore;
  - za pravo AI ti Claude odpre OpenRouter, ti ustvariš ključ **z omejitvijo porabe** (npr. 5 USD)
    in ga prilepiš v `.env.local`.
- **E-pošta (Resend):** potrditve zahtevkov po e-pošti. Ključ prilepiš v `.env.local`. Dokler ne
  potrdiš svoje domene, pošta prihaja samo na tvoj naslov.
- **Spremljanje napak (Sentry):** napake na živi strani vidiš v Sentryju. Naslov (DSN) je javen in
  ga Claude lahko vpiše sam.

### 9. Na internet (neobvezno)
- **Ti** se z GitHubom prijaviš v Vercel in uvoziš svoj repozitorij. Potem napišeš
  `! npx vercel login`.
- **Claude** poveže mapo s projektom, poišče pravi živi naslov in prenese ključe na Vercel, ne da
  bi jih pokazal.
- **Ti** klikneš **Redeploy**. V Supabase (stran iz 5. koraka) zamenjaš **Site URL** z živim
  naslovom in dodaš živi naslov med **Redirect URLs**. Če živa stran zahteva prijavo v Vercel,
  izklopiš **Vercel Authentication** (Claude ti odpre stran).
- Prijaviš se z istim računom kot doma, saj si aplikaciji delita isto bazo.

### 10. Tvoj profil (neobvezno)
- Če imaš mapo s profilom (PERSON.md, COMPANY.md, BRAND.md …), Claude zapiše, kje je. Odslej
  piše v tvojem jeziku in slogu.

## Ko je vse nastavljeno

- **Prilagodi stran:** povej Claudu, na primer »prilagodi domačo stran mojemu podjetju«. Claude
  uporabi tvoj profil, ime in barve.
- **Tvoja funkcija:** povej, kaj potrebuješ. Claude najprej naredi kratek plan in nato po primeru
  zahtevkov zgradi tvojo.

## Ko se zatakne

| Kaj vidiš | Kaj narediš |
|---|---|
| Po registraciji piše »Odpri e-pošto in potrdi naslov« | »Confirm email« je še vklopljen (5. korak). Izklopi ga ali potrdi e-pošto. |
| »Napačen e-poštni naslov ali geslo« | Preveri geslo ali uporabi »Pozabljeno geslo?«. |
| Povezava za pozabljeno geslo javi, da ni veljavna | Odpri najnovejšo povezavo v istem brskalniku. Preveri Redirect URLs (5. korak). |
| AI vrača »Demo odgovor« | Ključa OpenRouter ni ali je napačen. Reci »preveri ključe«. |
| Živa stran zahteva prijavo v Vercel | Izklopi Vercel Authentication (9. korak). |
| Na naslovu brez pripone je čisto druga stran | Ta naslov ni tvoj. Pravi naslov je v Vercel → Settings → Domains. |
| Karkoli drugega | Opiši, kaj si naredil in kaj vidiš. Claude to razišče korak za korakom. |

Za tehnične podrobnosti glej `README.md`, `docs/architecture.md` in `docs/security.md`.
