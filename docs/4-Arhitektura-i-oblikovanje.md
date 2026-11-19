# 4. Arhitektura i oblikovanje


| Arhitekturni pogled | Ključno inženjersko pitanje | Primijenjeni model ili dijagram |
| :--- | :--- | :--- |
| **Strategija rješenja** | Koji stil i temeljne odluke određuju program? | Tablica odluka (odjeljak 4.1) |
| **Struktura podsustava** | Koji su glavni dijelovi i kako komuniciraju? | Dijagram komponenata |
| **Model podataka** | Kako su strukturirani trajni podaci programa? | Relacijski ER dijagram |
| **Struktura koda** | Kako su dodijeljene odgovornosti i ključne klase? | Reprezentativni dijagram razreda |
| **Dinamičko ponašanje** | Kako moduli surađuju pri obradi ključnih transakcija? | sekvencijski dijagram |
| **Stanja sustava** | Kako ključni domenski objekt mijenja svoja stanja? | Dijagram stanja |
| **Fizički razmještaj** | Na kojim se izvršnim čvorovima program izvodi? | Dijagram razmještaja (poglavlje 6) |

---


## 4.1 Ključne arhitekturne odluke

ArtConnect je web-aplikacija klijent-poslužitelj: React klijent poziva REST API (FastAPI), podaci su u PostgreSQL-u, a datoteke djela u S3 bucketu.

| Odluka | Razmatrana alternativa | Projektno specifično obrazloženje i kompromis |
| --- | --- | --- |
| Pohrana datoteka djela u S3 bucketu | Pohrana datoteka u SQL tablici ili u datotečnom sustavu poslužitelja | Fotografije i datoteke djela zauzimaju puno prostora, pa bi u SQL tablici usporavale bazu i sigurnosne kopije, a u datotečnom sustavu bile vezane uz jedan poslužitelj. S3 pohranu odvaja od poslužitelja, a baza čuva samo ključ datoteke i metapodatke djela. Kompromis je ovisnost o vanjskom servisu i potreba za usklađivanjem zapisa u bazi s datotekama u bucketu. |
| Web-klijent odvojen od jednog REST API-ja (FastAPI)| Poslužiteljski generirane stranice; više zasebnih usluga | Sučelje s tri uloge traži puno interakcije u pregledniku, a sva pravila i provjere ovlasti ostaju na jednom mjestu u API-ju. Kompromis je dodatna konfiguracija klijent-API (CORS, kolačići), a kvar jedne instance zaustavlja sve funkcionalnosti. |
| Slojevita organizacija poslužitelja (API, aplikacija, domena, infrastruktura)| Sva logika u funkcijama routera | Poslovna pravila ne ovise o HTTP-u ni SQL-u pa se mogu zasebno provjeriti i ne ponavljaju po rutama, a baza i S3 skriveni su iza sučelja domene. Kompromis je više razreda za jednostavne operacije; trenutačni kod još drži dio pravila i SQL u routerima. |
| PostgreSQL s parametriziranim SQL-om (SQLAlchemy text())|Dokumentna baza; ORM modeli| Podaci su gusto povezani, a pravila (jedna prijava po umjetniku i prilici, samo vlastita djela u prijavi) relacijska shema izražava izravno. Kompromis je što shema nije u kodu aplikacije pa se imena tablica i stupaca usklađuju ručno. |
Prijava isključivo putem Google OAuth 2.0|Vlastita prijava e-adresom i lozinkom|Zadatak traži vanjskog pružatelja identiteta pa sustav ne čuva lozinke; korisnik se identificira Google identifikatorom (sub), a uloge i blokiranje vodi aplikacija. Kompromis je da bez Google računa nema pristupa. |
Sesija kao potpisani JWT u httpOnly kolačiću|Sesije u bazi; token u localStorage| Kolačić nije dostupan JavaScriptu, a poslužitelj pri svakom zahtjevu provjerava postoji li korisnik i je li blokiran. Kompromis je da se pojedinačna sesija ne može opozvati prije isteka, osim blokiranjem računa. |
Zasebne tablice za umjetnike, organizatore i administratore|Jedna tablica korisnika s oznakom uloge| Isti Google račun može biti i umjetnik i organizator, a administratori se unose ručno. Kompromis je ponavljanje zajedničkih stupaca i izbor tablice prema ulozi u kodu. |


