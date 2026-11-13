# 3. Obrasci uporabe

**Cilj:** Prikazati glavne interakcije između aktera aplikacije i sustava. Opišite kako akter ostvaruje cilj i što se događa kada važan korak ne uspije. Interakcije temeljite na odobrenim zahtjevima i ažurirajte ih kako se aplikacija razvija.

## 3.1 Dijagram obrazaca uporabe

**Cilj:** Prikazati granicu sustava, relevantne aktere i njihove glavne ciljeve u **preglednom UML dijagramu obrazaca uporabe**. Ako je za razumijevanje pojedinog dijela sustava potrebno prikazati više detalja, taj dio izdvojite u dodatni usmjereni dijagram. Dodatni dijagrami trebaju produbiti dio preglednog modela, a ne stvarati nepovezane ili duplicirane prikaze istog sustava.

![Dijagram obrazaca uporabe sustava ArtConnect](./diagrams/3-1-artconnect-UC.svg)

**Slika 3.1. Dijagram obrazaca uporabe sustava ArtConnect**

**PlantUML izvor:** [izvor](./puml/3-1-artconnect-UC.puml)

**Opis dijagrama:** Granica sustava obuhvaća 13 obrazaca uporabe grupiranih po područjima: pristup i javni pregled, profil i obavijesti, umjetnik (portfolio i prijave), organizator (prilike i odabir) te administracija platforme. Obrasci su formulirani kao korisnički ciljevi na višoj razini, pa jedan obrazac pokriva više srodnih funkcijskih zahtjeva (npr. UC-07 obuhvaća praćenje, povlačenje i dopunu prijave te prikaz sudjelovanja na profilu). Podrobniji koraci i alternative opisani su u specifikacijama u odjeljku 3.2. Cijeli model čitljivo stane u jedan dijagram, pa dodatni usmjereni dijagrami nisu potrebni.

