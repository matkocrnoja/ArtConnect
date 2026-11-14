#  2.Analiza zahtjeva

**Cilj:** Iz odobrenog opsega projekta izvesti prepoznatljive, prioritetizirane i provjerljive zahtjeve. Zahtjevi se mogu mijenjati; pri završnoj predaji moraju odražavati dogovorenu aplikaciju. Izvori, odluke i poveznice u primjerima kolegija nastavni su scenariji, a ne projektni zapisi.

<details>
<summary><strong>Održavanje zahtjeva ažurnima</strong></summary>

Primjeri koriste temu projekta CrisisMap. Neki namjerno sadrže korisne nedostatke za raspravu. Izvori, odluke i poveznice na provjere u tim primjerima **nastavni su scenariji**, a ne zapisi rada stvarnog studentskog tima. Zamijenite ih zahtjevima i dokazima svojeg odobrenog projekta. Značajne promjene zabilježite u odjeljku 2.5.

</details>
  
## 2.1 Funkcijski zahtjevi

**Cilj:** Navesti što aplikacija mora omogućiti korisnicima, odakle pojedina mogućnost proizlazi i koji se opažljivi rezultat smatra prihvaćanjem.

#### F-RL: Pristup usluzi (REGISTER/LOGIN)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-RL-1 | Korisnici se mogu registrirati i prijaviti isključivo putem vanjskog servisa OAuth 2.0 | Visok | ArtConnect.pdf | Korisnik može odabrati željenu ulogu i registrirati/prijaviti se putem svog Google računa. |
| F-RL-2 | Korisnici se mogu odjaviti i biti automatski odjavljeni | Visok | Dogovor tima | Korisnik se može odjaviti klikom na gumb "Odjava" te je automatski odjavljen nakon isteka sesije. |
| F-RL-3 | Neprijavljeni korisnici mogu pristupiti javnim stranicama, a prijavljeni samo Dashboardu svoje uloge | Visok | Dogovor tima | Neprijavljeni korisnik može koristiti javni dio platforme, a ako pokuša otvoriti Dashboard, preusmjeren je na prijavu. Dashboard druge uloge nije dostupan. |

#### F-NU: Javni prikaz aplikacije (za neregistrirane korisnike) (NO USER)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-NU-1 | Posjetitelji mogu pregledavati i pretraživati javna djela i profile umjetnika | Visok | ArtConnect.pdf; Dogovor tima | Posjetitelj može pretraživati djela i umjetnike, a privatna djela mu nisu vidljiva. |
| F-NU-2 | Posjetitelji mogu pregledavati, pretraživati i filtrirati aktivne prilike | Visok | ArtConnect.pdf | Posjetitelj može filtrirati prilike po području, lokaciji, roku i statusu. Prilike u pripremi nisu vidljive. |
| F-NU-3 | Posjetitelji mogu pregledavati završene prilike i njihove pobjednike | Srednji | ArtConnect.pdf; Dogovor tima | Završene prilike prikazuju se zasebno s popisom pobjednika. |

#### F-UP: Umjetnik - profil i portfolio (UMJETNIK PORTFOLIO)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-UP-1 | Umjetnici mogu uređivati svoj profil | Visok | ArtConnect.pdf | Umjetnik može izmijeniti ime, područje djelovanja, poveznice, biografiju i opis rada, a izmjene su vidljive na javnom profilu. |
| F-UP-2 | Umjetnici mogu dodavati, uređivati i brisati djela u portfoliju | Visok | ArtConnect.pdf; Dogovor tima | Umjetnik može dodati djelo s osnovnim podacima i datotekama te ga urediti ili obrisati. Novo djelo je zadano privatno. Naziv i barem jedna datoteka su obavezni.|
| F-UP-3 | Umjetnici mogu odrediti vidljivost svojih djela | Visok | ArtConnect.pdf; Dogovor tima | Umjetnik može označiti djelo kao javno ili privatno i pregledati ga kao javni korisnik. Privatno djelo nije javno vidljivo. |

#### F-OB: Obavijesti (UMJETNIK i ORGANIZATOR)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-OB-1 | Korisnici mogu pregledavati obavijesti u Inboxu | Srednji | Dogovor tima | Korisnik vidi obavijesti (prijave, dopune, pozivi) i broj nepročitanih, a klikom obavijest postaje pročitana. |
| F-OB-2 | Korisnici mogu odabrati koje vrste obavijesti žele primati | Nizak | Dogovor tima | Korisnik može isključiti pojedinu vrstu obavijesti i više je ne prima. |

#### F-UW: Umjetnik - Lista želja (UMJETNIK WISHLIST)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-UW-1 | Umjetnici mogu spremati otvorene prilike na listu želja | Nizak | Dogovor tima | Umjetnik dok priprema potrebnu dokumentaciju može dodati priliku na listu želja, ukloniti je i prijaviti se na nju izravno s liste kada pripremi sve što mu treba. |

#### F-PP: Umjetnik - prijave na prilike (PRIJAVE PRILIKE)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-PP-1 | Umjetnici se mogu prijaviti na otvorene prilike | Visok | ArtConnect.pdf; Dogovor tima | Umjetnik može predati prijavu s djelima iz portfolija, uz poruku i privitke. Prijava dobiva status "Predana", a ponovna prijava na istu priliku nije moguća. |
| F-PP-2 | Umjetnici mogu pratiti i povlačiti svoje prijave | Visok | ArtConnect.pdf; Dogovor tima | Umjetnik vidi status svake prijave i može je povući dok je prilika otvorena za prijave. |
| F-PP-3 | Umjetnici mogu dopuniti prijavu i vidjeti razlog odbijanja | Visok | ArtConnect.pdf | Na zahtjev organizatora umjetnik može dodati materijale, nakon čega se prijava vraća u pregled. Uz odbijenu prijavu vidi razlog. |
| F-PP-4 | Umjetnici mogu dodati događanje u Google Calendar | Srednji | ArtConnect.pdf | Nakon prihvaćanja prijave umjetnik može dodati događanje u svoj kalendar s ispravnim podacima. |
| F-PP-5 | Sudjelovanja se prikazuju na profilu umjetnika | Visok | ArtConnect.pdf | Nakon završetka odabira pobjednik vidi sudjelovanje na svom profilu te ga može sakriti ili istaknuti. |