## 4.2 Gradivni blokovi i UML dijagram komponenata

**Cilj:** Prikazati logičku podjelu programa na komponente, njihova sučelja i vanjske integracije. Dijagram komponenata prikazuje logičku organizaciju, dok dijagram razmještaja prikazuje fizičko izvođenje. Ovaj prikaz ažurirajte kako sustav poprima konačan oblik.

| Komponenta | Odgovornost | Razlog za ovu granicu |
| --- | --- | --- |
|  |  |  |

Započnite crtanjem granice oko predloženog sustava. Unutar nje prepoznajte dijelove s različitim odgovornostima; planiranu bazu podataka aplikacije smjestite unutar granice, a usluge trećih strana izvan nje. Važne veze označite podatkom ili uslugom koja njima prolazi. Logička komponenta može biti modul unutar jedne poslužiteljske aplikacije: zaseban pravokutnik ne znači zasebno postavljenu uslugu. Tijekom implementacije ažurirajte dijagram kada se promijene odgovornosti ili veze. U završnoj inačici čitatelj treba moći povezati njegove dijelove s kodom. Dijagram razmještaja odgovara na pitanje gdje se ti dijelovi stvarno izvode.

<details>
<summary><strong>Granica sustava, odgovornosti i vanjske ovisnosti</strong></summary>

**Primjer — CrisisMap:** Predložena arhitektura podržava podnošenje prijava kriznih događaja, prikaz na karti i obavijesti o potvrđenim prijavama.

![Dijagram komponenata sustava CrisisMap](./assets/diagrams/4-1-crisismap-system-CMP.svg)

**Slika 4.1. Dijagram komponenata sustava CrisisMap**

**PlantUML izvor:** [izvor](./puml/4-1-crisismap-system-CMP.puml)

| Dio | Odgovornost | Razlog za ovu granicu |
| --- | --- | --- |
| Web-klijent | Prikazuje prijave i prikuplja podatke za novu prijavu. | Korisnička interakcija odvojena je od pravila prijave i trajne pohrane. |
| API za prijave | Prihvaća zahtjeve za rad s prijavama i vraća odgovore. | Odgovornosti izložene putem HTTP-a odvojene su od obrade prijava. |
| Usluga za prijave | Primjenjuje pravila prijave i pristupa pohranjenim prijavama. | Pravila provjere valjanosti i pohrane prijava imaju jasno mjesto odgovornosti. |
| Proces za obavijesti | Određuje korisnike koji trebaju primiti obavijest i traži od vanjskog pružatelja da je pošalje. | Obrada obavijesti odvojena je od odgovaranja na korisnikov zahtjev za prijavu. |

**Analiza primjera:** Vanjska granica odvaja predloženi sustav od pružatelja kartografskih usluga i pružatelja obavijesti. Unutarnja granica grupira API za prijave, uslugu za prijave i proces za obavijesti unutar jedne poslužiteljske aplikacije; njihovi zasebni simboli prikazuju predložene odgovornosti, a ne neovisno postavljene usluge. PostgreSQL pohranjuje podatke aplikacije, dok pružatelj kartografskih usluga osigurava kartografske pločice. Strelice sažimaju ovisnosti, a ne redoslijed transakcije; taj redoslijed prikazuje sekvencijski dijagram. Izostavite proces za obavijesti i Firebase Cloud Messaging ako obavijesti nisu dio odobrenog opsega. Pružatelja prijave u sustav uključite samo ako to zahtijeva odobreni zadatak. Kako implementacija napreduje, ispravite svaku predloženu granicu koja se pokaže netočnom; završni dijagram mora odgovarati onome što je tim izgradio. Jedan koherentan prikaz komponenata korisniji je od nekoliko gotovo jednakih inačica s proturječnim vezama.