Primarni akteri su Neprijavljeni posjetitelj, Umjetnik, Organizator i Administrator, kako su definirani u [odjeljku 2.3](./2-Analiza%20zahtjeva.md#23-dionici-i-akteri). Umjetnik, Organizator i Administrator generaliziraju apstraktnog aktera *Prijavljeni korisnik*, koji nosi ono što je zajedničko svim prijavljenim ulogama: odjavu korisnika (UC-02) i pregled javnog sadržaja (UC-03). Neprijavljeni posjetitelj registrira se i prijavljuje (UC-01) te pregledava javni sadržaj (UC-03), a nakon prijave postaje korisnik u svojoj ulozi. Apstraktni akter služi samo za grupiranje zajedničkih ovlasti i nije nova uloga u sustavu. Upravljanje profilom i pregled obavijesti (UC-04) dijele Umjetnik i Organizator.

Vanjski sustavi sudjeluju kao sekundarni akteri samo u obrascima u kojima izravno pomažu ostvariti korisnikov cilj: Google OAuth pri registraciji i prijavi korisnika (UC-01), Google Maps API pri unosu i prikazu lokacije prilike (UC-09), Google Calendar pri dodavanju događanja u kalendar (UC-08). Vremenski okidač sudjeluje u isteku sesije (UC-02) i u automatskom zatvaranju prijava po isteku roka (UC-09).

Dodavanje događanja u kalendar (UC-08) prikazano je kao `<<extend>>` obrasca UC-07 jer se nudi samo uz prijavu sa statusom „Prihvaćena”, a taj se status dodjeljuje tek završetkom odabira (UC-10), dakle znatno nakon što je tok predaje prijave (UC-06) završen. Bez toga proširenja UC-07 radi normalno. Drugi `<<include>>` i `<<extend>>` odnosi nisu prikazani jer ne odgovaraju stvarnom ponašanju sustava.

**Zahtjev bez zasebnog aktera:** F-RL-3 (kontrola pristupa po ulozi) ne čini zaseban obrazac uporabe, nego vrijedi za sve obrasce prijavljenih korisnika. Ponašanje je opisano u alternativnim tokovima UC-01 i UC-02, a provodi se na poslužitelju (NF-04).

## 3.2 Specifikacije obrazaca uporabe

**Cilj:** Za svaki obrazac uporabe iz dijagrama objasniti cilj aktera, uobičajenu interakciju s aplikacijom i važne alternative. Jednostavne obrasce uporabe opišite kratko; proširite one kod kojih alternative, vanjske ovisnosti ili posljedice zahtijevaju dodatno objašnjenje.

**Za svaki obrazac uporabe koristite jednu okomitu tablicu.** Navedite samo onoliko pojedinosti koliko interakcija zahtijeva; neprimjenjivu alternativu izostavite umjesto da je popunjavate samo radi forme.

U obrascima koji spajaju više srodnih ciljeva glavni tok podijeljen je u oznake A, B, C…, a oznaka alternativnog toka (npr. A3a) pokazuje u kojem dijelu i koraku nastaje.

### 3.2.1 Pristup i javni pregled

### UC-01: Registracija i prijava korisnika

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Neprijavljeni posjetitelj; sekundarni akter: Google OAuth |
| **Povezani zahtjevi** | F-RL-1 (uz F-RL-3 u alternativnim tokovima) |
| **Preduvjeti** | Korisnik nije prijavljen i ima Google račun. Za prijavu račun mora postojati u sustavu; administratorski računi unaprijed su definirani i ne stvaraju se registracijom. |
| **Glavni uspješni tok** | **A) Registracija**<br>1. Posjetitelj odabire registraciju i željenu ulogu (umjetnik ili organizator).<br>2. Aplikacija ga preusmjerava na Google radi autorizacije.<br>3. Posjetitelj potvrđuje svoj Google račun.<br>4. Aplikacija prikazuje obrazac za osnovne podatke: umjetnik unosi ime, jedno ili više područja djelovanja iz popisa aktivnih područja i, neobavezno, poveznice na vlastite stranice; organizator unosi ime, prezime i naziv organizacije.<br>5. Posjetitelj šalje obrazac; aplikacija provjerava podatke, stvara račun i prijavljuje korisnika na Dashboard odabrane uloge.<br>**B) Prijava**<br>1. Korisnik odabire ulogu i „Prijava putem Googlea”; aplikacija ga preusmjerava na Google.<br>2. Korisnik potvrđuje svoj Google račun.<br>3. Aplikacija provjerava da račun postoji u odabranoj ulozi i da nije blokiran, uspostavlja sesiju i preusmjerava korisnika na Dashboard njegove uloge. |
| **Alternativni tokovi / Iznimke** | **A3a — Odbijena autorizacija na Googleu:** Račun se ne stvara, aplikacija prikazuje poruku o grešci i vraća posjetitelja na početnu stranicu.<br>**A4a — Google račun već ima odabranu ulogu:** Aplikacija objašnjava da je registracija u toj ulozi već obavljena i nudi prijavu (tok B). Isti Google račun može se registrirati i u drugoj ulozi, pa korisnik može biti i umjetnik i organizator.<br>**A5a — Nedostaju obavezni podaci ili su neispravni:** Aplikacija uz polje objašnjava problem (npr. nije odabrano nijedno područje djelovanja) i ne stvara račun; posjetitelj ispravlja podatke i ponavlja korak 5.<br>**B0a — Pristup Dashboardu bez prijave (F-RL-3):** Neprijavljeni posjetitelj koji otvori stranicu Dashboarda preusmjerava se na prijavu u sustav.<br>**B2a — Odbijena autorizacija na Googleu:** Prijava ne uspijeva, aplikacija prikazuje poruku o grešci i korisnik ostaje neprijavljen.<br>**B3a — Google račun nije registriran:** Aplikacija preusmjerava korisnika na registraciju (tok A).<br>**B3b — Račun je blokiran:** Aplikacija odbija prijavu i prikazuje odgovarajuću poruku.<br>**B3c — Dashboard druge uloge (F-RL-3):** Prijavljeni korisnik koji pokuša otvoriti Dashboard druge uloge dobiva poruku o zabranjenom pristupu (403). |
| **Posljedice (ishod)** | Nakon registracije stvoren je račun u odabranoj ulozi, a korisnik je prijavljen; nakon prijave uspostavljena je sesija i korisnik ima pristup samo Dashboardu svoje uloge (NF-04). Sustav ne pohranjuje lozinke (NF-05). |

### UC-02: Odjava korisnika

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (Umjetnik, Organizator, Administrator); sekundarni akter: Vremenski okidač |
| **Povezani zahtjevi** | F-RL-2 (uz F-RL-3 u alternativnim tokovima) |
| **Preduvjeti** | Korisnik je prijavljen. |
| **Glavni uspješni tok** | 1. Korisnik klikne „Odjava”.<br>2. Aplikacija poništava sesiju i preusmjerava korisnika na početnu stranicu. |
| **Alternativni tokovi / Iznimke** | **1a — Istek sesije:** Vremenski okidač poništava sesiju po isteku njezina trajanja (određenog postavkama sustava, UC-12); pri sljedećoj radnji korisnik se preusmjerava na prijavu (UC-01) uz poruku da je sesija istekla. Aktivnost korisnika produljuje sesiju.<br>**2a — Povratak nakon odjave (F-RL-3):** Korisnik pokuša gumbom „Natrag” otvoriti Dashboard; aplikacija odbija pristup i preusmjerava ga na prijavu (UC-01). |
| **Posljedice (ishod)** | Sesija je poništena i stranice Dashboarda više nisu dostupne bez nove prijave. |

