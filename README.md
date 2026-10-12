# SaaS Starter

Začetna aplikacija, ki jo narediš za svojo: predstavitvena stran v tvojem imenu, delujoča prijava in ena funkcija, do kosila na internetu. Vse, kar je pomembno za varnost (prijava, e-pošta, spremljanje napak), je že povezano z zunanjimi storitvami, zato se ukvarjaš s svojim izdelkom.

Ni ti treba biti programer. Odpri Claude Code v mapi aplikacije in napiši **»Nastavi mi aplikacijo«**. Claude te vodi korak za korakom, navodila za ljudi pa so v [docs/nastavitev.md](docs/nastavitev.md). Ukazov, ki se začnejo s poševnico (`/nastavitev`, `/plan` …), ti ni treba tipkati: Claude jih izbere sam, ko poveš, kaj želiš.

Uporabljaš svoje brezplačne račune GitHub, Supabase in Vercel. AI, e-pošto in spremljanje napak dodaš, ko jih potrebuješ.

## Kaj dobiš

| Del | Kaj pokaže |
|---|---|
| **Domača stran** (`app/(marketing)/page.tsx`) | Predstavitvena stran, ki jo prilagodiš svojemu podjetju. Ime in stavek sta v `config/brand.ts`, barve v `app/globals.css`. |
| **Prijava** (`/login`) | Registracija in prijava z e-pošto in geslom, pozabljeno geslo in nastavitev novega gesla. |
| **Nadzorna plošča** (`/dashboard`) | Stran po prijavi, z gumbom za testno napako v Sentryju. |
| **Zahtevki** (`/feature`) | Primer funkcije z AI: obrazec zapiše zahtevek v tabelo, AI ga razvrsti in predlaga odgovor, seznam pokaže samo tvoje zahtevke. Po tem vzoru zgradiš svojo funkcijo. |

Vsaka tabela ima RLS: pravila v bazi, ki vsakemu uporabniku pokažejo samo njegove podatke.

## Kaj narediš naprej

1. **Prilagodi stran.** Reci Claudu »prilagodi domačo stran mojemu podjetju«. Uporabi tvoj profil (PERSON.md, COMPANY.md, BRAND.md), če ga imaš.
2. **Zgradi svojo funkcijo.** Povej, kaj potrebuješ. Claude najprej naredi kratek plan, nato zahtevke zamenja s tvojo funkcijo in ohrani njihovo obliko (obrazec, tabela, seznam).
3. **Objavi.** Reci »daj v živo«. Claude preveri, da vse deluje, in objavi na Vercelu.

---

## Podrobnosti za delo v terminalu

`/nastavitev` vse to naredi s teboj. Spodaj so isti koraki za tiste, ki raje delajo v terminalu.

Aplikacija teče na Next.js 15, Supabase (prijava in baza z RLS), Resend (e-pošta), Sentry (napake) in Vercel (gostovanje).

### 1. Koda v tvojem repozitoriju

Na GitHubu klikni **»Use this template« → Create a new repository** in ga nastavi kot **Private**. To je tvoja kopija, kamor pošiljaš spremembe, in hrani tvojo aplikacijo *ter njeno zgodovino*. Nato:

```bash
git clone https://github.com/<your-username>/saas-starter.git
cd saas-starter
npm ci
```

Ali z enim ukazom: `gh repo create <name> --template LukaLeskovsek/saas-starter --private --clone`.
Izvor predloge: https://github.com/LukaLeskovsek/saas-starter
Git ti je nov? Trije varni ukazi in eno pravilo: [docs/git-basics.md](docs/git-basics.md).

### 2. Projekt Supabase