</details>

## 4.3 Model podataka i oblikovanje razreda

### 4.3.1 ER dijagram i model podataka

**Cilj:** Prikazati važne pohranjene entitete, njihove identifikatore i veze te dovoljno atributa za razumijevanje podataka aplikacije. ER dijagram odvojen je od reprezentativnog UML dijagrama razreda u nastavku.

Model podataka prikazuje sve trajne podatke platforme, od korisnika i portfolija do prilika, prijava i obavijesti.

![ER dijagram](./diagrams/4-2-artconnect-data-ERD.svg)
**PlantUML izvor:** [izvor](./puml/4-2-artconnect-data-ERD.puml)

**Implementacija:** Poslužitelj pristupa PostgreSQL-u SQL upitima preko SQLAlchemyja ([database.py](../artconnect-api/app/database.py), [routers/portfolio.py](../artconnect-api/app/routers/portfolio.py), [routers/auth.py](../artconnect-api/app/routers/auth.py)). Shemu ne stvara kod aplikacije, a SQL skripte za sada nema u repozitoriju; izvor modela je ER dijagram.

| Skupina | Entiteti | Što pohranjuju |
| --- | --- | --- |
| Korisnici | `Umjetnik`, `Organizator`, `Administrator`, `Blokirani umjetnik` | Računi po ulozi s Google identifikatorom i statusom računa; organizator ima naziv organizacije i oznaku ovjere; blokiranje je veza organizator-umjetnik. |
| Portfolio | `Portfolio`, `Djelo`, `Datoteka djela`, `Područje umjetnika` | Biografija i opis, djela s vidljivošću te metapodaci datoteka. Sama datoteka je u S3 bucketu. |
| Prilike | `Prilika`, `Materijal prilike`, `Poziv`, `Lista želja` | Prilika s rokom, terminom, mjestom i statusom, njezini materijali te pozivi i spremljene prilike. |
| Prijave | `Prijava`, `Djelo u prijavi`, `Materijal prijave`, `Zahtjev za dopunu` | Prijava umjetnika na priliku s odabranim djelima, privicima i zahtjevima za dopunu. |
| Obavijesti | `Obavijest`, `Postavka obavijesti` | Obavijesti po primatelju i uključenost pojedinih vrsta. |
| Šifrarnici i postavke | `Područje djelovanja`, `Vrsta prilike`, `Postavka sustava` | Područja i vrste prilika te postavke koje mijenja administrator (ograničenja datoteka, trajanje sesije). |

**Važne odluke modela:** Identifikatori su UUID-ovi, a statusi enumeracije. Umjetnik, organizator i administrator zasebni su entiteti jer isti Google račun može imati više uloga. Šifrarnici se isključuju zastavicom `aktivno`, a djela i prilike „mekim brisanjem” (`uklonjeno_u` i razlog), jer ih stare prijave i obavijesti i dalje referenciraju. Umjetnik se na priliku može prijaviti najviše jednom, a djela u prijavi vezana su entitetom `Djelo u prijavi` koji pamti autora, kako se ne bi prijavila tuđa djela. Datoteke djela leže u S3 bucketu, a baza čuva samo metapodatke. Pravila tipa „barem jedan” (npr. djelo ima barem jednu datoteku) provjerava aplikacija, a ne baza.

**Razlike između modela i trenutačne implementacije:** Na grani `master` kod koristi tablice `umjetnici`, `organizatori`, `administratori`, `djela`, `datoteke_djela`, `podrucja_djelovanja`, `umjetnici_podrucja` i `postavke_sustava`, a `prijave`, `prijave_djela` i `prilike` samo čita pri provjeri uklanjanja djela. Ostali entiteti (npr. obavijesti, pozivi, lista želja) planirani su modelom, ali ih kod još ne koristi.