#### F-OU: Organizator - pozivanje i blokiranje umjetnika (ORGANIZATOR UMJETNICI)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-OU-1 | Organizatori mogu pozivati i blokirati umjetnike | Nizak | Dogovor tima | Organizator može pozvati umjetnika na otvorenu priliku te ga blokirati ili odblokirati. Pozvani umjetnik dobiva obavijest, a blokirani se ne može prijaviti na prilike tog organizatora. |

#### F-OS: Organizator - postavke (ORGANIZATOR SETTINGS)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-OS-1 | Organizatori mogu uređivati svoj profil | Visok | Dogovor tima | Organizator može izmijeniti ime, prezime i naziv organizacije, a izmjene su vidljive na javnom profilu. |

#### F-ON: Organizatori - prilike (ORGANIZATOR NATJEČAJI)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-ON-1 | Organizatori mogu objavljivati nove prilike | Visok | ArtConnect.pdf | Organizator može unijeti osnovne podatke o prilici i spremiti je, a uz unesenu adresu lokacija se prikazuje na karti. |
| F-ON-2 | Organizatori mogu upravljati svojim prilikama | Visok | ArtConnect.pdf; Dogovor tima | Organizator vidi, uređuje i briše samo svoje prilike. Rok se nakon objave može samo produžiti, a priliku s prijavama nije moguće obrisati. |
| F-ON-3 | Organizatori mogu mijenjati status prilike | Visok | ArtConnect.pdf; Dogovor tima | Organizator može mijenjati status prilike, a po isteku roka prilika se automatski zatvara za prijave. |
| F-ON-4 | Organizatori mogu pregledavati prijave i tražiti dopunu | Visok | ArtConnect.pdf | Organizator vidi prijave na svoje prilike i može zatražiti dopunu porukom, nakon čega prijava dobiva status "Potrebna dopuna". |
| F-ON-5 | Organizatori mogu odabrati pobjednike | Visok | ArtConnect.pdf | Organizator može označiti pobjednike, upisati razlog odbijanja ostalih i završiti odabir, nakon čega su rezultati objavljeni, a umjetnici obaviješteni. |
| F-ON-6 | Organizatori mogu pregledavati osnovne statistike | Srednji | ArtConnect.pdf | Organizator za svoje prilike vidi točan broj prijava po području i prilici te broj pobjednika. |

#### F-AD: Administrator (ADMIN)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-AD-1 | Administrator može upravljati šifrarnicima i postavkama sustava | Visok | ArtConnect.pdf | Administrator može dodavati, preimenovati i deaktivirati područja umjetnosti i vrste prilika te mijenjati osnovne postavke sustava. |
| F-AD-2 | Administrator može upravljati korisnicima i sadržajem | Visok | ArtConnect.pdf | Administrator može ovjeriti organizatora, blokirati i brisati korisnike te uklanjati neprimjeren sadržaj uz unos razloga. |
| F-AD-3 | Administrator može pregledavati mjesečne izvještaje | Srednji | ArtConnect.pdf | Za odabrani mjesec administrator vidi broj registriranih umjetnika, objavljenih prilika i predanih prijava te ih može preuzeti kao CSV. |
 

<details>
<summary><strong>Izvori zahtjeva i kriteriji prihvaćanja</strong></summary>

Svaki zahtjev treba imati stabilan ID. **Izvor označava odakle zahtjev potječe**, primjerice iz odobrenog projektnog zadatka, zahtjeva dionika ili povratne informacije koja je promijenila zahtjev. Opišite opažljivo ponašanje umjesto naziva zaslona ili programskog okvira. U cijeloj dokumentaciji koristite istu ljestvicu prioriteta. Složenu korisničku interakciju objasnite u odgovarajućem obrascu uporabe umjesto kopiranja cijelog tijeka u ovu tablicu.

**Primjer - funkcijski zahtjevi za aplikaciju CrisisMap:**

Kategorije izvora pokazuju različite načine na koje zahtjev može nastati.

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-001 | Sustav omogućuje korisniku registraciju računa pomoću adrese e-pošte. | Visok | Zahtjev dionika | Korisnik se može registrirati adresom e-pošte, primiti poruku za potvrdu i aktivirati račun slijedeći poveznicu. |
| F-002 | Sustav omogućuje oporavak lozinke putem e-pošte. | Srednji | Zahtjev dionika | Korisnik može zatražiti ponovno postavljanje lozinke, primiti poveznicu i uspješno postaviti novu lozinku. |
| F-003 | Sustav prikazuje popis dostupnih resursa povezanih s kriznim događajima. | Visok | Postojeći sustav | Korisnik može pregledati ažurirani popis resursa relevantnih za vrstu kriznog događaja, lokaciju i raspoloživost. |
| F-004 | Sustav omogućuje korisnicima podnošenje prijave kriznog događaja s lokacijom. | Visok | Dokument sa zahtjevima | Korisnik može podnijeti prijavu s vrstom kriznog događaja, razinom ozbiljnosti i lokacijom te dobiti potvrdu o zaprimanju. Ako odbije pristup geolokaciji preglednika, može lokaciju odabrati ručno.|
| F-005 | Sustav šalje korisnicima obavijesti o relevantnim promjenama u njihovoj blizini. | Visok | Povratna informacija korisnika | Korisnici dobivaju obavijest unutar jedne minute od relevantne promjene za njihovu lokaciju. |
| F-006 | Sustav prikazuje dostupne resurse prema lokaciji. | Visok | Analiza dokumentacije | Prikazuje se ažurirani popis resursa prilagođen vrsti kriznog događaja, lokaciji i raspoloživosti. |
| F-007 | Sustav prikazuje prijave kriznih događaja s lokacijom kao oznake na karti. | Visok | Odobreni zadatak | Prijava s valjanom lokacijom prikazuje se kao oznaka na karti; odabirom oznake korisnik može otvoriti pripadajuću prijavu. |
| F-008 | Sustav omogućuje moderatoru odobravanje ili odbijanje podnesenih prijava. | Visok | Zahtjev dionika | Moderator može odobriti ili odbiti prijavu koja čeka pregled; korisnik bez moderatorskih ovlasti ne može izvršiti te radnje. |