### UC-03: Pregled javnog sadržaja

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Neprijavljeni posjetitelj ili Prijavljeni korisnik |
| **Povezani zahtjevi** | F-NU-1, F-NU-2, F-NU-3 |
| **Preduvjeti** | Nema. |
| **Glavni uspješni tok** | 1. Korisnik otvara javni pregled djela i umjetnika; aplikacija prikazuje javna djela, odnosno umjetnike.<br>2. Korisnik pretražuje djela po nazivu ili umjetnike po imenu i području umjetnosti te otvara djelo ili javni profil umjetnika (biografija, javna djela, sudjelovanja).<br>3. Korisnik otvara pregled prilika; aplikacija prikazuje aktivne prilike.<br>4. Korisnik pretražuje prilike i filtrira ih po području, lokaciji, roku i statusu te otvara priliku (podaci, rok, datum događanja).<br>5. Korisnik odabire prikaz završenih prilika; aplikacija ih prikazuje odvojeno od aktivnih, a na stranici završene prilike i popis pobjednika. |
| **Alternativni tokovi / Iznimke** | **2a, 4a — Nema rezultata:** Aplikacija prikazuje poruku da ništa nije pronađeno.<br>**2b — Djelo nije javno:** Privatno djelo ne prikazuje se ni u pregledu, ni u pretrazi, ni preko izravne poveznice (NF-03).<br>**4b — Prijava neprijavljenog posjetitelja:** Neprijavljeni posjetitelj se ne može prijaviti na priliku; pokušaj prijave preusmjerava ga na prijavu korisnika (UC-01). |
| **Posljedice (ishod)** | Nema promjene podataka. Prilike u pripremi nisu vidljive. |

### 3.2.2 Profil i obavijesti

### UC-04: Upravljanje profilom i pregled obavijesti

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Umjetnik ili Organizator |
| **Povezani zahtjevi** | F-UP-1, F-OS-1, F-OB-1, F-OB-2 |
| **Preduvjeti** | Korisnik je prijavljen. |
| **Glavni uspješni tok** | **A) Uređivanje profila**<br>1. Korisnik otvara postavke profila; aplikacija prikazuje trenutne podatke. Umjetnik vidi ime, područja djelovanja, poveznice, biografiju i opis rada, a organizator ime, prezime i naziv organizacije. Oboje vide i postavke obavijesti.<br>2. Korisnik mijenja podatke i, po želji, uključuje ili isključuje pojedine vrste obavijesti.<br>3. Korisnik sprema izmjene; aplikacija provjerava podatke, sprema ih i prikazuje potvrdu.<br>**B) Pregled obavijesti**<br>1. Korisnik otvara Inbox; aplikacija prikazuje broj nepročitanih obavijesti i popis obavijesti od najnovije (npr. prijave, dopune, pozivi).<br>2. Korisnik klikom otvara obavijest, a aplikacija je označava pročitanom i ažurira broj nepročitanih. |
| **Alternativni tokovi / Iznimke** | **A3a — Neispravni podaci:** Podatak nije valjan (npr. prazno ime, nijedno područje djelovanja, neispravna poveznica, prazan naziv organizacije); aplikacija uz polje objašnjava problem i ništa ne sprema, a korisnik ispravlja podatke i ponavlja korak 3.<br>**A3b — Odustajanje:** Korisnik napušta uređivanje i profil ostaje nepromijenjen.<br>**B1a — Nema obavijesti:** Aplikacija prikazuje prazan Inbox s odgovarajućom porukom. |
| **Posljedice (ishod)** | Izmjene profila vidljive su na javnom profilu. Korisnik više ne prima vrste obavijesti koje je isključio, a otvorene obavijesti označene su pročitanima. Obavijesti se šalju samo unutar aplikacije. |

### 3.2.3 Umjetnik: portfolio i prijave