### 4.3.2 Reprezentativni UML dijagram razreda


**Odabrano područje**: upravljanje djelima u portfoliju umjetnika (stvaranje, uređivanje i uklanjanje djela s datotekama). Ono povezuje bazu, S3 i poslovna pravila pa dobro pokazuje podjelu odgovornosti po slojevima.


![ER dijagram](./diagrams/4-3-artconnect-dijagram-razreda.svg)

**Slika 4.3. Dijagram razreda za upravljanje djelima portfolija**
  
**PlantUML izvor:** [izvor](./puml/4-3-artconnect-dijagram-razreda.puml)   
**Kod:** [portfolio](../artconnect-api/app/routers/portfolio.py), [media](../artconnect-api/app/routers/media.py), [s3storage](artconnect-api/app/s3storage.py)

Poslužitelj je podijeljen u četiri sloja, a ovisnosti idu prema domeni.

| Sloj | Sadržaj | Pravilo |
| --- | --- | --- |
| Prezentacijski | `PortfolioRouter`, DTO-ovi `DjeloUnos`, `DjeloOdgovor` i `DatotekaOdgovor` | Prima zahtjev i vraća odgovor; provjerava ulogu (`require_role`); ne sadrži poslovna pravila. |
| Aplikacijski | `PortfolioServis` | Koordinira slučaj uporabe: dohvaća ograničenja, poziva domenu, vodi transakciju i usklađuje bazu sa S3. |
| Domenski | `Djelo`, `DatotekaDjela`, `OgranicenjaDatoteka`, `Umjetnik`, `Prilika` i enumeracija `StatusPrilike` te sučelja `DjeloRepozitorij`, `PostavkeRepozitorij`, `DatotecnaPohrana` | Pravila o djelu i datotekama te sučelja koja domena traži od pohrane; ne zna za HTTP, SQL ni S3. |
| Infrastruktura | `SqlDjeloRepozitorij`, `SqlPostavkeRepozitorij`, `S3DatotecnaPohrana` | Implementira sučelja domene upitima prema PostgreSQL-u i pozivima prema S3. |

`Djelo` samo čuva svoja pravila: naziv je obavezan, godina nije u budućnosti, novo djelo je zadano privatno, a uklanjanje mora imati razlog, ne može se samo obrist redak. `OgranicenjaDatoteka` nosi dopuštene vrste i najveću veličinu i broj datoteka iz postavki sustava te ih provjerava pri svakom prijenosu. `PortfolioServis` pri spremanju upisuje u bazu, prenosi datoteke na S3 i tek tada potvrđuje transakciju; pri grešci poništava bazu i briše već prenesene objekte, a objekte uklonjenih datoteka briše tek nakon uspješne potvrde. Brisanje djela odbija se dok je djelo u aktivnoj prijavi, a inače se djelo samo označi uklonjenim. Sučelja repozitorija i pohrane omogućuju zamjenu baze i S3 lažnim implementacijama u ispitivanjima. `Djelo.izradi` je statička tvornička metoda (na dijagramu podcrtana): poziva se na samom razredu jer objekt još ne postoji, a vraća novo djelo uz provjeru pravila. `Umjetnik` i `Prilika` prikazani su samo ključnim atributima, a vlasništvo nad djelom označeno je vezom „vlasnik”. Dijagram namjerno izostavlja stupce baze (njih objašnjava ER dijagram), vanjske sustave (PostgreSQL i S3), dohvat cijelog portfolija i ostale module.

**Stanje implementacije:** U trenutačnom kodu ta podjela još nije potpuno provedena: usmjernik u `portfolio.py` izravno izvršava SQL i sadrži pravila, a pristup S3 je u `s3storage.py`. Dijagram prikazuje ciljno oblikovanje prema kojem se pravila izdvajaju u domenske razrede, a SQL i S3 u infrastrukturu. Odgovor API-ja za djelo za sada je običan rječnik koji gradi funkcija `u_artwork`, a ne zaseban razred; `DjeloOdgovor` i `DatotekaOdgovor` na dijagramu zato opisuju oblik tog odgovora, dok je `DjeloUnos` stvarna Pydantic klasa. Pri završnom pregledu dijagram treba uskladiti s kodom.



