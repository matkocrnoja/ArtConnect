# ArtConnect — Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** [2026./2027.]  
**Tim:** TG06.3  
**Nastavnik:** Vlado Sruk  
**Asistent / demonstrator:** Eda Jovičić

## Pregled projekta

Projekt omogućuje mladim umjetnicima olakšati ulazak u profesionalni svijet umjetnosti i omogućiti im da na jednom mjestu upravljaju svojim portfolijom i prijavama na različite umjetničke prilike.


</details>

**Aplikacija i osnovno postavljanje:** [README repozitorija](../README_PREDLOZAK.md#quick-start)  
**Javno dostupna aplikacija:** pogledajte [README – Postavljanje](../README_PREDLOZAK.md#deployment)

## Članovi tima i uloge

Ažurirani popis članova, njihovih GitHub profila i glavnih uloga ili doprinosa nalazi se u [README-u repozitoriju](../README_PREDLOZAK.md#team-members).

## Kazalo dokumentacije

| Stranica | Svrha |
| --- | --- |
| [1. Opseg projekta](1-Projekt.md) | Problem, cilj i granice projekta |
| [2. Analiza zahtjeva](2-Analiza-zahtjeva.md) | Zahtjevi, ograničenja i sljedivost |
| [3. Obrasci uporabe](3-Obrasci-uporabe.md) | Akteri i reprezentativne interakcije korisnika |
| [4. Arhitektura i oblikovanje](4-Arhitektura-i-oblikovanje.md) | Glavne odluke oblikovanja, struktura, podaci i ponašanje |

<!-- | [5. Ispitivanje](5-Ispitivanje.md) | Pristup ispitivanju, stvarni rezultati i poznati nedostaci |
| [6. Postavljanje, instalacija i konfiguracija](6-Postavljanje-instalacija-i-konfiguracija.md) | Lokalna instalacija, konfiguracija, javno postavljanje i administracija |
| [7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md) | Zaključak i moguća daljnja poboljšanja |
| [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md) | Aktivnosti tima, doprinosi i izazovi | -->

## Ključne točke projekta

Opisane u [1. Opseg projekta](1-Projekt.md)

## Organizacija projekta i razvojni proces

**Način rada:** Iterativni tjedni razvoj popraćen sastancima. Sastanci nisu obavezni već se održavaju kada netko od članova tima osjeti potrebu iskomunicirati nove promjene (_bring up to speed_) ili kada se mora zajednički odlučiti kako pristupiti nekome segmentu problema.

**Praćenje trenutačnih zadataka i nedostataka:** https://github.com/matkocrnoja/ArtConnect/issues

## Akademski integritet, ponašanje i licenciranje

Navedeno u zadnjoj sekciji [README.md](/README.md)
<!-- README repozitorija sadrži projektnu [izjavu o uporabi umjetne inteligencije](../README_PREDLOZAK.md#ai-usage), [informacije o kodeksu ponašanja i podršci](../README_PREDLOZAK.md#code-of-conduct-and-support) te [status licence ili ponovne uporabe](../README_PREDLOZAK.md#license). Pristupni podaci i druge tajne nikada se ne objavljuju u dokumentaciji niti dijele u običnim porukama. -->

<!-- ## Izjava o uporabi umjetne inteligencije -->

<!-- UPUTA: Ovo je detaljan zapis uporabe umjetne inteligencije; README sadrži kratak sažetak i poveznicu na ovaj odjeljak. Unesite samo ono što se stvarno dogodilo i uklonite neupotrijebljene retke. Ako nije korišten nijedan alat generativne umjetne inteligencije, zamijenite cijeli odjeljak jednom rečenicom koja to jasno navodi. Svaki redak mora upućivati na stranicu, datoteku, zahtjev za uključivanje promjena (PR) ili zadatak. Nikada ne unosite pristupne podatke, osobne podatke ni tuđi zaštićeni sadržaj u alate umjetne inteligencije. -->

<!-- Kratak sažetak: [README – Uporaba umjetne inteligencije](../README_PREDLOZAK.md#ai-usage). Ovaj odjeljak bilježi koji su alati korišteni, za koju dokumentaciju ili kod te kako je tim provjerio rezultat. Slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

### Korišteni alati

| Alat | Inačica ili model | Koristio/la | Glavna svrha |
| --- | --- | --- | --- |
| [Naziv alata] | [Inačica ili model, ako je poznat] | [Član/članovi tima] | [npr. izrada nacrta dokumentacije, generiranje izvora dijagrama] |

### Opseg doprinosa umjetne inteligencije

| Stranica, datoteka ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| [npr. 3. Obrasci uporabe, UC-002] | [Izrada nacrta / preoblikovanje / prijevod / izvor dijagrama / sažimanje] | [Kratak opis] | [Ulaz zadan alatu; dodane, ispravljene ili uklonjene činjenice] | [Stranica dokumentacije, `.puml` datoteka, PR] |

Stranice i artefakti koji nisu navedeni iznad izrađeni su bez pomoći generativne umjetne inteligencije. [Po želji: kao dodatne retke navedite kod ili ispitivanja izrađena uz pomoć umjetne inteligencije.]

### Provjera generiranog sadržaja

| Provjera | Kako je provedena | Dokaz |
| --- | --- | --- |
| Činjenična točnost | [Svaka tvrdnja o funkcionalnostima, ponašanju ili arhitekturi uspoređena je s pokrenutom aplikacijom i kodom] | [Imena pregledavatelja; poveznice na zahtjev za uključivanje promjena (PR) ili zadatak] |
| Nema tvrdnji o neostvarenim funkcionalnostima | [Provjereno je da opisane funkcionalnosti, ispitivanja i rezultati stvarno postoje; planirani rad označen je kao planiran] | [Usporedba s odjeljkom 5.4 (Ispitivanje) i odjeljkom 7.1 (Zaključak)] |
| Dosljednost s drugim stranicama | [Nazivi, ID-ovi i dijagrami provjereni su prema Analizi zahtjeva, Obrascima uporabe, Arhitekturi i oblikovanju te Ispitivanju] | [Kontrolni popis ili bilješka pregleda] |
| Izvori dijagrama | [Generirani PlantUML je iscrtan, ispravljen i odgovara implementiranom sustavu] | [`.puml` datoteka i izrađena slika] |
| Povjerljivi sadržaj | [Kako je tim osigurao da u upite ili dokumentaciju nisu unesene tajne, pristupni podaci ni osobni podaci] | [Primijenjeni postupak] |

### Pogreške pronađene u izlazu umjetne inteligencije

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| [Netočna, izmišljena ili iz predloška preuzeta tvrdnja] | [Pregled, ispitivanje ili usporedba s aplikacijom] | [Ispravak s poveznicom] | -->

<!-- UPUTA: Zabilježite stvarne ispravke ili napišite „Nisu utvrđene”. Općenita tvrdnja poput „sav tekst je pregledan” nije dokaz; dokaz su prethodne tablice. Tim mora moći objasniti svaku rečenicu koju objavi. -->

<!-- <details>
<summary><strong>Primjer zapisa uporabe umjetne inteligencije</strong></summary>

**Primjer — CrisisMap:**

| Stranica ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| 3. Obrasci uporabe, UC-002 | Izrada nacrta | Prvu inačicu glavnog i alternativnih tijekova | Tim je zadao stvarna polja obrasca i uklonio granu prijave u sustav koja u aplikaciji ne postoji | Primjer PR #31 |
| Sekvencijski dijagram, podnošenje prijave | Izvor dijagrama | Nacrt PlantUML-a | Tim je uskladio nazive sudionika s komponentama i uklonio korak slanja obavijesti koji nije implementiran | `diagrams/report-submission.puml` (primjer) |

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| U tekstu je stajalo da se obavijesti dostavljaju unutar jedne minute | Usporedba s Ispitivanjem (5.4): dostava nikada nije ispitana | Tvrdnja je uklonjena; obavijesti su navedene pod Budućim radom |
| Nacrt je kopirao primjer zahtjeva F-005 iz predloška kao projektni zahtjev | Usporedba s vlastitim popisom zahtjeva tima | Zamijenjeno stvarnim zahtjevom tima |

**Analiza primjera:** Svaki redak navodi stranicu ili datoteku, ono što je alat generirao i ono što je tim promijenio. Pogreške su tipične za generiranu dokumentaciju: funkcionalnost koja ne postoji i tekst predloška prikazan kao činjenica o projektu. Tvrdnje poput „AI je korišten svugdje” ili „sav tekst je pregledan” nije moguće provjeriti. Ovo je nastavni scenarij, a ne opis objavljenog projekta.

</details> -->