**Kriteriji prihvaćanja i podrijetlo zahtjeva:** Primjer prikazuje registraciju, oporavak lozinke, resurse, prijavu kriznog događaja i obavijesti te nekoliko vrsta izvora i opažljivih kriterija. Istodobno otvara korisna pitanja: opisuju li F-003 i F-006 istu funkcionalnost resursa? Je li obećanje od jedne minute u F-005 dogovoreno i moguće ispitati? Treba li aplikaciji koja koristi isključivo OAuth uopće F-001 i F-002? Retke koristite kao materijal za analizu; u svojem projektu navedite vlastite zahtjeve. U stvarnom projektu stupac Izvor bilježi odakle su doista potekli njegovi zahtjevi.

**Primjer prilagodbe kada odobreni zadatak koristi OAuth i kartu:** Umjesto kopiranja registracije e-poštom i oporavka lozinke formulirajte relevantni zahtjev za prijavu, primjerice: „F-001: Korisnici se prijavljuju putem odobrenog OAuth pružatelja identiteta; uspješna prijava omogućuje radnje rezervirane za prijavljene korisnike, a odustajanje od prijave ostavlja te radnje nedostupnima.” Zaseban zahtjev za kartu može glasiti: „F-007 : Prijave s lokacijom prikazuju se kao oznake na karti; odabirom oznake otvara se pripadajuća prijava.” Izvor treba biti stvarni odobreni zadatak ili dogovoreni zahtjev dionika. Ova je prilagodba zamjena za neodgovarajuće retke, a ne dodatna tablica koju svaki tim mora ispuniti.

Za složenu interakciju kratak scenarij *Given / When / Then* može pojasniti kriterij. Primjerice: *Given* prijava bez lokacije, *when* građanin je podnese, *then* sustav objašnjava da lokacija nedostaje i ne pohranjuje prijavu. Nemojte jednostavan kriterij ponavljati i u prozi i u Gherkinu niti pisati Gherkin za svaki zahtjev.

</details>


## 2.2 Nefunkcijski zahtjevi

**Cilj:** Odrediti važna svojstva kvalitete i uvjete rada odobrene aplikacije na način koji tim može razumno provjeriti.

## 2.2 Nefunkcijski zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-01 | Sustav mora sve rokove za prijavu spremati u UTC-u, a korisnicima ih prikazivati po vremenskoj zoni Europe/Zagreb. Poslužitelj mora odbiti svaku prijavu poslanu nakon isteka roka ili na priliku čiji status nije "otvoreno za prijave", čak i ako je zahtjev poslan izravno, mimo sučelja. | Visok | Upute zadatka; odluka tima | Postupak: poslati prijavu minutu prije i minutu nakon roka te izravnim pozivom API-ja na priliku u statusu "priprema". Očekivani ishod: prihvaćena je samo prva prijava, ostale završavaju porukom o grešci bez promjene u bazi. |
| NF-02 | Sustav mora za djela u portfoliju i materijale uz prijavu prihvaćati isključivo datoteke formata JPG, PNG i PDF veličine do 10 MB. Format se utvrđuje iz stvarnog sadržaja datoteke na poslužitelju, a ne iz nastavka u imenu. | Srednji | Odluka tima | Postupak: učitati datoteku od 12 MB, datoteku `.exe` preimenovanu u `.jpg` i ispravnu PNG sliku. Očekivani ishod: prihvaćena je samo PNG slika, za ostale korisnik dobiva razumljivu poruku. |
| NF-03 | Sustav mora djela koja umjetnik nije označio kao javna, kao i materijale priložene uz prijave, učiniti nedostupnima svima osim vlasniku, organizatoru prilike kojoj je prijava namijenjena i administratoru. Ograničenje vrijedi i za izravne poveznice na datoteke. | Visok | Upute zadatka | Postupak: kopirati poveznicu na privatno djelo i otvoriti je bez prijave te kao drugi umjetnik. Očekivani ishod: sadržaj se ne prikazuje ni u jednom slučaju. |
| NF-04 | Sustav mora prava pristupa provjeravati na poslužitelju pri svakom zahtjevu, prema ulozi korisnika (umjetnik, organizator, administrator) i vlasništvu nad podacima. Neautenticirani zahtjev odbija se statusom 401 Unauthorized, a zahtjev korisnika bez potrebne uloge ili vlasništva statusom 403 Forbidden. | Visok | Upute zadatka; odluka tima | Postupak: automatizirani testovi koji svaku zaštićenu krajnju točku pozivaju bez tokena i s tokenom svake uloge, uključujući organizatora koji pokušava mijenjati tuđu priliku. Očekivani ishod: statusi odgovaraju opisanim pravilima. |
| NF-05 | Sustav mora identitet korisnika utvrđivati preko vanjskog pružatelja identiteta (Google) protokolom OAuth 2.0, bez vođenja vlastite evidencije lozinki. | Visok | Upute zadatka | Postupak: proći registraciju i prijavu kao umjetnik i kao organizator te pregledati shemu baze. Očekivani ishod: oba toka prolaze preko Googlea, a baza ne sadrži lozinke ni njihove sažetke. |
| NF-06 | Sustav mora u statistikama organizatora i mjesečnim izvještajima administratora iskazivati samo zbirne vrijednosti, bez imena, kontakata ili drugih osobnih podataka pojedinih umjetnika. | Srednji | Odluka tima (GDPR) | Postupak: pregledati odgovore krajnjih točaka za statistike i izvještaje na testnim podacima. Očekivani ishod: odgovori sadrže samo brojeve i nazive kategorija. |
| NF-07 | Ako Google Maps API ili Google Calendar API ne odgovore unutar 5 sekundi, sustav mora nastaviti s radom: lokacija prilike prikazuje se kao tekstualna adresa, a umjesto dodavanja u kalendar nudi se preuzimanje događaja u obliku `.ics` datoteke. | Srednji | Odluka tima | Postupak: na testnoj okolini preusmjeriti pozive prema Googleovim domenama na lažni poslužitelj koji ne odgovara. Očekivani ishod: pregled prilika i slanje prijava rade bez prekida, uz zamjenski prikaz. |
| NF-08 | Sustav mora biti dostupan isključivo preko šifrirane veze (TLS), a obrada korisničkog unosa mora spriječiti napade iz skupine OWASP Top 10, posebno SQL injection, XSS i CSRF. Povjerljive konfiguracijske vrijednosti (OAuth client secret, ključevi API-ja) učitavaju se iz varijabli okruženja i ne smiju se pojaviti u povijesti repozitorija. | Visok | Sigurnosna praksa (OWASP) | Postupak: automatsko skeniranje produkcijske adrese alatom OWASP ZAP i pretraga repozitorija alatom gitleaks. Očekivani ishod: nema nalaza visoke razine rizika ni otkrivenih tajni. |
| NF-09 | Sustav mora svake noći automatski izraditi sigurnosnu kopiju baze podataka, a kopije starije od 14 dana brišu se. Postupak vraćanja baze iz kopije mora biti zapisan u dokumentaciji. | Srednji | Odluka tima | Postupak: provjeriti popis izrađenih kopija i vratiti jednu od njih na zasebnu bazu prema zapisanom postupku. Očekivani ishod: vraćena baza sadrži podatke s dana izrade kopije. |
| NF-10 | Spajanje promjena u glavnu granu mora biti dopušteno tek nakon uspješnog izvođenja testova te pregleda koda od strane barem jednog člana tima koji nije autor promjene. | Srednji | Odluka tima | Timska odgovornost i osobe zadužene za provođenje test caseova. |
| NF-11 | Sustav mora sve tekstove sučelja, obavijesti i poruke o greškama prikazivati na hrvatskom jeziku, a datume u obliku dd.mm.gggg. | Nizak | Odluka tima | Postupak: proći glavne stranice i namjerno izazvati nekoliko grešaka pri unosu. Očekivani ishod: svi tekstovi i datumi su u zadanom jeziku i obliku. |