## 4.4 Ponašanje tijekom izvođenja

**Cilj:** Objasniti jednu važnu interakciju među dijelovima koji se izvode i životni ciklus jednog smislenog objekta. Odaberite primjere koji otkrivaju odluke ili neuspješne putove umjesto izrade dijagrama za svaku CRUD radnju.

### 4.4.1 Reprezentativni UML sekvencijski dijagram

**Cilj:** Prikazati redoslijed poruka za jedan reprezentativni scenarij i odgovore na važnu alternativu.

**Scenarij:** [Naziv interakcije; dodajte UC ID ako postoji.]  
**sekvencijski dijagram:** [Ugradite čitljiv UML sekvencijski dijagram.]  
**PlantUML izvor:** [Poveznica na odgovarajuću `.puml` datoteku.]

<details>
<summary><strong>Odabir lokacije, provjera valjanosti i podnošenje prijave</strong></summary>

**Primjer — CrisisMap:** Građanin podnosi prijavu kriznog događaja nakon što ručno odabere lokaciju ili zatraži položaj uređaja. Interakcija prikazuje i što se događa kada je pristup lokaciji odbijen, podaci prijave nisu valjani ili pohrana ne uspije.

![Sekvencijski dijagram podnošenja prijave kriznog događaja](./assets/diagrams/4-4-crisismap-report-submission-SD.svg)

**Slika 4.4. Sekvencijski dijagram podnošenja prijave kriznog događaja**

**PlantUML izvor:** [izvor](./puml/4-4-crisismap-report-submission-SD.puml)

**Analiza primjera:** Dva načina odabira lokacije te alternative provjere i pohrane imaju različite posljedice za korisnika; usporedite ih s odgovarajućim obrascem uporabe i njegovim alternativnim tijekovima. API preglednika za lokaciju mogućnost je preglednika; web-klijent, API, usluga i pohrana odgovaraju prikazu komponenata. Odaberite grane koje pomažu objasniti scenarij vašeg projekta i završni dijagram uskladite s implementiranom interakcijom.

</details>

### 4.4.2 Reprezentativni UML dijagram stanja

**Cilj:** Prikazati važna stanja jednog domenskog objekta ili eksplicitno upravljanog načina rada sustava te događaje ili uvjete koji ih mijenjaju.

**Vlasnik stanja i razlog odabira:** [Navedite objekt ili način rada sustava, kako se njegovo stanje prepoznaje i zašto su prijelazi važni.]  
**Dijagram stanja:** [Ugradite čitljiv UML dijagram stanja.]  
**PlantUML izvor:** [Poveznica na odgovarajuću `.puml` datoteku.]

<details>
<summary><strong>Složeno stanje sustava: koordinacija događaja i dostupnost usluge</strong></summary>

**Primjer — CrisisMap:** Ovaj primjer ne prikazuje životni ciklus jednog domenskog objekta, nego dva neovisna aspekta stanja cijelog sustava CrisisMap. Jedna regija opisuje način koordinacije kriznog događaja, a druga opaženu dostupnost usluge. Budući da se ta dva aspekta mogu mijenjati neovisno jedan o drugome, prikazani su kao ortogonalne regije istog složenog stanja sustava.

![Dijagram stanja prijave kriznog događaja](./assets/diagrams/4-5-crisismap-system-SM.svg)

**Slika 4.5. Dijagram stanja sustava s ortogonalnim regijama**

**PlantUML izvor:** [izvor](./puml/4-5-crisismap-system-SM.puml)

