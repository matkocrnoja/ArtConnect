# 1. Opseg projekta

ArtConnect je web platforma namijenjena mladim umjetnicima koja im omogućuje predstavljanje vlastitog rada, pronalaženje umjetničkih natječaja i prilika za izlaganje te povezivanje s galerijama, kulturnim institucijama i organizatorima događanja. Cilj platforme je mladim umjetnicima olakšati ulazak u profesionalni svijet umjetnosti i omogućiti im da na jednom mjestu upravljaju svojim portfolijom i prijavama na različite umjetničke prilike.

## 1.1 Problem i cilj projekta

**Problem.** Mladim umjetnicima bez izgrađene mreže kontakata glavna prepreka često nije sam rad, nego vidljivost i pristup informacijama. Prilike za izlaganje raspršene su po različitim izvorima (Instagram, X, Reddit, itd..), svaka ima svoja pravila prijave, a umjetnik/umjetnica za svaku od njih iznova slaže životopis, fotografije radova i opis svog rada. Kad prijavu pošalje, obično nema uvid u to je li zaprimljena, u kojoj je fazi odabira i zašto je eventualno odbijena. Organizatori se nalaze na drugoj strani istog problema: zaprimaju materijale različitih oblika i različite potpunosti, pa im usporedba kandidata i javljanje ishoda oduzimaju vrijeme.

**Cilj.** Projektom se izrađuje web-aplikacija u kojoj je portfolio umjetnika središnji izvor podataka koji se uređuje jednom i koristi pri svakoj prijavi, a svaka prilika i svaka prijava prolaze kroz unaprijed definirana stanja koja vide obje strane. Aplikacija ima tri uloge (umjetnik, organizator i administrator platforme) i obuhvaća sve korake od registracije putem vanjskog pružatelja identiteta (Google OAuth 2.0), izrade portfolija, objave prilike/natječaja od strane organizatora, objave rezultata prijava i prikaza ostvarenog sudjelovanja na profilu umjetnika.

**Očekivana korist.**

- **Umjetnik** ne mora za svaku prijavu ponovno prikupljati iste materijale, u svakom trenutku zna stanje svojih prijava i dobiva obrazloženje odbijanja kada ga organizator unese. Sudjelovanja ostvarena putem platforme na profilu su potvrđena od organizatora, a ne samo navedena od umjetnika.
- **Organizator** dobiva prijave istog oblika na jednom mjestu, može ih sustavno pregledati i ima osnovni brojčani uvid u odaziv na svoje prilike.
- **Administrator** uz sposobnost donošenja administrativnih odluka vezanih za platformu ima i mjesečni pregled korištenja platforme na temelju kojeg može procijeniti njezinu aktivnost.

Navedene koristi su očekivane, a ne izmjerene. Tim ih ne izražava brojčano jer u okviru projekta nije provedeno mjerenje sa stvarnim korisnicima.

## 1.2 Ciljani korisnici i dionici

**Cilj:** Utvrditi osobe, uloge i organizacije čije potrebe i interesi određuju projektni zadatak.

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| Umjetnik (autor na početku karijere, npr. student ili nedavno diplomirani umjetnik) | Urediti portfolio i sam odlučiti koja su djela javna; pronaći prilike u svom području i na prihvatljivoj lokaciji; prijaviti se bez ponovnog prikupljanja materijala; znati u kojoj je fazi prijava, što treba dopuniti i zašto je odbijena; prihvaćeno događanje prenijeti u osobni kalendar. |
| Organizator (galerija, kulturna institucija, udruga ili samostalni kurator) | Doprijeti do mladih umjetnika određenog područja; objaviti priliku s rokom, kriterijima, nagradom i lokacijom na karti; pregledati prijave na jednom mjestu i obrazložiti odbijanje; nakon događanja objaviti rezultate i označiti sudionike; pratiti odaziv po prilici i području umjetnosti. |
| Administrator platforme | Održavati pouzdanost platforme: upravljati korisničkim računima i organizatorima, uklanjati neprimjeren sadržaj, uređivati kategorije umjetnosti i kriterije pretraživanja te pratiti mjesečne pokazatelje korištenja. |
| Osoba izvan platforme koja pregledava portfolio (npr. kurator kojem umjetnik pošalje poveznicu) | Vidjeti javna djela i podatke o umjetniku bez registracije. Djela koja je umjetnik označio kao privatna ne smiju joj biti dostupna. |
| Pružatelji vanjskih usluga (dionik) | Pružatelj identiteta, kartografski i kalendarski servis određuju uvjete korištenja svojih sučelja: ograničenja broja zahtjeva, potrebne ključeve i izričit pristanak korisnika za pristup kalendaru. |

Akteri koji izravno koriste aplikaciju su umjetnik, organizator, administrator i neregistrirana osoba koja pregledava javni portfolio. Ostali navedeni dionici ne koriste aplikaciju, ali postavljaju zahtjeve kojih se sustav mora pridržavati.

## 1.3 Granice projekta

**Cilj:** Jasno definirati granice sustava — što je obuhvaćeno odobrenim zadatkom, što je svjesno izostavljeno ili odgođeno te o kojim vanjskim uslugama sustav izravno ovisi.

**Uključeno:**