<details>
<summary><strong>Nefunkcijski zahtjevi za analizu</strong></summary>

Relevantna svojstva mogu se odnositi na uporabljivost, pristupačnost, sigurnost, performanse ili pouzdanost. Odaberite svojstva specifična za projekt i opišite kako ih je moguće provjeriti. Zahtjev navodi što se očekuje; stvarna opažanja i dokazi pripadaju rezultatima ispitivanja, a ne drugom stupcu s rezultatima u ovoj tablici.

**Primjer - nefunkcijski zahtjevi za aplikaciju CrisisMap:**

| ID | Opis | Prioritet | Izvor |
| --- | --- | --- | --- |
| NF-1.1 | Sustav mora podržati 1.000 istodobnih korisnika uz vrijeme odziva kraće od 1 s. | Visok | SLA | Opteretiti sustav zadanim brojem istodobnih korisnika i izmjeriti vrijeme odziva. |
| NF-1.2 | Svi osjetljivi podaci moraju biti šifrirani algoritmom AES-256. | Visok | Sigurnosna politika | Pregledati način pohrane i konfiguraciju šifriranja za podatke na koje se zahtjev odnosi. |
| NF-1.3 | Korisničko sučelje mora podržavati engleski i španjolski jezik. | Srednji | Povratna informacija dionika | Pregledati reprezentativne korisničke tijekove u oba jezika. |
| NF-1.4 | Dostupnost sustava mora iznositi najmanje 99,5 % mjesečno. | Visok | SLA | Izračunati mjesečnu dostupnost iz zapisa sustava za nadzor, ako takvi podaci postoje.|
| NF-3.1.7 | Sustav treba imati odgovarajuću dokumentaciju. | Visok | Pravila dokumentiranja | Pregledati zahtijevane dokumentaciju prema obavezama.|
| NF-3.1.7.1 | Kod sustava treba biti dokumentiran prema „Code Conventions for the Java Programming Language”. | Visok | Pravila dokumentiranja | Pregledati kod. |
| NF-3.1.7.2 | Sustav treba biti opisan projektnim dokumentom/SRS-om. | Visok | Pravila dokumentiranja | Pregledati strukturu dokumenta  |
| NF-3.1.7.3 | Sustav treba imati „Operativni priručnik” koji opisuje pravilnu uporabu. | Visok | Pravila dokumentiranja | Pregledati postoji li priručnik i mogu li se prema njemu izvršiti opisane radnje. |
| NF-3.1.7.4 | Sustav treba imati „Plan implementacije” za pravilno postavljanje. | Visok | Smjernice za postavljanje | Pregledati odgovara li opisani postupak stvarnom postupku postavljanja.|

**Provjerljivost i opseg:** Primjer uvodi performanse, sigurnost, lokalizaciju, dostupnost i dokumentaciju, uključujući hijerarhijski ID zahtjeva. Navedeni izvori primjeri su podrijetla zahtjeva, a ne dokaz da za studentski projekt stvarno postoji SLA ili sigurnosna politika. Vrijednosti poput 1.000 korisnika, 99,5 % mjesečne dostupnosti i AES-256 moraju imati odobren izvor i izvediv način provjere prije nego što postanu zahtjevi tima. Skup zahtjeva o dokumentaciji ilustrira razlaganje zahtjeva, ali zahtjevi za izradu *ove dokumentacije kolegija* u pravilu pripadaju uputama zadatka, a ne zahtjevima kvalitete web-aplikacije.

