<!--
PREDLOŽAK — README završnog projekta na kolegiju Programsko inženjerstvo FER-a.
Kopirajte ovu datoteku u README.md u repozitoriju svojeg projekta. Zamijenite
svaku uputu u uglatim zagradama činjenicama o svojem projektu, uklonite sve
komentare s uputama i ogledne <details> blokove te prije predaje izbrišite ovu
napomenu. Nemojte kopirati nastavni primjer kao rezultat svojeg projekta.
-->

# ArtConnect

ArtConnect je web platforma namijenjena mladim umjetnicima koja im omogućuje predstavljanje vlastitog rada, pronalaženje umjetničkih natječaja i prilika za izlaganje te
povezivanje s galerijama, kulturnim institucijama i organizatorima događanja.

**Projekt na kolegiju:** Ovu je aplikaciju razvio studentski tim u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER).

## Opis aplikacije

Cilj platforme je mladim umjetnicima olakšati ulazak u profesionalni svijet umjetnosti i omogućiti im da na jednom mjestu upravljaju svojim portfolijom i prijavama na različite umjetničke prilike. Za korištenje platforme potrebno je registrirati se kao umjetnik ili organizator. Umjetnici na platformi mogu izraditi vlastiti digitalni portfolio, a organizatori mogu objavljivati natječaje, izložbe, radionice i druge umjetničke prilike na koje se umjetnici mogu prijavljivati.

**Ključne funkcionalnosti**

- Registracija i prijava u aplikaciju
- Funkcionalnost izrade portfolija kao umjetnik
- Funkcionalnost kreiranja prilika (natječaja, izložba, radionica...) kao organizator
- Funkcionalnost prijave umjetnika na objavljene prilike kao i organizatorova mogućnost pregleda istih
- Integracije s vanjskim servisima (OAuth2, Google Calendar)
- Mogućnost uvida u statistiku objavljenih prilika (organizatori)
- Sposobnost prijave u sustav kao administrator

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte (TODO) [docs](docs/Home.md).

<a id="deployment"></a>
## Postavljanje (engl. deployment)

<!-- UPUTA: Ovaj odjeljak opisuje već postavljenu aplikaciju koju se  može otvoriti i isprobati bez lokalnog pokretanja izvornog koda.
Za Iteraciju 1 i Završni pregled navedite konkretne podatke. Provjerite vodi li URL na javno dostupnu pokrenutu aplikaciju i radi li navedeni tijek uporabe. Nikada ne objavljujte lozinke ni pristupne tokene. -->

**Javno dostupna aplikacija:** (TODO: Nakon deploymenta) [Javni URL]

**Isprobajte:** [Jedna ili dvije kratke radnje koje pokazuju funkcionalan korisnički tijek.] (TODO)

**Demonstracija:** [Objasnite kako dobiti potreban ograničeni pristup ako je prijava obavezna; u suprotnom napišite „Korisnički račun nije potreban.” Ovdje ne objavljujte lozinke ni pristupne tokene.] (TODO)

**Ograničenja:** [Kratko navedite ograničenja postavljene inačice ili postavite poveznicu na jedinstveno mjerodavno mjesto u dokumentaciji s poznatim problemima.] (TODO)

[Vodič za postavljanje i pokretanje](docs/6-Postavljanje-instalacija-i-konfiguracija.md) opisuje smještaj aplikacije (engl. hosting) koji tim stvarno koristi. Tim može koristiti Render ili drugu platformu koju ste dogovorili s asistentom/demonstratorom. (TODO)

<a id="quick-start"></a>
## Brzi početak / instalacija

<!-- Obavezno od Demo 1 nadalje. Zamijenite mjesta za unos naredbama koje je drugi član tima uspješno provjerio nakon čistog kloniranja repozitorija. Detaljne upute za administraciju držite u projektnoj dokumentaciji u direktoriju docs/. -->

**Preduvjeti:** [Navedite potrebno izvršno okruženje (engl. runtime) i verzija, upravitelj paketa (engl. package manager), baza podataka ili vanjska usluga ako je nužna.] (TODO)

```bash
git clone https://github.com/matkocrnoja/ArtConnect.git
cd ...direktorij gdje se to sve nalazi.../ArtConnect

cd vite-frontend
npm install # ako se prvi put pokrece ili ako ima izmjena u package.json
npm run dev # pokrece frontend na localhostu
```

**Adresa:** [Stvarna adresa koju aplikacija ispiše nakon pokretanja.] (TODO)

**Konfiguracija:** [Navedite potrebne varijable okruženja (engl. environment variables) ili uputite na sigurnu datoteku `.env.example`; objasnite gdje se dobivaju vrijednosti. Nikada ne stavljajte stvarne pristupne podatke u ovu datoteku, primjer konfiguracije, snimke zaslona, zapise ni zapise promjena (engl. commits).] (TODO)

[Dodajte kratak korak provjere, primjerice koja se stranica treba otvoriti ili koja naredba pokreće osnovnu provjeru.] Za detaljno postavljanje pogledajte [projektnu dokumentaciju](docs/Home.md).
(TODO)

## Tehnologije

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| React | JS biblioteka za izradu frontend sučelja | Jednostavnost i široka primjena u industriji |
| Vite | Alat koji pretvara JSX i TypeScript u JavaScript te omogućuje brzo pokretanje i izgradnju web aplikacije | Brz odaziv na promjene zbog HMR (Hot Module Reload) |
| Python | Progamski jezik za izradu backenda | Jednostavnost i široka primjena u industriji |
| PostgreSQL | Baza podataka | Povezanost s kolegijem "Baze podataka" koji se predaje na fakultetu |
| Docker | Izrada slika/containera za VPS | Prenosivost na različite sustave |


<a id="team-members"></a>
## Članovi tima

| Član | Glavna uloga ili doprinos |
| --- | --- |
| Ana Dumbović | Frontend |
| Borna Janežić | Backend |
| Matko Crnoja | Voditelj, devops |
| Mia Barada | Frontend |
| Luka Kauzlarić | Dokumentacija |
| Sabljak Leon | Devops & backend |
| Vilim Crčić | Backend |

## Doprinos projektu

Zadaci se evidentiraju pomoću GitHub Projects/Trello (TODO: Dogovoriti se).

<a id="license"></a>

**Status licence:** Nije dodijeljena licenca koja dopušta javnu ponovnu uporabu.

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

TODO: Na kraju
**Izjava:** [Navedite jesu li korišteni alati umjetne inteligencije. Ako jesu, navedite alate i njihove glavne namjene te objasnite kako je tim pregledao nastali kod ili tekst i kako može objasniti vlastiti doprinos. Ako nisu korišteni, to jasno navedite. U alate umjetne inteligencije nemojte unositi privatne podatke, pristupne podatke ni tuđe zaštićene materijale.]

[Ako je za ovaj projekt potreban detaljniji zapis uporabe umjetne inteligencije, postavite poveznicu na njegovo jedinstveno mjerodavno mjesto u dokumentaciji.]

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html).

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