- **Pristup i uloge:** registracija i prijava putem vanjskog pružatelja identiteta (OAuth 2.0), odabir uloge umjetnika ili organizatora te unos osnovnih podataka, područja djelovanja i poveznica na vanjske stranice.
- **Portfolio:** biografija, opis umjetničkog rada, djela s osnovnim podacima (naziv, godina, tehnika, dimenzije, opis) i pripadajućom datotekom, prethodne izložbe i projekti, odabir javne vidljivosti za svako djelo te prikaz sudjelovanja ostvarenih putem platforme.
- **Prilike:** objava natječaja, izložbi, radionica i drugih prilika s rokom, područjem, kriterijima i nagradom; prikaz fizičke lokacije na karti; životni ciklus prilike (priprema, otvoreno za prijave, prijave zatvorene, u procesu odabira, završeno); pretraživanje prema području, lokaciji i roku.
- **Prijave:** prijava slanjem portfolija i dodatnih materijala, praćenje stanja (predana, u pregledu, potrebna dopuna, prihvaćena, odbijena), razlog odbijanja te dodavanje događanja u kalendar nakon prihvaćanja.
- **Pregled za organizatora:** upravljanje vlastitim prilikama i prijavama, osnovna statistika, objava rezultata i označavanje sudionika.
- **Administracija:** upravljanje korisnicima, organizatorima i objavljenim sadržajem, kategorijama umjetnosti, kriterijima pretraživanja i osnovnim postavkama te mjesečni izvještaj o korištenju.

Prvi ciklus pokriva "Pristup i uloge", "Portfolio", "Prilike" dok drugi ciklus pokriva "Prijave", "Pregled za organizatora" i "Administracija", s napomenom da će neki djelovi iz sekcije "Administracija" biti izvedeni u prvom ciklusu ukoliko bude bilo preduvjetne potrebe za tim.

**Izvan opsega ili odgođeno:**

- **Izravno dopisivanje između umjetnika i organizatora.** Komunikacija vezana uz prijavu svodi se na stanje prijave, zahtjev za dopunom i razlog odbijanja. Razmjena poruka zahtijevala bi moderiranje i obavještavanje u stvarnom vremenu, što prelazi vremenski okvir kolegija.
- **Ocjenjivanje prijava putem višečlanog žirija** (bodovanje, glasanje). U prvoj inačici o prijavi odlučuje organizator prihvaćanjem ili odbijanjem.
- **Prodaja djela, narudžbe i bilo kakvo plaćanje.** Platforma je besplatna i nije zamišljena kao tržište umjetnina.
- **Automatsko preuzimanje natječaja s vanjskih web-stranica.** Prilike unose isključivo organizatori, koji tako ostaju odgovorni za točnost objave.
- **Automatsko preporučivanje prilika umjetniku.** Smislen je budući korak tek kada platforma ima dovoljno podataka; prva inačica nudi pretraživanje i filtre.
- **Provjera autorstva učitanih djela.** Platforma ne utvrđuje je li umjetnik stvarni autor djela; za to je odgovoran korisnik.

**Vanjske ovisnosti:**

- **Pružatelj identiteta putem OAuth 2.0 (npr. Google):** potvrđuje identitet korisnika. Uloge, odobrenja i blokiranje računa vodi isključivo aplikacija; vanjski račun sam po sebi ne daje nikakve ovlasti na platformi.
- **Google Maps Platform:** prikaz lokacije na karti i pretvaranje unesene adrese u koordinate. Aplikacija pohranjuje adresu i koordinate u vlastitoj bazi, a adresa se prikazuje kao tekst neovisno o karti.
- **Google Calendar API:** upis prihvaćenog događanja u kalendar umjetnika, uz izričit pristanak korisnika na pristup kalendaru. Aplikacija upisuje samo događanja za koja je prijava prihvaćena.
- **Infrastruktura:** AWS

## 1.4 Postojeći pristupi i opravdanost projekta

**Cilj:** Objasniti kako korisnici trenutačno rješavaju problem i koja preostala potreba opravdava odobreni projekt.

U uobičajenom slučaju institucija objavi natječaj kao tekst ili PDF na svojoj web-stranici i društvenim mrežama, a umjetnik šalje prijavu e-poštom s priloženim životopisom, izjavom o radu i fotografijama djela. Takav postupak organizatoru daje potpunu slobodu u određivanju uvjeta, a umjetniku omogućuje da svaku prijavu prilagodi natječaju. Ono što u tom scenariju nedostaje jest povratna informacija i kontinuitet: umjetnik ne vidi u kojoj je fazi njegova prijava, ishod može saznati kasno ili bez obrazloženja, a sudjelovanje ostaje zabilježeno samo u njegovu vlastitom životopisu. ArtConnect je usmjeren upravo na taj nedostatak, odnosno na praćenje stanja prijave, obrazloženje odbijanja i sudjelovanje koje potvrđuje organizator.

---

>**Završna provjera:** Opis problema, cilj projekta, korisnici i dionici, granice opsega te postojeći pristupi međusobno su usklađeni. Navedene koristi ne predstavljaju neprovjerene tvrdnje, a uključene i izostavljene funkcionalnosti odgovaraju odobrenom projektnom zadatku.