**Primjer prilagodbe:** Ako je pristupačnost zahtjevana za  projekt, projektno specifičan zahtjev može glasiti: „NF-01: Sve obavezne radnje u obrascu za podnošenje prijave moguće je izvršiti samo tipkovnicom, uz vidljiv fokus na aktivnoj kontroli.” Provjera: navigirati kroz obrazac bez pokazivačkog uređaja, odabrati ili unijeti lokaciju, poslati prijavu i provjeriti može li se pročitati rezultat. To je provjerljivo svojstvo kvalitete, a ne dodatna funkcionalnost koju svaki projekt mora implementirati.

</details>

## 2.3 Dionici i akteri

**Cilj:** Utvrditi uloge koje utječu na zahtjeve i razlikovati dionike od aktera koji komuniciraju s aplikacijom.

| ID uloge ili aktera | Odnos prema sustavu | Relevantni zahtjevi |
| --- | --- | --- |
| A-01 Neprijavljeni posjetitelj | Primarni akter. Pregledava javna djela, umjetnike, aktivne i završene prilike te rezultate. Može se registrirati ili prijaviti u sustav, ali se ne može prijaviti na priliku. | F-RL-1 - F-RL-3; F-NU-1 - F-NU-3 |
| A-02 Umjetnik | Primarni akter. Uređuje profil i portfolio, vodi listu želja, prijavljuje se na prilike, povlači i dopunjuje prijave, prati njihov status, dodaje događanja u kalendar i prikazuje sudjelovanja na profilu. Ima i sve mogućnosti posjetitelja. | F-RL-1 - F-RL-3; F-NU-1 - F-NU-3; F-UP-1 - F-UP-3; F-OB-1, F-OB-2; F-UW-1; F-PP-1 - F-PP-5 |
| A-03 Organizator | Primarni akter (galerije, kulturne institucije i organizatori događanja). Stvara, objavljuje i uređuje prilike, upravlja njihovim životnim ciklusom, pregledava prijave, traži dopune, označava pobjednike, prati statistike te poziva ili blokira umjetnike. | F-RL-1 - F-RL-3; F-OB-1, F-OB-2; F-OS-1; F-ON-1 - F-ON-6; F-OU-1 |
| A-04 Administrator | Primarni akter. Upravlja područjima umjetnosti i vrstama prilika, ovjerava organizatore, blokira i briše korisnike, uklanja neprimjeren sadržaj, mijenja postavke sustava i pregledava mjesečne izvještaje. Račun mu je unaprijed definiran u sustavu. | F-RL-1 - F-RL-3; F-AD-1 - F-AD-3 |
| A-05 Google OAuth 2.0 | Sekundarni (vanjski) akter. Pružatelj identiteta koji potvrđuje Google račun pri registraciji i prijavi u sustav. | F-RL-1 |
| A-06 Google Maps API | Sekundarni (vanjski) akter. Provjerava unesenu adresu i prikazuje lokaciju prilike na karti. | F-ON-1 |
| A-07 Google Calendar API | Sekundarni (vanjski) akter. Nakon autorizacije umjetnika stvara događaj u njegovom osobnom kalendaru. | F-PP-4 |
| A-08 Vremenski okidač | Sekundarni akter. Pokreće radnje vezane uz protek vremena: automatsko zatvaranje prijava po isteku roka i istek sesije. | F-ON-3; F-RL-2 |
| D-01 Nastavnici kolegija | Dionik, nije akter. Naručitelj projektnog zadatka: odobrava opseg i pregledava zahtjeve na kontrolnim točkama. | Svi zahtjevi s izvorom ArtConnect.pdf |
| D-02 Razvojni tim | Dionik, nije akter. Definira, implementira i ispituje sustav te donosi odluke označene kao "Dogovor tima". | Svi zahtjevi s izvorom "Dogovor tima" |

<details>
<summary><strong>Akteri i povezani zahtjevi</strong></summary>

**Primjer - akteri aplikacije CrisisMap:**

| ID aktera | Uloga | Obuhvaćeni funkcijski zahtjevi |
| --- | --- | --- |
| A-01 | Koordinator pomoći | F-003: Pregled resursa; F-004: Podnošenje prijave kriznog događaja. |
| A-02 | Građanin | F-001: Izrada računa; F-005: Primanje obavijesti. |
| A-03 | Administrator sustava | NF-1.2: Provođenje sigurnosnih pravila; upravljanje korisnicima. |
| A-04 | Posjetitelj | F-007: Pregled prijava na karti. |
| A-05 | Moderator | F-008: Odobravanje ili odbijanje prijava. |

**Odgovornosti aktera:** Uloga aktera treba biti povezana s interakcijom, a ne samo s nazivom. Provjerite podnosi li koordinator pomoći u odobrenom zadatku doista prijave kriznih događaja. Poveznica administratora s NF-1.2 navodi sigurnosni aspekt, ali sama po sebi ne opisuje obrazac uporabe; navedite stvarnu radnju administratora ili izostavite ulogu ako je nema. Nastavnici zainteresirani za rezultat mogu biti dionici, a da nisu akteri aplikacije. Tablica je polazište za razmišljanje, a ne potvrđen opis ovlasti u CrisisMapu.

</details>

---

## 2.4 Ograničenja i pretpostavke