### UC-05: Upravljanje portfolijem

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Umjetnik |
| **Povezani zahtjevi** | F-UP-2, F-UP-3 |
| **Preduvjeti** | Umjetnik je prijavljen. |
| **Glavni uspješni tok** | 1. Umjetnik otvara svoj portfolio; aplikacija prikazuje sva njegova djela, javna i privatna, s oznakom vidljivosti.<br>2. Umjetnik dodaje novo djelo: unosi osnovne podatke (naziv, godinu nastanka, tehniku, dimenzije, opis) i prilaže datoteke.<br>3. Aplikacija provjerava obavezna polja te format i veličinu datoteka i sprema djelo kao privatno.<br>4. Umjetnik po želji uređuje djelo, mijenja njegovu vidljivost (javno ili privatno) i pregledava ga kao javni korisnik.<br>5. Umjetnik po želji briše djelo uz potvrdu; aplikacija ga uklanja iz portfolija i s javnog profila. |
| **Alternativni tokovi / Iznimke** | **3a — Nevaljana datoteka:** Format nije JPG, PNG ili PDF ili datoteka prelazi 10 MB (NF-02); aplikacija je odbija uz razumljivu poruku i djelo se ne sprema dok se datoteka ne ispravi ili ukloni.<br>**3b — Nedostaju obavezni podaci:** Nedostaju naziv ili barem jedna datoteka ili je godina nastanka u budućnosti; aplikacija objašnjava problem i ne sprema djelo.<br>**5a — Djelo je dio aktivne prijave:** Djelo koje je priloženo prijavi u statusu „Predana”, „U pregledu” ili „Potrebna dopuna” ne može se obrisati; aplikacija prikazuje poruku s nazivom prilike.<br>**5b — Brisanje nije potvrđeno:** Djelo ostaje nepromijenjeno. |
| **Posljedice (ishod)** | Portfolio odražava dodane, izmijenjene ili obrisane radove. Privatno djelo nije javno vidljivo, uključujući izravne poveznice na datoteke (NF-03). |

### UC-06: Prijava na priliku

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Umjetnik |
| **Povezani zahtjevi** | F-PP-1, F-UW-1 |
| **Preduvjeti** | Umjetnik je prijavljen i ima barem jedno djelo u portfoliju. Prilika je u statusu „Otvoreno za prijave”, rok nije istekao, organizator nije blokirao umjetnika i umjetnik se još nije prijavio na tu priliku. |
| **Glavni uspješni tok** | 1. Po želji umjetnik priliku dok priprema dokumentaciju sprema na listu želja (odabirom „Dodaj na listu želja”), a kasnije je s liste otvara.<br>2. Umjetnik na stranici prilike, njezinoj kartici ili listi želja odabire „Prijavi se”.<br>3. Aplikacija prikazuje obrazac prijave s djelima iz umjetnikova portfolija (javnim i privatnim).<br>4. Umjetnik odabire djela te, po želji, upisuje poruku organizatoru i prilaže privitke.<br>5. Umjetnik šalje prijavu.<br>6. Poslužitelj provjerava rok, status prilike, blokadu, postojeću prijavu i privitke te sprema prijavu sa statusom „Predana”.<br>7. Aplikacija prikazuje potvrdu, gumb prelazi u „Prijavljeno”, prilika se uklanja s liste želja, a organizator prima obavijest. |
| **Alternativni tokovi / Iznimke** | **1a — Ponovni odabir:** Ako je prilika već na listi želja, ponovni odabir uklanja je s liste.<br>**1b — Prijave su zatvorene:** Prilika na listi želja ostaje s oznakom da su prijave zatvorene, bez mogućnosti prijave.<br>**2a — Umjetnik je blokiran:** Umjesto gumba „Prijavi se” aplikacija prikazuje poruku da prijava na ovu priliku nije moguća.<br>**2b — Već prijavljen:** Gumb „Prijavljeno” je onemogućen; izravan pokušaj ponovne prijave poslužitelj odbija.<br>**5a — Nije odabrano nijedno djelo:** Aplikacija objašnjava da je potrebno barem jedno djelo i ne sprema prijavu.<br>**5b — Nevaljan privitak:** Format ili veličina ne zadovoljavaju NF-02; privitak se odbija uz poruku, a prijava se ne šalje dok se ne ispravi.<br>**6a — Rok je istekao ili prilika nije otvorena:** Poslužitelj odbija prijavu, uključujući izravan API poziv (NF-01); baza ostaje nepromijenjena, a umjetnik dobiva poruku.<br>**6b — Spremanje nije uspjelo:** Aplikacija prijavljuje grešku i ne prikazuje lažnu potvrdu. |
| **Posljedice (ishod)** | Pohranjena je prijava sa statusom „Predana”. Organizator je obaviješten, a prilika se uklanja s umjetnikove liste želja. |