**Analiza primjera:** Vlasnik stanja u ovom je primjeru sustav CrisisMap, a ne pojedinačna prijava kriznog događaja. Dvije ortogonalne regije opisuju stanja koja vrijede istodobno: način koordinacije kriznog događaja i dostupnost usluge. Promjena stanja u jednoj regiji ne mora promijeniti stanje u drugoj; primjerice, aktivni krizni događaj može postojati dok je usluga potpuno ili djelomično dostupna.

Prijelazi imaju imenovane događaje ili uvjete, a grane nakon oporavka poslužiteljskog sustava uzimaju u obzir da pružatelj kartografskih usluga može i dalje biti nedostupan. Time primjer pokazuje situaciju u kojoj ortogonalne regije imaju stvarnu semantičku svrhu, a nisu samo način vizualnog grupiranja elemenata.

Ovo je napredniji primjer dijagrama stanja. Koristite takav oblik samo ako sustav stvarno održava dva ili više međusobno neovisnih aspekata stanja koji se mogu mijenjati istodobno. Za projekt u kojem je važan životni ciklus jednog objekta, primjerice prijave, rezervacije ili narudžbe, jednostavniji dijagram stanja tog objekta obično je prikladniji. Složenost dijagrama nije kriterij vrednovanja.

Pri završnom pregledu svaki prikazani prijelaz i uvjet usporedite s ponašanjem koje implementirana aplikacija stvarno podržava.

</details>

## 4.5 Zapisi arhitekturnih odluka

**Cilj:** Sačuvati razloge i obrazložiti odabrane važne arhitekturne odluke kada tablica u odjelku 4.1 nije dovoljna za očuvanje konteksta, razmatranih alternativa i prihvaćenih kompromisa.

Napišite nekoliko ADR-a za važne odluke čije obrazloženje, alternative i kompromis treba sačuvati. Ostale arhitekturne odluke dovoljno je zabilježiti u tablici.

**Detaljni zapis arhitekturne odluke (engl. Architecture Decision Record, ADR), kada odluka zahtijeva dodatno objašnjenje:**

### ADR-[ID]: [Naslov odluke]

| Polje | Zapis odluke |
| --- | --- |
| Kontekst i cilj | [Koji je arhitekturni problem učinio ovu odluku potrebnom?] |
| Kriteriji odluke | [Što je timu stvarno bilo važno?] |
| Razmatrane alternative | [Realne mogućnosti koje je tim razmotrio, ukratko.] |
| Odluka i obrazloženje | [Odabrana mogućnost, zašto je odabrana i čega se tim odrekao.] |
| Status | [Predloženo, prihvaćeno ili zamijenjeno; ako je primjenjivo, poveznica na novu odluku.] |

ADR pišite samo za odluku čije će obrazloženje ostati važno i nakon promjene implementacije. Značajna promjena odluke može se zabilježiti novim ADR-om koji zamjenjuje stari; rutinski odabiri alata ne trebaju detaljne zapise. Promjene dogovorenog opsega pripadaju zahtjevima i njihovoj povijesti promjena; povratna informacija o zadatku ostaje uz odgovarajući zadatak.

<details>
<summary><strong>Odabir jednog poslužiteljskog sustava umjesto zasebno postavljenih usluga</strong></summary>

**Primjer — CrisisMap, ADR-01:**

| ID | Datum | Odluka | Razmatrana alternativa | Obrazloženje i kompromis | Status |
| --- | --- | --- | --- | --- | --- |
| ADR-01 | [Datum odluke] | Jedan poslužiteljski API za obradu prijava | Zasebno postavljene usluge za prijave i resurse | Manji napor postavljanja i integracije za odobreni opseg; kvar poslužiteljskog sustava može utjecati na obje funkcionalnosti. | Prihvaćeno |

### ADR-01: Jedan poslužiteljski API za obradu prijava