**Cilj:** Zabilježiti projektno specifične granice i pretpostavke koje utječu na zahtjeve ili oblikovanje, zajedno s njihovim izvorom i praktičnom posljedicom. Ovo je njihovo mjerodavno mjesto u dokumentaciji.

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Inženjerska posljedica / Provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ograničenje | Sustav je web platforma s tri uloge: umjetnik, organizator i administrator.| ArtConnect.pdf | Aplikacija se izrađuje kao web-klijent s poslužiteljskim API-jem, a mobilne aplikacije nisu u opsegu. |
| C-02 | Ograničenje | Registracija i prijava isključivo putem OAuth 2.0; tim je odabrao Google.| ArtConnect.pdf; Dogovor tima | Sustav ne pohranjuje lozinke, a korisnik bez Google računa ne može koristiti platformu. |
| C-03 | Ograničenje | Lokacija se prikazuje putem Google Maps, a događanje se dodaje u Google Calendar.| ArtConnect.pdf | API ključevi ne smiju biti u javnom repozitoriju, a ponašanje pri nedostupnosti servisa opisano je u NF-07. |
| C-04 | Ograničenje | Korištenje platforme je besplatno.| ArtConnect.pdf | Sustav nema naplate ni plaćenih paketa. |
| C-05 | Ograničenje | Projekt se razvija unutar trajanja kolegija s kontrolnim točkama.| ArtConnect.pdf | Zahtjevi visokog prioriteta implementiraju se prvi, a oni niskog prioriteta mogu se odgoditi uz zapis u odjeljku 2.5. |
| AS-01 | Pretpostavka | Besplatne kvote AWS-a i Google API-ja dovoljne su za razvoj i demonstraciju.| Procjena tima | Pratiti potrošnju tijekom razvoja i postaviti eventualno ograničenje potrošnje. |
| AS-02 | Pretpostavka | Organizatori unose stvarne adrese koje kartografski servis može prepoznati. | Procjena tima | Prepoznavanje adresa provjerava se na uzorku stvarnih adresa. |
| AS-03 | Pretpostavka | Sustav koristi do oko 100 korisnika i nekoliko stotina djela.| Procjena tima | Dovoljna je jednostavna arhitektura s jednim poslužiteljem i jednom bazom podataka. |
| AS-04 | Pretpostavka | Svi rokovi i datumi odnose se na vremensku zonu Europe/Zagreb. | Dogovor tima | Vremena se pohranjuju u UTC-u, a korisnicima prikazuju u zoni Europe/Zagreb. |
| AS-05 | Pretpostavka | Obavijesti se šalju samo unutar aplikacije, a sadržaj se objavljuje bez odobravanja uz naknadnu moderaciju.| Dogovor tima | E-pošta nije u opsegu, a neprimjeren sadržaj naknadno uklanja administrator (F-AD-2). |

<details>
<summary><strong>Ograničenja nasuprot pretpostavkama</strong></summary>

Ograničenje je uvjet koji tim mora poštovati; pretpostavka je uvjet na koji se tim oslanja i koji treba ponovno provjeravati.

**Primjer - projektni kontekst CrisisMapa:**

| ID | Ograničenje ili pretpostavka | Izvor | Posljedica ili način provjere |
| --- | --- | --- | --- |
| C-01 | Odobreni zadatak zahtijeva OAuth prijavu u sustav za uređivanje vlastitih prijava korisnika. | Odobreni zadatak  | Zaštićeno uređivanje projektirati oko odabranog pružatelja identiteta; provjeriti autorizirane i neautorizirane zahtjeve. |
| AS-01 | Prijave koje se prikazuju na karti imaju uporabive koordinate. | Pretpostavka o podacima  | Pregledati ogledne i uvezene prijave; planirati prikaz prijava bez valjanih koordinata. |

**Ograničenje nasuprot pretpostavci:** C-01 navodi obvezujuću odluku i njezin arhitekturni učinak; AS-01 je moguće provjeriti i može se pokazati netočnim. Nemojte kopirati C-01 ako OAuth nije dio stvarnog odobrenog zadatka. Projektni odgovor objasnite u arhitekturi bez prepisivanja ove tablice.

</details>

---

## 2.5 Značajne promjene zahtjeva

**Cilj:** Sačuvati razlog promjena koje mijenjaju dogovoreni opseg, prioritet ili kriterije prihvaćanja, uz istodobno održavanje prethodnih zahtjeva ažurnima.

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| 1.11.2026. | F-RL-1 - F-AD-3 | Zahtjevi u odjeljku 2.1 sažeti su spajanjem srodnih zahtjeva (npr. registracija i prijava u F-RL-1), a kriteriji prihvaćanja skraćeni su na to što mora vrijediti. Opseg i funkcionalnosti se ne mijenjaju. Prethodna verzija sačuvana je u dokumentu "Stara analiza zahtjeva".| Uputa asistentice na laboratorijskoj vježbi  |

<details>
<summary><strong>Primjer značajne promjene</strong></summary>

**Primjer scenarija - odluka tijekom pregleda CrisisMapa:**

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| [Datum pregleda] | F-004, NF-01 | Dodati ručni odabir lokacije kada korisnik odbije geolokaciju preglednika; bez toga građanin ne može podnijeti prijavu kriznog događaja s lokacijom. | [Poveznica na stvarnu bilješku pregleda ili zadatak tima] |

**Razlog promjene:** Zapis navodi zahvaćene stavke i objašnjava razlog iz perspektive korisnika, a zatim upućuje na dokaz odluke.  Nakon stvarne odluke ažurirajte trenutačne zahtjeve; stilska izmjena teksta ne zahtijeva zapis u dnevniku promjena. Trenutačni red zadataka držite u alatu za praćenje zadataka.

</details>

---

## 2.6 Sljedivost zahtjeva