### UC-07: Praćenje i dopuna prijava

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Umjetnik |
| **Povezani zahtjevi** | F-PP-2, F-PP-3, F-PP-5, F-ON-4 |
| **Preduvjeti** | Umjetnik je prijavljen i ima barem jednu prijavu. |
| **Glavni uspješni tok** | 1. Umjetnik otvara „Moje prijave”; aplikacija prikazuje njegove prijave sa statusom (predana, u pregledu, potrebna dopuna, prihvaćena, odbijena), a prijave na završene prilike u povijesti.<br>2. Umjetnik otvara prijavu; ako je odbijena, aplikacija prikazuje razlog koji je unio organizator.<br>3. Ovisno o statusu umjetnik obavlja jednu od radnji nad prijavom:<br>&nbsp;&nbsp;**a) Povlačenje** (dok su prijave otvorene): odabire „Povuci prijavu” i potvrđuje; aplikacija trajno briše prijavu s privicima.<br>&nbsp;&nbsp;**b) Dopuna** (status „Potrebna dopuna”, nakon što je organizator zatražio dopunu u UC-10): čita poruku organizatora, odabire „Dopuni prijavu”, dodaje tražene materijale i šalje dopunu; aplikacija vraća prijavu u „U pregledu” i obavještava organizatora.<br>&nbsp;&nbsp;**c) Sudjelovanja** (prilika završena): na svom profilu pregledava sudjelovanja koja je aplikacija automatski dodala pobjedniku te ih sakriva ili ističe na vrhu profila.<br>4. Uz prihvaćenu prijavu aplikacija nudi dodavanje događanja u kalendar (proširenje UC-08). |
| **Alternativni tokovi / Iznimke** | **3a — Prijave su zatvorene:** Povlačenje nije dostupno, a izravan API zahtjev poslužitelj odbija.<br>**3a2 — Povlačenje nije potvrđeno:** Prijava ostaje nepromijenjena.<br>**3b — Prilika je u međuvremenu završena:** Aplikacija odbija dopunu uz objašnjenje i prijava ostaje nepromijenjena. Dopuna je moguća i nakon isteka roka za prijavu, dok prilika nije završena.<br>**3b2 — Nevaljan privitak:** Format ili veličina ne zadovoljavaju NF-02; aplikacija odbija privitak uz poruku i dopuna se ne šalje.<br>**3c — Poništavanje:** Ponovni odabir isticanja uklanja isticanje, a sakriveno sudjelovanje umjetnik može ponovno prikazati. |
| **Posljedice (ishod)** | Povučena prijava više nije vidljiva organizatoru i ne ulazi u statistike ni izvještaje, a umjetnik se na priliku može ponovno prijaviti dok su prijave otvorene. Dopunjena prijava ima status „U pregledu”. Javni profil prikazuje sudjelovanja prema umjetnikovu odabiru. Dok odabir traje, umjetnik ne vidi je li njegova prijava označena. |

### UC-08: Dodavanje događanja u kalendar

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Umjetnik; sekundarni akter: Google Calendar |
| **Povezani zahtjevi** | F-PP-4 |
| **Preduvjeti** | Umjetnik je prijavljen, a njegova prijava ima status „Prihvaćena”. Obrazac proširuje UC-07 (`<<extend>>`): nudi se iz popisa prijava samo uz prihvaćenu prijavu. |
| **Glavni uspješni tok** | 1. Umjetnik uz prihvaćenu prijavu odabire „Dodaj u kalendar”.<br>2. Aplikacija traži od umjetnika autorizaciju pristupa njegovom Google kalendaru.<br>3. Umjetnik odobrava pristup.<br>4. Google Calendar stvara događaj s nazivom prilike, datumom i vremenom događanja te adresom, ako je unesena. Ako završetak nije unesen, događaj traje jedan sat.<br>5. Aplikacija prikazuje potvrdu. |
| **Alternativni tokovi / Iznimke** | **3a — Odbijena autorizacija:** Aplikacija prikazuje poruku o grešci, događaj se ne stvara, a prijava ostaje nepromijenjena.<br>**4a — Google Calendar ne odgovara:** Ako API ne odgovori unutar 5 sekundi, aplikacija umjesto upisa nudi preuzimanje događaja kao `.ics` datoteke (NF-07). |
| **Posljedice (ishod)** | Događaj je upisan u umjetnikov kalendar (ili preuzet kao `.ics`). Podaci prijave ne mijenjaju se. |

### 3.2.4 Organizator: prilike i odabir