| Polje | Zapis odluke |
| --- | --- |
| Kontekst i cilj | Tim tijekom jednog semestra mora izraditi i javno postaviti prijavljivanje kriznih događaja i prikaz usmjeren na kartu. |
| Kriteriji odluke | Tim može izraditi, integrirati, postaviti i objasniti rješenje; komponente i dalje imaju prepoznatljive odgovornosti. |
| Razmatrane alternative | **Jedan poslužiteljski sustav:** moduli dijele aplikaciju koja se postavlja kao cjelina. **Zasebne usluge:** svaka se može izvoditi neovisno, ali zahtijeva dodatni rad na integraciji i postavljanju. |
| Odluka i obrazloženje | Odabrati jedan poslužiteljski sustav s jasno odvojenim odgovornostima vezanim uz prijave. Time se smanjuje rad na postavljanju, uz prihvaćanje da kvar tog sustava može istodobno utjecati na rad s prijavama. |
| Status | Prihvaćeno. |

**Analiza primjera:** Strategija rješenja navodi trenutačni pristup; ADR-01 čuva alternative i kriterije koji su do njega doveli. Dijagrami komponenata i razmještaja trebaju odražavati odabrani pristup kako se sustav razvija. Zaseban ADR koristan je za važnu odluku, a ne za svaki odabir alata.

</details>

## 4.6 Zajednička pravila oblikovanja (engl. Cross-cutting concerns)

**Cilj:** Prepoznati i opisati globalna pravila i mehanizme oblikovanja koji se primjenjujuju u više dijelova aplikacije, navesti gdje se planira primijeniti i ažurirati objašnjenje kako implementacija poprima konačan oblik. Uključite samo pravila koja su važna za ovaj projekt.

**Implementirani mehanizmi:**

| Aspekt | Mehanizam | Pravilo | Mjesto primjene |
| --- | --- | --- | --- |
| [Npr. Sigurnost] | [Npr. Autorizacija korisnika] | [Npr. Ovlasti se provjeravaju na poslužiteljskoj strani za svaki zaštićeni zahtjev; skrivanje elemenata korisničkog sučelja nije dovoljna zaštita.] | [Npr. Middleware za autorizaciju / zaštita API usmjernika.] |
| [Npr. Validacija podataka] | [Npr. Provjera ulaznih podataka] | [Npr. Geoprostorni podaci, uključujući koordinate, provjeravaju se prije pohrane.] | [Npr. Sloj za obradu zahtjeva / odgovarajuća usluga.] |

<details>
<summary><strong>Primjer zajedničkih pravila i mehanizama</strong></summary>

**Primjer — CrisisMap:**

| Aspekt | Mehanizam | Pravilo | Mjesto primjene |
| --- | --- | --- | --- |
| Sigurnost | Autorizacija moderiranja prijava | Ovlasti moderatora provjeravaju se na poslužiteljskoj strani prije odobravanja ili odbijanja prijave; skrivanje gumba u korisničkom sučelju nije dovoljna zaštita. | Poslužiteljski dio funkcionalnosti za moderiranje prijava. |
| Validacija podataka | Provjera lokacije prijave | Nedostajuće ili nevaljane koordinate odbijaju se prije pohrane prijave. | Obrada podnošenja prijave. |
| Aspekt | Mehanizam | Pravilo | Mjesto primjene |
| Upravljanje ovisnostima | Injektiranje ovisnosti | Objekt koji provodi poslovnu logiku ne stvara sam konkretnu implementaciju repozitorija, nego potrebnu ovisnost prima izvana. | `ReportWorkflow` prima implementaciju sučelja `ReportRepository` pri stvaranju objekta. |

**Analiza primjera:** Prvi redak pokazuje sigurnosno pravilo koje se provodi neovisno o korisničkom sučelju, a drugi pravilo provjere podataka prije pohrane. U vlastitoj dokumentaciji navedite samo aspekte koji se stvarno primjenjuju u projektu te konkretno mjesto njihove primjene.