**Cilj:** Osigurati dvosmjernu sljedivost - povezati zahtjeve s opisanim ponašanjem, dijelovima sustava koji ih ostvaruju te ispitivanjem ili drugom provjerom. 

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
| --- | --- | --- | --- |
| F-RL-1 | UC-01 Registracija i prijava korisnika | Web-klijent; Modul autentifikacije (Google OAuth 2.0); Modul korisnika | ST-01 Registracija umjetnika; ST-02 Registracija organizatora; ST-03 Odbijena autorizacija na Googleu; CT-01 Ponovna registracija u postojećoj ulozi; ST-04 Prijava registriranog korisnika; ST-05 Prijava neregistriranim računom; ST-06 Prijava blokiranog korisnika |
| F-RL-2 | UC-02 Odjava korisnika| Web-klijent; Upravljanje sesijom; Modul postavki sustava| ST-07 Odjava i povratak gumbom "Natrag"; CT-02 Istek sesije; CT-03 Produljenje sesije aktivnošću |
| F-RL-3 | Kontrola pristupa (vrijedi za sve obrasce uporabe prijavljenih korisnika) | Autorizacijski filtar na poslužitelju| ST-08 Dashboard bez prijave; CT-04 Dashboard druge uloge |
| F-NU-1 | UC-03 Pregled javnog sadržaja| Web-klijent; Modul portfolija; Modul pretraživanja; Modul korisnika| ST-09 Prikaz javnih djela; CT-05 Pretraga djela; ST-10 Pretraga umjetnika i javni profil |
| F-NU-2 | UC-03 Pregled javnog sadržaja| Web-klijent; Modul prilika; Modul pretraživanja| ST-11 Popis aktivnih prilika; CT-06 Pretraga i filtriranje prilika |
| F-NU-3 | UC-03 Pregled javnog sadržaja | Modul prilika; Modul pretraživanja | ST-12 Popis završenih prilika; ST-13 Pobjednici završene prilike |
| F-UP-1 | UC-04 Upravljanje profilom i obavijestima | Web-klijent; Modul korisnika; Modul administracije (šifrarnik područja) | CT-08 Prazna polja profila; ST-19 Uređivanje profila; CT-13 Profil bez područja djelovanja; CT-14 Neispravna poveznica |
| F-UP-2 | UC-05 Upravljanje portfolijem| Web-klijent; Modul portfolija; Pohrana datoteka; Modul prijava; Modul postavki sustava | ST-14 Prikaz portfolija; ST-15 Dodavanje djela; CT-09 Neispravna godina nastanka; ST-16 Uređivanje djela; ST-17 Brisanje djela; CT-10 Brisanje djela iz aktivne prijave; CT-11 Neispravna datoteka |
| F-UP-3 | UC-05 Upravljanje portfolijem | Web-klijent; Modul portfolija; Autorizacijski filtar | CT-12 Vidljivost privatnog djela; ST-18 Pregled djela kao javni korisnik |
| F-OB-1 | UC-04 Upravljanje profilom i obavijestima| Web-klijent; Modul obavijesti | CT-07 Nepročitane obavijesti; CT-17 Obavijesti organizatora |
| F-OB-2 | UC-04 Upravljanje profilom i obavijestima| Modul obavijesti | CT-15 Isključena vrsta obavijesti |
| F-UW-1 | UC-06 Prijava na priliku| Web-klijent; Modul prilika (lista želja) | CT-16 Dodavanje i uklanjanje s liste želja; ST-20 Prikaz liste želja |
| F-PP-1 | UC-06 Prijava na priliku | Web-klijent; Modul prijava; Pohrana datoteka | ST-35 Prijava na priliku; CT-32 Prijava bez odabranog djela; CT-33 Ponovna prijava na istu priliku |
| F-PP-2 | UC-07 Praćenje i dopuna prijava | Web-klijent; Modul prijava; Pohrana datoteka | ST-36 Povlačenje prijave; CT-34 Povlačenje nakon zatvaranja prijava; ST-37 Pregled prijava i povijesti |
| F-PP-3 | UC-07 Praćenje i dopuna prijava | Modul prijava; Modul obavijesti | ST-29 Zahtjev za dopunom i slanje dopune; ST-34 Završetak odabira i razlog odbijanja |
| F-PP-4 | UC-08 Dodavanje događanja u kalendar | Integracija Google Calendar | ST-38 Dodavanje događanja u kalendar; ST-39 Odbijena autorizacija kalendara |
| F-PP-5 | UC-07 Praćenje i dopuna prijava | Modul korisnika | ST-40 Prikaz, skrivanje i isticanje sudjelovanja |
| F-ON-1 | UC-09 Upravljanje prilikama | Web-klijent; Modul prilika; Pohrana datoteka; Integracija Google Maps | ST-26 Stvaranje prilike; CT-19 Neispravni datumi i prazna obavezna polja; CT-20 Sigurnost unesenog opisa; ST-27 Prikaz lokacije na karti; CT-21 Neprepoznata adresa |
| F-ON-2 | UC-09 Upravljanje prilikama | Web-klijent; Modul prilika | ST-21 Popis vlastitih prilika; CT-22 Promjena roka; CT-23 Brisanje prilike s prijavama |
| F-ON-3 | UC-09 Upravljanje prilikama; automatsko zatvaranje (A-08) | Automat stanja prilike; Planer zadataka | CT-28 Nedopuštena promjena statusa; CT-29 Automatsko zatvaranje po isteku roka; ST-31 Objava prilike; CT-30 Objava s isteklim rokom; ST-32 Zatvaranje i ponovno otvaranje; ST-33 Pokretanje odabira |
| F-ON-4 | UC-10 Pregled prijava i odabir pobjednika; UC-06 Praćenje i dopuna prijave (dopuna) | Modul prijava; Modul obavijesti | ST-28 Pregled prijava; CT-24 Promjena statusa pri prvom otvaranju; ST-29 Zahtjev za dopunom i slanje dopune; CT-25 Dopuna u procesu odabira |
| F-ON-5 | UC-10 Pregled prijava i odabir pobjednika | Automat stanja prilike; Modul prijava; Modul obavijesti | ST-30 Označavanje pobjednika i razlog odbijanja; CT-26 Označavanje skriveno od umjetnika; ST-34 Završetak odabira i razlog odbijanja; CT-31 Završetak odabira bez razloga odbijanja |
| F-ON-6 | UC-10 Pregled prijava i odabir pobjednika | Modul izvještaja (statistike) | CT-27 Točnost statistika |
| F-OS-1 | UC-03 Upravljanje profilom i obavijstima | Web-klijent; Modul korisnika | ST-24 Uređivanje podataka organizatora |
| F-OU-1 | UC-11 Pozivanje i blokiranje umjetnika | Modul korisnika; Modul obavijesti; Modul prijava | ST-22 Poziv umjetnika; CT-18 Ponovni poziv i poziv blokiranog umjetnika; ST-23 Prijava blokiranog umjetnika; ST-25 Odblokiranje umjetnika |
| F-AD-1 | UC-12 Upravljanje platformom | Modul administracije; Modul postavki sustava | CT-35 Upravljanje područjima i vrstama; CT-37 Promjena postavki sustava |
| F-AD-2 | UC-12 Upravljanje platformom | Modul administracije; Modul autentifikacije; Modul obavijesti | ST-41 Ovjera organizatora; ST-42 Blokiranje i brisanje korisnika; CT-36 Blokiranje i brisanje vlastitog računa; ST-43 Uklanjanje djela i prilike |
| F-AD-3 | UC-13 Pregled mjesečnih izvještaja | Modul izvještaja | CT-38 Točnost izvještaja; ST-44 Preuzimanje izvještaja |