### UC-09: Upravljanje prilikama

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Organizator; sekundarni akteri: Google Maps API, Vremenski okidač |
| **Povezani zahtjevi** | F-ON-1, F-ON-2, F-ON-3 |
| **Preduvjeti** | Organizator je prijavljen. Za uređivanje, brisanje i promjenu statusa: prilika pripada tom organizatoru. |
| **Glavni uspješni tok** | **A) Stvaranje i uređivanje**<br>1. Organizator odabire „Nova prilika” (ili „Uredi” na vlastitoj prilici).<br>2. Organizator unosi obavezne podatke (naslov, vrstu prilike, područje umjetnosti, rok za prijavu, početak događanja te opis), a po želji kraj događanja, adresu i privitke, i sprema priliku.<br>3. Aplikacija provjerava obavezna polja i datume, a Google Maps API provjerava adresu.<br>4. Aplikacija sprema priliku; nova prilika dobiva status „Priprema”. Opis se prikazuje oblikovano, a ugrađeni HTML i skripte se ne izvršavaju. Ako je unesena adresa, lokacija se prikazuje na karti.<br>**B) Životni ciklus**<br>1. Organizator u statusu „Priprema” odabire „Objavi priliku” i potvrđuje; aplikacija provjerava da je rok u budućnosti i mijenja status u „Otvoreno za prijave”, a prilika postaje javno vidljiva i umjetnici se mogu prijaviti.<br>2. Po potrebi organizator prije roka odabire „Zatvori priliku” (status „Prijave zatvorene”) ili je ponovno otvara odabirom „Otvori priliku”, ako rok nije istekao.<br>3. Kada su prijave prikupljene, organizator odabire „Započni odabir” i potvrđuje; status prelazi u „U procesu odabira”, a odabir pobjednika nastavlja se u UC-10. |
| **Alternativni tokovi / Iznimke** | **A2a — Skraćivanje roka:** Nakon objave rok se može samo produžiti; skraćivanje aplikacija odbija.<br>**A2b — Brisanje prilike:** Organizator briše vlastitu priliku uz potvrdu; ako prilika ima prijave, brisanje je onemogućeno uz objašnjenje. Tuđu priliku organizator ne može vidjeti, urediti ni obrisati (NF-04).<br>**A3a — Nedostaju obavezna polja ili su datumi neispravni:** Rok je u prošlosti, početak događanja je prije roka ili kraj prije početka; aplikacija objašnjava problem i ne sprema priliku.<br>**A3b — Adresa nije prepoznata:** Aplikacija prikazuje poruku i ne sprema priliku dok se adresa ne ispravi ili ukloni.<br>**A3c — Nevaljan privitak:** Format ili veličina ne zadovoljavaju NF-02; privitak se odbija uz poruku.<br>**A4a — Karta nedostupna:** Ako Google Maps API ne odgovori unutar 5 sekundi, lokacija se prikazuje kao tekstualna adresa, a ostale radnje nastavljaju raditi (NF-07).<br>**B1a — Rok je istekao:** Objava se odbija uz poruku da treba pomaknuti rok.<br>**B2a — Istek roka:** Vremenski okidač po isteku roka automatski mijenja status iz „Otvoreno za prijave” u „Prijave zatvorene”.<br>**B2b — Ponovno otvaranje nakon isteka roka:** Nije moguće dok organizator ne produlji rok (tok A).<br>**B2c — Nedopuštena promjena statusa:** Vraćanje u „Priprema” te ponovno otvaranje nakon pokretanja odabira nisu moguća; aplikacija ih odbija.<br>**B3a — Radnja nije potvrđena:** Status prilike ostaje nepromijenjen. |
| **Posljedice (ishod)** | Prilika je spremljena (ili izmijenjena, odnosno obrisana) i nalazi se u odgovarajućem statusu. Nova prilika nije javno vidljiva dok je u pripremi. Dok su prijave zatvorene, umjetnici se ne mogu ni prijaviti ni povući prijavu, a poslužitelj prihvaća prijave samo za prilike u statusu „Otvoreno za prijave” (NF-01). |