Obrasci poput injektiranja ovisnosti (engl. Dependency Injection) ili repozitorija (engl. Repository) pripadaju ovdje samo kada ih kod stvarno koristi i kada objašnjavaju zajedničko pravilo oblikovanja. Tvrdnja „sustav koristi autentikaciju” sama po sebi ne govori čitatelju gdje se provjera provodi niti što štiti. Sigurnost, bilježenje događaja i obrada pogrešaka ne trebaju svaki zaseban pododjeljak po zadanom pravilu.

</details>

## 4.7 Arhitekturni rizici i tehnički dug

**Cilj:** Navesti stvarne tehničke ili domenske rizike i svjesno prihvaćene kompromise oblikovanja, njihove posljedice i način na koji ih tim obrađuje.

**Tehnički rizici i dug**

| Rizik ili kompromis | Posljedica | Odgovor na rizik  |
| --- | --- | --- |
| *Npr. Pohrana slika u lokalni file sustav* | *Pri ponovnom pokretanju kontejnera slike će biti izgubljene.* | *Prihvaćeni tehnički dug za demo verziju. U budućnosti planirana migracija na S3 (AWS).* |
| *Npr. Nepostojanje paginacije na API-ju* | *Moguće usporenje klijenta pri dohvaćanju velike količine podataka iz baze.* | *Ograničen broj testnih unosa. Dodavanje paginacije ostavljeno za sljedeću iteraciju.* |
|  |  |  |

**Poslovni ili domenski rizici, ako su značajni**

| Rizik | Posljedica | Odgovor na rizik |
| --- | --- | --- |
| **Jedna instanca aplikacije obrađuje prijave** | Kvar poslužitelja (hostinga) privremeno onemogućuje nove prijave. | Prihvaćeno u okviru ograničenja projekta za kolegij; tim ne tvrdi da postoji automatsko prebacivanje na pričuvni sustav (failover). |
| **Nedostupnost vanjskke kartografske usluge** | Prikaz karte može prestati raditi iako su pohranjene prijave u bazi i dalje dostupne. | Implementirana je korisniku vidljiva poruka o pogrešci uz alternativu pregleda prijava u tekstualnom obliku. |
|  |  |  |

<details>
<summary><strong>Primjer tehničkih i domenskih rizika</strong></summary>

**Primjer — CrisisMap, tehnički rizici:**

| Rizik ili kompromis | Posljedica | Odgovor na rizik |
| --- | --- | --- |
| Jedna instanca aplikacije obrađuje podnošenje prijava. | Kvar smještaja aplikacije privremeno onemogućuje nove prijave. | Rizik je prihvaćen za opseg projekta; ne uvodi se pričuvna instanca ni automatsko prebacivanje. |
| Vanjske kartografske usluge nisu dostupne. | Prikaz karte može prestati raditi iako su pohranjene prijave i dalje dostupne. | Karta se ne može prikazati, ali pohranjene prijave ostaju dostupne. | Aplikacija prikazuje poruku o nedostupnosti karte i omogućuje pregled prijava u tekstualnom obliku. |

**Primjer — CrisisMap, domenski rizik:** Čitatelji mogu neprovjerenu prijavu građanina zamijeniti za službeno upozorenje. Tim može u sučelju jasno razlikovati status provjere prijave i uputiti korisnike na službene izvore.

**Analiza primjera:** Prvi tehnički rizik prihvaća realistično ograničenje projekta kolegija; domenski se rizik odnosi na način na koji čitatelj tumači prijavu. Zabilježite ograničenje i realan odgovor koji pripadaju vašem projektu. Neostvarena obavezna funkcionalnost nije tehnički dug nego nedovršen opseg.

</details>

---


>**Završna provjera:** Usporedite dijagrame komponenata, podataka, razreda, sekvencijski dijagram i dijagram stanja s implementiranim kodom, ponašanjem aplikacije i stvarnim razmještajem. Ažurirajte zastarjele opise oblikovanja i objasnite svaku važnu razliku koja ostaje; poveznice na odgovarajući kod ili ispitivanja korisne su kada odgovaraju na konkretno pitanje.