<details>
<summary><strong>Sljedivost zahtjeva do obrazaca uporabe i ispitivanja</strong></summary>

**Primjer - poveznice zahtjeva CrisisMapa:**

| ID zahtjeva | Obrazac uporabe / ponašanje | Arhitekturna realizacija | Ispitivanje / provjera |
| --- | --- | --- | --- |
| F-004 | UC-002 Podnošenje prijave kriznog događaja | Web-klijent; API za prijave; usluga za prijave | ST-01 Valjano podnošenje prijave; ST-02 Nedostaje obavezna lokacija; ST-03 Dopuštenje geolokacije odbijeno |
| F-005 | Odabir primatelja obavijesti | Proces za obavijesti | CT-06 Primatelji obavijesti; potpuna dostava obavijesti nije pokrivena ovom provjerom |

**Pokrivenost i dokazi:** CT-06 provjerava odabir primatelja za F-005, ali sam po sebi ne dokazuje da je obavijest stvarno dostavljena; ako projekt zahtijeva potpunu dostavu od početka do kraja, za taj dio treba postojati zasebna provjera. Svaki redak pokazuje gdje je zahtjev opisan kao ponašanje, gdje je ostvaren u sustavu i gdje se nalazi dokaz njegove provjere. Zahtjev ne mora imati zaseban obrazac uporabe ako ne opisuje korisničku interakciju; tada navedite relevantno ponašanje, arhitekturni element ili drugi prikladan način realizacije. U svojem projektu koristite stvarne nazive komponenata, modula i provjera iz dokumentacije i implementacije. Nedostajuću poveznicu ostavite praznom ili označite kao *na čekanju* uz kratak razlog. Stvarni rezultati ispitivanja bilježe se uz ispitne slučajeve; ova tablica pokazuje gdje ih pronaći.

</details>

---

## 2.7 Pregled zahtjeva

**Cilj:** Zabilježiti važne povratne informacije o zahtjevima i odluke koje iz njih proizlaze na dvije formalne kontrolne točke projekta, u 7. i 14. tjednu.

| Kontrolna točka | Opseg koji se demonstrira | Obuhvaćeni zahtjevi |
| --- | --- | --- |
| Ciklus 1 (7. tjedan) | Pristup i uloge | F-RL-1 - F-RL-3; F-UP-1; F-OS-1 |
| Ciklus 1 (7. tjedan) | Portfolio | F-UP-2, F-UP-3; F-NU-1 |
| Ciklus 1 (7. tjedan) | Prilike | F-ON-1, F-ON-2; F-ON-3 (osim pokretanja odabira); F-NU-2 |
| Ciklus 1 (7. tjedan) | Administracija (preduvjeti) | F-AD-1 (šifrarnici područja i vrsta potrebni za registraciju i stvaranje prilika); postavke sustava koriste zadane vrijednosti bez administratorskog sučelja |
| Ciklus 2 (14. tjedan) | Prijave | F-PP-1 - F-PP-4; F-UW-1; F-OB-1, F-OB-2 |
| Ciklus 2 (14. tjedan) | Pregled za organizatora | F-ON-3 (pokretanje odabira); F-ON-4 - F-ON-6; F-NU-3; F-PP-5; F-OU-1|
| Ciklus 2 (14. tjedan) | Administracija | F-AD-2, F-AD-3 |

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Ciklus 1 (7. tjedan) | *Na čekanju:* pregled se održava u 7. tjednu. | *Na čekanju;* odluke će se zabilježiti u odjeljku 2.5. |
| Ciklus 2 (14. tjedan) | *Na čekanju:* pregled se održava u 14. tjednu. | *Na čekanju;* odluke će se zabilježiti u odjeljku 2.5. |
| Završni pregled | *Na čekanju:* pregled se održava pri završnoj predaji. | *Na čekanju;* odluke će se zabilježiti u odjeljku 2.5. |

<details>
<summary><strong>Odluke o zahtjevima nakon pregleda</strong></summary>

**Primjer scenarija - pregled zahtjeva CrisisMapa:**

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | Demonstracija pokazuje da odbijanje pristupa lokaciji preglednika onemogućuje podnošenje prijave. | Dogovoriti ručni odabir lokacije; ažurirati F-004 i primjer NF-01 te razlog zabilježiti u odjeljku 2.5. |

**Odluka povezana s povratnom informacijom:** Zapis povezuje opaženo ponašanje s konkretnom promjenom zahtjeva i izbjegava zapisnik cijelog sastanka. Zapišite samo stvarne povratne informacije i odluke za kontrolne točke. Konzultacije u nekom drugom tjednu ne stvaraju dodatnu obaveznu predaju.

</details>

---




>**Završna provjera:** Zahtjevi su aktualni, provjerljivi i povezani. Svaki važan zahtjev moguće je pratiti od njegova opisa i ponašanja preko mjesta realizacije u sustavu do odgovarajućeg ispitivanja ili druge provjere. Poveznice koriste stvarne identifikatore i nazive iz projektne dokumentacije.