### UC-10: Pregled prijava i odabir pobjednika

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Organizator |
| **Povezani zahtjevi** | F-ON-4, F-ON-5, F-ON-6 |
| **Preduvjeti** | Organizator je prijavljen i prilika je njegova. Za odabir pobjednika prilika je u statusu „U procesu odabira” (UC-09). |
| **Glavni uspješni tok** | **A) Pregled prijava**<br>1. Organizator otvara svoju priliku; aplikacija prikazuje popis prijava (ime umjetnika, datum predaje, status) i ukupan broj prijava.<br>2. Organizator otvara prijavu; aplikacija prikazuje odabrana djela, poruku i privitke, a status „Predana” pri prvom otvaranju prelazi u „U pregledu”.<br>3. Po potrebi organizator odabire „Zatraži dopunu” i upisuje obaveznu poruku; aplikacija mijenja status prijave u „Potrebna dopuna” i obavještava umjetnika (dopuna se nastavlja u UC-07).<br>4. Organizator po želji pregledava osnovne statistike svojih prilika: broj prijava po području i prilici te broj pobjednika.<br>**B) Odabir pobjednika**<br>1. Organizator označava pobjednike, a za sve ostale prijave upisuje razlog odbijanja.<br>2. Organizator odabire „Završi odabir”; aplikacija prikazuje potvrdu s brojem pobjednika i brojem odbijenih prijava.<br>3. Organizator potvrđuje; aplikacija označene prijave postavlja u „Prihvaćena”, ostale u „Odbijena” s upisanim razlogom i prilike u „Završeno”.<br>4. Aplikacija objavljuje rezultate, dodaje sudjelovanja na profile pobjednika i obavještava sve prijavljene umjetnike. |
| **Alternativni tokovi / Iznimke** | **A1a — Nema prijava:** Aplikacija prikazuje odgovarajuću poruku.<br>**A3a — Poruka nije upisana:** Aplikacija ne šalje zahtjev za dopunom dok se poruka ne upiše.<br>**A3b — Prilika je u odabiru ili završena:** Zahtjev za dopunom nije dostupan.<br>**B1a — Označavanje je privremeno:** Organizator može mijenjati oznake proizvoljno često; umjetnici ih ne vide, a statusi prijava se ne mijenjaju do završetka odabira.<br>**B2a — Neoznačena prijava bez razloga:** Završetak odabira je onemogućen uz prikaz broja prijava bez razloga odbijanja.<br>**B2b — Nijedna prijava nije označena:** Aplikacija upozorava da prilika neće imati pobjednika; organizator potvrđuje ili odustaje.<br>**B3a — Završetak nije potvrđen:** Statusi prijava i prilike ostaju nepromijenjeni. |
| **Posljedice (ishod)** | Statusi pregledanih prijava su ažurirani, a umjetnik je obaviješten o zahtjevu za dopunom. Povučene prijave ne prikazuju se i ne broje, a statistike sadrže samo zbirne vrijednosti, bez osobnih podataka umjetnika (NF-06). Nakon završetka odabira prilika je „Završeno”, statusi prijava su konačni i više se ne mogu mijenjati, rezultati su javno objavljeni, a sudjelovanja pobjednika dodana su na njihove profile (UC-07). |

### UC-11: Pozivanje i blokiranje umjetnika

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Organizator |
| **Povezani zahtjevi** | F-OU-1 |
| **Preduvjeti** | Organizator je prijavljen i gleda javni profil umjetnika. |
| **Glavni uspješni tok** | 1. Organizator na profilu umjetnika odabire „Pozovi”.<br>2. Aplikacija nudi organizatorove prilike otvorene za prijave.<br>3. Organizator odabire priliku.<br>4. Aplikacija šalje umjetniku obavijest s poveznicom na priliku.<br>5. Po potrebi organizator odabire „Blokiraj” i potvrđuje; blokirani umjetnik više se ne može prijaviti na prilike tog organizatora. Organizator ga kasnije može odblokirati. |
| **Alternativni tokovi / Iznimke** | **2a — Nema otvorenih prilika:** Aplikacija objašnjava da nema prilike na koju bi se umjetnik mogao pozvati.<br>**3a — Poziv nije moguć:** Umjetnik je već pozvan na tu priliku, već se prijavio ili je blokiran; aplikacija objašnjava razlog i ne šalje poziv.<br>**5a — Blokiranje nije potvrđeno:** Stanje ostaje nepromijenjeno. |
| **Posljedice (ishod)** | Pozvani umjetnik ima obavijest o pozivu. Blokirani umjetnik umjesto gumba „Prijavi se” vidi poruku da prijava nije moguća, dok već predane prijave ostaju nepromijenjene. |

### 3.2.5 Administracija platforme

