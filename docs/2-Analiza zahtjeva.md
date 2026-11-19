#  2.Analiza zahtjeva

Prioriteti zahtjeva su Visok, Srednji i Nizak. Izvor zahtjeva je ili projektni zadatak (ArtConnect.pdf) ili dogovor tima, a uz svaki funkcijski zahtjev naveden je opažljiv kriterij prihvaćanja.

MVP čine svi zahtjevi s prioritetom Visok: F-RL-1 do F-RL-3, F-NU-1, F-NU-2, F-UP-1 do F-UP-3, F-PP-1 do F-PP-3, F-PP-5, F-OS-1, F-ON-1 do F-ON-5, F-AD-1 i F-AD-2. MVP omogućuje osnovni tok aplikacije: korisnik se prijavljuje Google računom i vidi sadržaj svoje uloge, umjetnik uređuje profil i portfolio, organizator stvara i objavljuje prilike, umjetnik se prijavljuje na priliku svojim djelima, organizator pregledava prijave i bira pobjednike, a administrator održava šifrarnike i korisnike. Zahtjevi srednjeg prioriteta također su planirani, ali se implementiraju nakon MVP-a.

  
## 2.1 Funkcijski zahtjevi


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


## 2.3 Dionici i akteri


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

---

## 2.4 Ograničenja i pretpostavke


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


---

## 2.5 Značajne promjene zahtjeva

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| 1.11.2026. | F-RL-1 - F-AD-3 | Zahtjevi u odjeljku 2.1 sažeti su spajanjem srodnih zahtjeva (npr. registracija i prijava u F-RL-1), a kriteriji prihvaćanja skraćeni su na to što mora vrijediti. Opseg i funkcionalnosti se ne mijenjaju. Prethodna verzija sačuvana je u dokumentu "Stara analiza zahtjeva".| Uputa asistentice na laboratorijskoj vježbi  |


---

## 2.6 Sljedivost zahtjeva


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
| F-ON-4 | UC-10 Pregled prijava i odabir pobjednika; UC-07 Praćenje i dopuna prijave (dopuna) | Modul prijava; Modul obavijesti | ST-28 Pregled prijava; CT-24 Promjena statusa pri prvom otvaranju; ST-29 Zahtjev za dopunom i slanje dopune; CT-25 Dopuna u procesu odabira |
| F-ON-5 | UC-10 Pregled prijava i odabir pobjednika | Automat stanja prilike; Modul prijava; Modul obavijesti | ST-30 Označavanje pobjednika i razlog odbijanja; CT-26 Označavanje skriveno od umjetnika; ST-34 Završetak odabira i razlog odbijanja; CT-31 Završetak odabira bez razloga odbijanja |
| F-ON-6 | UC-10 Pregled prijava i odabir pobjednika | Modul izvještaja (statistike) | CT-27 Točnost statistika |
| F-OS-1 | UC-04 Upravljanje profilom i obavijstima | Web-klijent; Modul korisnika | ST-24 Uređivanje podataka organizatora |
| F-OU-1 | UC-11 Pozivanje i blokiranje umjetnika | Modul korisnika; Modul obavijesti; Modul prijava | ST-22 Poziv umjetnika; CT-18 Ponovni poziv i poziv blokiranog umjetnika; ST-23 Prijava blokiranog umjetnika; ST-25 Odblokiranje umjetnika |
| F-AD-1 | UC-12 Upravljanje platformom | Modul administracije; Modul postavki sustava | CT-35 Upravljanje područjima i vrstama; CT-37 Promjena postavki sustava |
| F-AD-2 | UC-12 Upravljanje platformom | Modul administracije; Modul autentifikacije; Modul obavijesti | ST-41 Ovjera organizatora; ST-42 Blokiranje i brisanje korisnika; CT-36 Blokiranje i brisanje vlastitog računa; ST-43 Uklanjanje djela i prilike |
| F-AD-3 | UC-13 Pregled mjesečnih izvještaja | Modul izvještaja | CT-38 Točnost izvještaja; ST-44 Preuzimanje izvještaja |

---

## 2.7 Pregled zahtjeva


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
---