- Na supabase.com izberi **New project** (regija v EU, geslo baze shrani v upravljalnik gesel). Vsaka aplikacija potrebuje svoj projekt.
- V **Authentication → Sign In / Providers → Email** izklopi **Confirm email**. Prijava potem deluje takoj, brez e-pošte. Če ostane vklopljen, aplikacija po registraciji prosi za potrditev po e-pošti.
- V **Authentication → URL Configuration** nastavi Site URL `http://localhost:3000` in Redirect URLs `http://localhost:3000/**`. Živi naslov dodaš kasneje.
- S tem projektom poveži **Supabase MCP**, da Claude prebere naslov in javni ključ ter požene migracije (prijava OAuth, brez dostopnega žetona):
  `claude mcp add --transport http --scope local supabase "https://mcp.supabase.com/mcp?project_ref=<ref>&features=database,development,docs,debugging"`,
  nato `/mcp` → supabase → Authenticate.

### 3. Ključi in baza

```bash
cp .env.example .env.local
```

Izpolni Supabase URL in javni (anon) ključ. Skrivnega ključa Supabase ta aplikacija ne potrebuje. `npm run env:check` pokaže, kateri ključi so izpolnjeni in pravilne oblike, ne da bi jih izpisal. `OPENROUTER_API_KEY`, `RESEND_API_KEY` in `NEXT_PUBLIC_SENTRY_DSN` lahko ostanejo prazni: AI potem vrača demo odgovore, e-pošta se ne pošlje.

Nato Claudu reci **»pripravi bazo«**. Seznam migracij po vrsti dobiš z ukazom:

```bash
npm run db:list          # 0001_init, 0002_ai, 0003_ai_usage
```

Claude prek Supabase MCP (`apply_migration`) požene vsako datoteko, ki še ni bila pognana, pred tem pa za vsako preveri njeno kontrolno tabelo. Brez MCP isto naredi `npm run db:run -- <file>` z `SUPABASE_ACCESS_TOKEN` (supabase.com → Account → Access Tokens).

### 4. Zagon

```bash
npm run dev
```

Odpri http://localhost:3000. Klikni **Začni**, ustvari račun in prideš na nadzorno ploščo.

### 5. Prilagoditev

Ime in stavek v `config/brand.ts`, barve (`--brand`, `--neutral-hue`, `--radius`) na vrhu `app/globals.css`, pisava v `app/layout.tsx`. Prijave in `lib/` ne spreminjaj. Pravila za Clauda so v `CLAUDE.md`.

### 6. Objava na Vercelu

Uvozi repozitorij na vercel.com/new, nato:

```bash
npx vercel login && npx vercel link
npm run vercel:env -- --site-url https://<project>.vercel.app   # --dry-run najprej izpiše seznam ključev
```

Pravi živi naslov preveri v Vercel → **Settings → Domains**. Ko je ime že zasedeno, Vercel doda pripono, naslov brez nje pa ni tvoj. Ponovno objavi (Redeploy), živi naslov dodaj v Supabase **URL Configuration** in izklopi **Vercel Authentication** (Settings → Deployment Protection), če živa stran zahteva prijavo v Vercel. Od takrat vsak push na `main` objavi novo različico.

Več o domenah in predogledih: [docs/going-to-production.md](docs/going-to-production.md).

## Skripte

- `npm run dev` · `npm run build` · `npm run lint` · `npm start`
- `npm run env:check` pokaže, kateri ključi v `.env.local` so izpolnjeni in pravilne oblike (vrednosti nikoli ne izpiše).
- `npm run db:list` izpiše migracije po vrsti in kako preveriš, ali je bila posamezna pognana (`-- --json` za Clauda).
- `npm run db:run -- <file>` požene eno migracijo z `SUPABASE_ACCESS_TOKEN` (če ne uporabljaš Supabase MCP).
- `npm run vercel:env -- --site-url <url>` kopira potrebne ključe na Vercel, ne da bi jih izpisal.
- `npm run audit:security` javi napako ob visokih ali kritičnih opozorilih npm.

## Opombe

- Opozorilo Supabase »Edge Runtime / `process.version`« pri gradnji je pričakovano in neškodljivo.
- Skrivnosti so v `.env.local` in na Vercelu, nikoli v kodi ali v klepetu.
- Varnost: [docs/security.md](docs/security.md). Pozabljeno geslo: [docs/password-recovery.md](docs/password-recovery.md).
- Na 3. dan isti temelji dobijo module: [internal-os-starter](https://github.com/LukaLeskovsek/internal-os-starter).