### UC-12: Upravljanje platformom

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Administrator |
| **Povezani zahtjevi** | F-AD-1, F-AD-2 |
| **Preduvjeti** | Administrator je prijavljen. Sadržaj je objavljen bez prethodnog odobravanja pa se uklanja naknadno. |
| **Glavni uspješni tok** | **A) Šifrarnici**<br>1. Administrator otvara popis područja umjetnosti ili vrsta prilika te dodaje novi zapis, preimenuje postojeći ili ga deaktivira.<br>2. Aplikacija provjerava podatke, sprema promjenu i prikazuje ažurirani popis.<br>**B) Postavke sustava**<br>1. Administrator otvara osnovne postavke (npr. ograničenja datoteka i trajanje sesije po ulozi), mijenja vrijednosti i sprema ih.<br>2. Aplikacija provjerava vrijednosti i sprema ih.<br>**C) Korisnici**<br>1. Administrator otvara popis korisnika (uloga, datum registracije, status računa) i po potrebi ga pretražuje.<br>2. Administrator ovjerava organizatora ili poništava ovjeru, odnosno blokira korisnika ili briše njegov račun, i potvrđuje radnju.<br>**D) Moderacija sadržaja**<br>1. Za neprimjereno djelo ili priliku administrator odabire uklanjanje, upisuje razlog i potvrđuje.<br>2. Aplikacija uklanja sadržaj iz javnog prikaza i pretrage te vlasniku prikazuje da je sadržaj uklonjen, uz razlog. |
| **Alternativni tokovi / Iznimke** | **A1a — Deaktivacija zapisa u uporabi:** Deaktivacija je dopuštena; zapis ostaje uz postojeće profile i prilike, ali se više ne nudi za nove unose. Brisanje zapisa nije moguće.<br>**A2a — Naziv je prazan ili već postoji:** Aplikacija objašnjava problem i ne sprema promjenu.<br>**B2a — Neispravna vrijednost postavke:** Npr. negativan broj ili nula; aplikacija je odbija uz poruku i zadržava prethodnu vrijednost.<br>**C2a — Vlastiti račun:** Administrator pokušava blokirati ili obrisati vlastiti račun; aplikacija to odbija.<br>**C2b, D1a — Radnja nije potvrđena:** Račun, odnosno sadržaj ostaje nepromijenjen.<br>**D1b — Razlog nije upisan:** Aplikacija ne uklanja sadržaj dok se razlog ne unese.<br>**D2a — Uklanjanje prilike s prijavama:** Brišu se i sve prijave na tu priliku, a prijavljeni umjetnici primaju obavijest s razlogom. |
| **Posljedice (ishod)** | Aktivna područja i vrste nude se pri registraciji, uređivanju profila, stvaranju prilike i u filtrima pretrage. Nove vrijednosti postavki primjenjuju se na sve nove unose i sesije bez ponovnog pokretanja sustava. Blokirani korisnik ne može se prijaviti (UC-01), a njegov javni sadržaj nije vidljiv. Oznaka ovjere prikazuje se, odnosno uklanja, na profilu i prilikama organizatora. Uklonjeni sadržaj više nije vidljiv javnosti ni u rezultatima pretrage. |

### UC-13: Pregled mjesečnih izvještaja

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Administrator |
| **Povezani zahtjevi** | F-AD-3 |
| **Preduvjeti** | Administrator je prijavljen. |
| **Glavni uspješni tok** | 1. Administrator odabire mjesec.<br>2. Aplikacija prikazuje broj registriranih umjetnika, objavljenih prilika i predanih prijava za taj mjesec.<br>3. Administrator preuzima izvještaj u CSV formatu. |
| **Alternativni tokovi / Iznimke** | **2a — Mjesec bez aktivnosti:** Aplikacija prikazuje nulte vrijednosti. |
| **Posljedice (ishod)** | Izvještaj sadrži samo zbirne vrijednosti, bez osobnih podataka pojedinih umjetnika (NF-06). Podaci se ne mijenjaju. |

---

## 3.3 Provjera dosljednosti obrazaca uporabe

**Cilj:** Provjeriti međusobnu usklađenost obrazaca uporabe, aktera, zahtjeva i ispitnih slučajeva. Cjelovito mapiranje održava se isključivo u **[matrici sljedivosti zahtjeva](2-Analiza%20zahtjeva.md#26-sljedivost-zahtjeva)**.

| Provjera | Pitanje za tim |
| --- | --- |
| Zahtjev | Je li svaki važan obrazac uporabe povezan s postojećim zahtjevom? |
| Akter | Odgovara li akter naveden ovdje prethodno utvrđenoj ulozi i dopuštenoj interakciji? |
| Aplikacija | Može li tim demonstrirati opisani glavni rezultat i važnu alternativu ili je opis jasno označen kao trenutačno oblikovanje? |

---

Povezivanje zahtjev → obrazac uporabe → ispitivanje održavajte **samo jednom, u [tablici sljedivosti zahtjeva](./2-Analiza%20zahtjeva.md#26-sljedivost-zahtjeva)**. Ovdje nemojte održavati drugu projektnu tablicu mapiranja ni stupac sa statusom implementacije. Ako važan zahtjev nema interakciju s ljudskim akterom, objasnite gdje se obrađuje umjesto izmišljanja aktera. U ovom dokumentu to vrijedi za F-RL-3 (kontrola pristupa, odjeljak 3.1) te za automatsko zatvaranje prijava i istek sesije, koje pokreće Vremenski okidač (UC-02 i UC-09).

**Završna provjera:** Dijagram, specifikacije obrazaca uporabe i matrica sljedivosti međusobno su usklađeni. Svaki važan obrazac uporabe povezan je s postojećim zahtjevom, akteri odgovaraju stvarnim ulogama u aplikaciji, a opisani glavni i alternativni tokovi odgovaraju ponašanju koje sustav stvarno podržava.