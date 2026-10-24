# 2. Analiza zahtjeva

**Cilj:** Iz odobrenog opsega projekta izvesti prepoznatljive, prioritetizirane i provjerljive zahtjeve. Zahtjevi se mogu mijenjati; pri završnoj predaji moraju odražavati dogovorenu aplikaciju. Izvori, odluke i poveznice u primjerima kolegija nastavni su scenariji, a ne projektni zapisi.

<details>
<summary><strong>Održavanje zahtjeva ažurnima</strong></summary>

Primjeri koriste temu projekta CrisisMap. Neki namjerno sadrže korisne nedostatke za raspravu. Izvori, odluke i poveznice na provjere u tim primjerima **nastavni su scenariji**, a ne zapisi rada stvarnog studentskog tima. Zamijenite ih zahtjevima i dokazima svojeg odobrenog projekta. Značajne promjene zabilježite u odjeljku 2.5.

</details>

## 2.1 Funkcijski zahtjevi

**Cilj:** Navesti što aplikacija mora omogućiti korisnicima, odakle pojedina mogućnost proizlazi i koji se opažljivi rezultat smatra prihvaćanjem.

## 2.1 Funkcijski zahtjevi

**Cilj:** Navesti što aplikacija mora omogućiti korisnicima, odakle pojedina mogućnost proizlazi i koji se opažljivi rezultat smatra prihvaćanjem.

#### F1 - F5: Pristup usluzi
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-001 | Registracija umjetnika i organizatora (nadalje: korisnika) putem vanjskog servisa OAuth 2.0 (Google) | Visok | ArtConnect.pdf | Korisnik se registrira odabirom uloge (umjetnik ili organizator) i potvrdom Google računa. Umjetnik pri registraciji unosi osnovne podatke, područje umjetničkog djelovanja (iz popisa aktivnih područja) i opcionalno poveznicu na web-stranicu ili društvene mreže. Organizator unosi ime, prezime i naziv organizacije. Isti Google račun može se registrirati jednom po ulozi, odnosno jedan korisnik može imati i ulogu umjetnika i ulogu organizatora. Ponovna registracija u ulozi koju taj Google račun već ima nije moguća. Ako korisnik odbije autorizaciju na Googleu, račun se ne stvara i prikazuje se poruka o grešci. |
| F-002 | Prijava korisnika & administratora putem vanjskog servisa OAuth 2.0 (Google) | Visok | ArtConnect.pdf | Prijava se obavlja odabirom uloge, klikom na "Prijava putem Googlea" i potvrdom Google računa. Nakon uspješne prijave korisnik se preusmjerava na Dashboard koji odgovara njegovoj ulozi. Pokušaj prijave Google računom koji nije registriran preusmjerava na registraciju. Blokirani korisnik se ne može prijaviti i prikazuje mu se odgovarajuća poruka. |
| F-003 | Odjava korisnika iz sesije klikom na gumb | Visok | Dogovor tima | Gumb "Odjava" dostupan je na svim stranicama za prijavljene korisnike. Klikom na gumb sesija se poništava i korisnik se preusmjerava na početnu stranicu. Nakon odjave stranice Dashboarda nisu dostupne, ni putem gumba "Natrag" u pregledniku. |
| F-004 | Automatska odjava korisnika iz sesije po isteku vremena | Srednji | Dogovor tima | Sesija umjetnika i organizatora istječe nakon 60 minuta neaktivnosti, a administratorska sesija nakon 30 minuta neaktivnosti. Svaka aktivnost korisnika produljuje sesiju. Nakon isteka sesije korisnik se pri sljedećoj radnji preusmjerava na prijavu, uz poruku da je sesija istekla. Trajanje sesije administrator može promijeniti u postavkama sustava. |
| F-005 | Prijavljeni korisnici s ovjerenom sesijom imaju pristup Dashboardu | Visok | Dogovor tima | Svaka uloga ima pristup samo svom Dashboardu (umjetnik, organizator, administrator). Neprijavljeni korisnik koji pokuša otvoriti stranicu Dashboarda preusmjerava se na prijavu. Prijavljeni korisnik koji pokuša otvoriti Dashboard druge uloge dobiva poruku o zabranjenom pristupu (HTTP 403). Provjera ovlasti obavlja se i na poslužitelju, ne samo u sučelju. |

#### F... - F...: Dashboard prijavljenog umjetnika
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Umjetnici mogu urediti svoj profil koji su kreirali prilikom registracije klikom na "Postavke" | Visok | ArtConnect.pdf | Klikom na "Postavke" otvara se stranica s trenutnim podacima profila u obliku za uređivanje. Detalji su opisani u sekciji "Postavke". |
| F-XXX | Umjetnici mogu vidjeti svoj portfolio klikom na "Moj portfolio" gdje su sva djela prikazana kao kartice | Visok | ArtConnect.pdf | Prikazuju se sva djela umjetnika, javna i privatna, sortirana od najnovijeg. Svaka kartica prikazuje prvu sliku djela (ili placeholder ako slika nema), naziv, godinu nastanka i oznaku "Javno" ili "Privatno". Ako portfolio nema djela, prikazuje se poruka s pozivom na dodavanje prvog djela. |
| F-XXX | Umjetnici mogu vidjeti svoje prijave klikom na "Moje prijave" gdje su sve prijave prikazane kao kartice | Visok | ArtConnect.pdf | Svaka kartica prikazuje naziv prilike, datum predaje, rok i status prijave. Detalji su opisani u sekciji "Prijave na prilike". |
| F-XXX | Umjetnik može pregledati obavijesti u "Inbox" | Srednji | Dogovor tima | Klikom na Inbox otvara se popis obavijesti sortiran od najnovije (npr. promjena statusa prijave, zahtjev za dopunom, poziv organizatora, rok prilike s liste želja uskoro ističe). Uz Inbox se prikazuje broj nepročitanih obavijesti. Klikom na obavijest obavijest se označava pročitanom. |

#### F... - F...: Dashboard prijavljenog umjetnika - Postavke
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Umjetnik može urediti ime i prezime profila | Visok | ArtConnect.pdf | Promjene se spremaju klikom na "Spremi" i odmah su vidljive na javnom profilu. Ime i prezime su obavezni. E-adresa se preuzima iz Google računa i ne može se mijenjati. |
| F-XXX | Umjetnik može promijeniti područja umjetničkog djelovanja | Visok | ArtConnect.pdf | Umjetnik odabire jedno ili više područja iz popisa aktivnih područja koja definira administrator. Mora biti odabrano barem jedno područje. Promjena se odražava u rezultatima tražilice umjetnika. |
| F-XXX | Umjetnik može dodati, urediti ili ukloniti poveznice na web-stranice i društvene mreže | Srednji | ArtConnect.pdf | Svaka poveznica unosi se u zasebno tekstualno polje. Novo prazno polje dodaje se klikom na gumb "+", a pojedino polje uklanja se klikom na gumb "X" pored njega. Moguće je dodati najviše 5 poveznica, nakon čega gumb "+" postaje onemogućen. Poveznice nisu obavezne, a prazna polja se pri spremanju zanemaruju. Sustav prihvaća samo ispravno oblikovane URL adrese, a za neispravne prikazuje poruku o grešci uz odgovarajuće polje. Poveznice se na javnom profilu otvaraju u novoj kartici preglednika. |

#### F... - F...: Dashboard prijavljenog umjetnika - Portfolio
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Umjetnik može urediti biografiju i opis umjetničkog rada koji se prikazuju na vrhu portfolija | Visok | ArtConnect.pdf | Biografija i opis rada su tekstualna polja do 2000 znakova. Promjene su nakon spremanja vidljive na javnom profilu. Prazna polja se na javnom profilu ne prikazuju. |
| F-XXX | Umjetnici mogu dodavati nova djela u svoj portfolio klikom na gumb "Dodaj" unutar "Moj portfolio" | Visok | ArtConnect.pdf | Formular sadrži polja naziv, godina nastanka, tehnika, dimenzije i opis te prijenos datoteka. Naziv i barem jedna datoteka su obavezni. Godina nastanka ne može biti u budućnosti. Novo djelo je po defaultu privatno. Nakon spremanja djelo se pojavljuje kao kartica u "Moj portfolio". |
| F-XXX | Umjetnici mogu uređivati djela unutar portfolija klikom na gumb "Uredi" na kartici djela | Visok | ArtConnect.pdf | Otvara se formular s trenutnim podacima djela. Mogu se mijenjati sva polja te dodavati i uklanjati datoteke, uz ista pravila kao kod dodavanja. Promjene se spremaju klikom na "Spremi", a klikom na "Odustani" djelo ostaje nepromijenjeno. |
| F-XXX | Umjetnici mogu brisati djela unutar portfolija klikom na gumb "Obriši" na kartici djela | Visok | Dogovor tima | Prije brisanja traži se potvrda. Obrisano djelo i njegove datoteke uklanjaju se iz portfolija i s javnog profila. Djelo koje je dio prijave u statusu "Predana", "U pregledu" ili "Potrebna dopuna" ne može se obrisati, a prikazuje se poruka s nazivom te prilike. |
| F-XXX | Svako djelo može sadržavati do 3 datoteke (.pdf, .jpg, .png, .gif) s ograničenjem od 5MB po datoteci | Visok | Dogovor tima | Sustav odbija datoteke drugih formata i datoteke veće od 5MB, uz poruku koja navodi razlog. Nakon tri dodane datoteke dodavanje nove nije moguće dok se neka ne ukloni. Provjera formata i veličine obavlja se i na poslužitelju. |
| F-XXX | Svako djelo može biti otvoreno za javnost ili skriveno privatno klikom na checkbox "Javno" unutar funkcionalnosti "Uredi" | Visok | ArtConnect.pdf | Javno djelo vidljivo je na javnom profilu umjetnika, na /art i u rezultatima tražilice. Privatno djelo vidi samo umjetnik, te organizator prilike na koju je djelo priloženo uz prijavu. Promjena vidljivosti primjenjuje se odmah nakon spremanja. |
| F-XXX | Klikom na gumb "Preview" na kartici prikazuje se djelo u cjelosti - iz perspektive javnog, neprijavljenog korisnika | Srednji | Dogovor tima | Prikaz je jednak javnoj stranici djela, bez gumba za uređivanje i brisanje. Za privatno djelo prikaz sadrži upozorenje "Ovo djelo trenutno nije javno vidljivo". |

#### F... - F...: Dashboard prijavljenog umjetnika - Lista želja
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Umjetnik može staviti priliku na "listu želja" prije nego što pripremi svu dokumentaciju potrebnu za prijavu, nakon čega prima obavijesti o roku prijave za tu priliku | Nizak | Dogovor tima | Gumb "Dodaj na listu želja" prikazuje se prijavljenom umjetniku na kartici i stranici prilike u statusu "Otvoreno za prijave". Ponovnim klikom prilika se uklanja s liste. Umjetnik prima obavijest 7 dana i 1 dan prije isteka roka. Nakon što se umjetnik prijavi na priliku, ona se automatski uklanja s liste želja i obavijesti o roku prestaju. |
| F-XXX | Umjetnik može pregledati sve prilike s liste želja klikom na "Lista želja" u desnom izborniku | Nizak | Dogovor tima | Prikazuju se sve prilike s liste želja kao kartice, sortirane po roku za prijavu od najbližeg. Svaka kartica prikazuje naziv, rok i datum događanja te gumb "Prijavi se". Prilike kojima su prijave zatvorene ostaju na listi s oznakom "Prijave zatvorene" i bez gumba "Prijavi se". Ako je lista prazna, prikazuje se odgovarajuća poruka. |

#### F... - F...: Dashboard prijavljenog organizatora
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Organizator može urediti svoj profil koji je kreirao prilikom registracije klikom na "Postavke" | Visok | Dogovor tima | Klikom na "Postavke" otvara se stranica s trenutnim podacima profila u obliku za uređivanje. Detalji su opisani u sekciji "Postavke". |
| F-XXX | Organizator može vidjeti svoje prilike klikom na "Moje prilike" gdje su sve prilike prikazane kao kartice | Visok | ArtConnect.pdf | Prikazuju se samo prilike koje je organizator sam kreirao. Svaka kartica prikazuje naziv, status, rok za prijavu i broj pristiglih prijava. Ako organizator nema prilika, prikazuje se poruka s pozivom na kreiranje prve prilike. |
| F-XXX | Organizator može pregledati obavijesti o svojim trenutno aktivnim prilikama klikom na "Inbox" | Srednji | Dogovor tima | Klikom na "Inbox" otvara se popis obavijesti sortiran od najnovije (npr. nova prijava, poslana dopuna, povučena prijava, rok ističe za 24 sata). Uz Inbox se prikazuje broj nepročitanih obavijesti. Klikom na obavijest ona se označava pročitanom. |

#### F... - F...: Dashboard prijavljenog organizatora - Postavke
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Organizator može promijeniti osnovne podatke o sebi (ime, prezime, naziv organizacije) | Visok | Dogovor tima | Promjene se spremaju klikom na "Spremi" i odmah su vidljive na javnom profilu organizatora. Ime, prezime i naziv organizacije su obavezni. |
| F-XXX | Organizator može uređivati koje obavijesti dobiva klikom na "Postavke obavijesti" unutar izbornika "Postavke" | Nizak | Dogovor tima | Za svaku vrstu obavijesti postoji zaseban prekidač za uključivanje i isključivanje. Sve vrste obavijesti su zadano uključene. Nakon spremanja organizator više ne prima obavijesti isključenih vrsta. |
| F-XXX | Organizator može uređivati blokirane umjetnike klikom na "Blokirani umjetnici" unutar izbornika "Postavke" | Nizak | Dogovor tima | Prikazuje se popis blokiranih umjetnika s imenom i datumom blokiranja. Klikom na "Odblokiraj" umjetnik se uklanja s popisa i ponovno se može prijavljivati na prilike tog organizatora. Ako nema blokiranih umjetnika, prikazuje se odgovarajuća poruka. |

#### F... - F...: Dashboard prijavljenog organizatora - Moje prilike
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Organizator može stvarati nove prilike klikom na gumb "Nova prilika" unutar "Moje prilike" | Visok | ArtConnect.pdf | Sadržaj prilike unosi se kao slobodni tekst u Markdown formatu: organizator u jedno tekstualno polje upisuje opis, kriterije za prijavu, informacije o nagradi i sve ostale detalje, uz pregled oblikovanog teksta prije spremanja. Dokumenti (npr. pravilnik, plakat) prilažu se putem upload dropzonea, povlačenjem datoteka ili klikom na nju; dozvoljeno je najviše 5 datoteka (.pdf, .jpg, .png, .gif) do 5MB po datoteci, a svaka dodana datoteka može se ukloniti klikom na "X". Uz slobodni tekst obavezna su samo strukturirana polja koja sustav koristi za pretraživanje, statuse i kalendar: naslov, vrsta prilike, područje umjetnosti, rok za prijavu i datum i vrijeme početka događanja. Datum i vrijeme završetka događanja i adresa nisu obavezni. Vrsta i područje biraju se iz popisa koje definira administrator, a rok mora biti u budućnosti. Početak događanja ne smije biti prije roka za prijavu, a završetak ne smije biti prije početka. Prilika se ne može spremiti s praznim tekstualnim poljem. Na stranici prilike prikazuju se rok za prijavu i datum događanja, Markdown se prikazuje oblikovan, a ugrađeni HTML i skripte se ne izvršavaju. Privici su dostupni za preuzimanje. Nova prilika dobiva status "Priprema". |
| F-XXX | Organizator može unijeti adresu prilike, a lokacija se prikazuje na karti putem Google Maps API-ja | Srednji | ArtConnect.pdf | Adresa nije obavezna. Nakon unosa ispravne adrese karta s oznakom lokacije prikazuje se na stranici prilike. Ako adresa nije unesena, karta se ne prikazuje. Za adresu koju servis ne prepozna prikazuje se poruka o grešci i prilika se ne može spremiti dok se adresa ne ispravi ili ukloni. |
| F-XXX | Organizator može uređivati priliku klikom na gumb "Uredi" na kartici prilike | Visok | Dogovor tima | Sva polja prilike je moguće urediti u svim statusima, uz ista pravila provjere kao kod stvaranja. Iznimka je rok za prijavu, koji se nakon objave prilike može samo produžiti. Promjene se spremaju klikom na "Spremi". |
| F-XXX | Organizator može brisati prilike klikom na gumb "Obriši" na kartici prilike | Visok | Dogovor tima | Prije brisanja traži se potvrda. Brisanje je moguće samo dok prilika nema nijednu prijavu; povučene prijave su obrisane i ne broje se. Za priliku s prijavama gumb "Obriši" je onemogućen uz objašnjenje. |

#### F... - F...: Dashboard prijavljenog organizatora - Prijave na prilike
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Organizator može pregledati priliku te umjetnike koji su trenutno prijavljeni na nju | Visok | ArtConnect.pdf | Stranica prilike prikazuje njezine podatke i popis prijavljenih umjetnika s imenom, datumom predaje i statusom prijave, uz ukupan broj prijava. Povučene prijave su obrisane pa se ne prikazuju ni ne broje. Klikom na prijavu otvaraju se detalji s odabranim djelima i priloženom dokumentacijom. Prvim otvaranjem status prijave automatski se mijenja iz "Predana" u "U pregledu". |
| F-XXX | Organizator prihvaća ili odbija prijavu, uz obavezno obrazloženje odbijanja | Visok | ArtConnect.pdf | Detalji prijave sadrže gumbe "Prihvati" i "Odbij". Odluka se može donijeti samo dok je prilika u statusu "U procesu odabira". Kod odbijanja obrazloženje je obavezno (do 500 znakova). Prihvaćeni umjetnici smatraju se odabranima, odnosno pobjednicima prilike. Novi status je odmah vidljiv umjetniku. |
| F-XXX | Organizator može zatražiti dopunu prijave | Srednji | ArtConnect.pdf | Gumb "Zatraži dopunu" otvara polje za poruku koje je obavezno. Nakon slanja status prijave mijenja se u "Potrebna dopuna", a poruka je vidljiva umjetniku. Dopuna se može zatražiti dok prilika nije u statusu "Završeno". |
| F-XXX | Organizator pregledava osnovne statistike svojih prilika | Srednji | ArtConnect.pdf | Prikazuju se broj prijava po području umjetnosti, broj prihvaćenih umjetnika i broj prijava po pojedinoj prilici. Brojevi odgovaraju stvarnom stanju u bazi podataka. |
| F-XXX | Nakon završetka događanja organizator objavljuje rezultate i označava pobjednike i umjetnike koji su sudjelovali | Srednji | ArtConnect.pdf | Opcija je dostupna samo za prilike u statusu "Završeno". Organizator može označiti samo umjetnike s prihvaćenom prijavom, a pobjednicima može upisati osvojenu nagradu. Objavljeni rezultati vidljivi su na javnoj stranici prilike, a označenim umjetnicima sudjelovanje se dodaje na profil. |
 
#### F... - F...: Dashboard prijavljenog organizatora - Umjetnici
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Organizator gledajući profil umjetnika može pozvati umjetnika na sudjelovanje u svojoj prilici klikom na gumb "Pozovi" te odabirom željene prilike u izborniku | Nizak | Dogovor tima | Izbornik nudi samo organizatorove prilike u statusu "Otvoreno za prijave". Umjetnik prima obavijest s poveznicom na priliku. Isti umjetnik može biti pozvan na istu priliku samo jednom. Poziv nije moguć ako se umjetnik već prijavio na tu priliku ili ako ga je organizator blokirao. |
| F-XXX | Organizator gledajući profil umjetnika može onemogućiti umjetniku prijave na svoje prilike klikom na gumb "Blokiraj" | Nizak | Dogovor tima | Prije blokiranja traži se potvrda. Blokirani umjetnik ne može se prijaviti ni na jednu priliku tog organizatora; umjesto gumba "Prijavi se" vidi poruku "Prijava na ovu priliku nije moguća". Već predane prijave ostaju nepromijenjene. Umjetnik se dodaje na popis "Blokirani umjetnici". |
 
#### F... - F...: Dashboard neprijavljenog korisnika
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Korisnik na direktoriju /art vidi zadnjih 20 objavljenih javnih djela u grid formatu | Visok | ArtConnect.pdf | Prikazuje se najviše 20 djela sortiranih od najnovijeg. Prikazuju se isključivo djela označena kao "Javno". Svaka kartica prikazuje sliku djela, naziv i ime umjetnika, a klikom se otvara stranica djela. |
| F-XXX | Tražilica na direktoriju /art kojom se mogu pretraživati djela po nazivu djela | Srednji | Dogovor tima | Pretraga ne razlikuje velika i mala slova i pronalazi djela kojima naziv sadrži upisani pojam. Rezultati sadrže samo javna djela. Ako nema rezultata, prikazuje se poruka "Nema pronađenih djela". |
| F-XXX | Korisnik na direktoriju /artists ima pristup tražilici umjetnika | Srednji | ArtConnect.pdf | Umjetnici se mogu pretraživati po imenu i filtrirati po području umjetnosti. Klikom na umjetnika otvara se njegov javni profil s biografijom, javnim djelima i sudjelovanjima. Privatna djela nisu vidljiva. |
| F-XXX | Korisnik na direktoriju /opportunities vidi zadnjih 20 objavljenih prilika u grid formatu, isto kao umjetnici, ali se ne može na njih prijaviti | Visok | ArtConnect.pdf | Prikazuje se najviše 20 aktivnih prilika (statusi "Otvoreno za prijave", "Prijave zatvorene" i "U procesu odabira") sortiranih od najnovije. Prilike u statusu "Priprema" nisu vidljive. Umjesto gumba "Prijavi se" prikazuje se gumb "Prijavi se za sudjelovanje" koji vodi na prijavu u sustav. |
| F-XXX | Korisnik na direktoriju /opportunities ima pristup tražilici objavljenih prilika | Visok | ArtConnect.pdf | Prilike se mogu pretraživati po nazivu i filtrirati po području umjetnosti, lokaciji, roku za prijavu i statusu. Filteri se mogu kombinirati. Ako nema rezultata, prikazuje se poruka "Nema pronađenih prilika". |
| F-XXX | Korisnik na direktoriju /opportunities može prikazati završene (arhivirane) prilike odabirom kartice "Završene" | Srednji | Dogovor tima | Kartica "Završene" prikazuje prilike u statusu "Završeno" sortirane od najnovije prema datumu završetka. Završene prilike prikazuju se odvojeno od aktivnih i jasno su označene oznakom "Završeno". Tražilica i filteri rade i nad završenim prilikama. |
| F-XXX | Na stranici završene prilike korisnik vidi objavljene rezultate, odnosno pobjednike i sudionike | Srednji | ArtConnect.pdf | Rezultati su vidljivi tek nakon što ih organizator objavi; do tada se prikazuje poruka "Rezultati još nisu objavljeni". Pobjednici su istaknuti odvojeno od ostalih sudionika, uz osvojenu nagradu ako postoji. Ime svakog umjetnika poveznica je na njegov javni profil. |
 
#### F... - F...: Prilike - životni ciklus
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Prilika prolazi kroz definirane statuse, koje mijenja organizator | Visok | ArtConnect.pdf | Statusi idu redom: Priprema -> Otvoreno za prijave -> Prijave zatvorene -> U procesu odabira -> Završeno. Prijelaz iz "Priprema" u "Otvoreno za prijave" obavlja se gumbom "Objavi priliku". Prijelazi su mogući samo prema naprijed, osim ponovnog otvaranja opisanog u nastavku. Po isteku roka status se automatski mijenja u "Prijave zatvorene". |
| F-XXX | Organizator objavljuje priliku klikom na gumb "Objavi priliku" | Visok | ArtConnect.pdf | Gumb "Objavi priliku" dostupan je samo u statusu "Priprema", na kartici i stranici prilike. Objava je moguća samo ako su sva obavezna polja ispunjena i rok za prijavu je u budućnosti; inače se prikazuje poruka koja navodi što nedostaje. Prije objave traži se potvrda. Nakon objave prilika ima status "Otvoreno za prijave", vidljiva je na /opportunities i u tražilici, a umjetnici se mogu prijaviti. Objavljena prilika ne može se vratiti u status "Priprema". |
| F-XXX | Organizator prije roka može prisilno zatvoriti priliku klikom na gumb "Zatvori priliku", te je može ponovno otvoriti klikom na gumb "Otvori priliku" | Srednji | Dogovor tima | Gumb "Zatvori priliku" dostupan je samo u statusu "Otvoreno za prijave" i mijenja status u "Prijave zatvorene". Gumb "Otvori priliku" dostupan je samo u statusu "Prijave zatvorene" i ako rok još nije istekao. Dok je prilika zatvorena, umjetnici se ne mogu prijaviti ni povući prijavu. Prije obje radnje traži se potvrda. |
| F-XXX | Nakon zatvaranja prijava prilika prelazi u status "U procesu odabira", u kojem organizator odabire pobjednike i piše obrazloženje odbijanja neodabranima | Visok | ArtConnect.pdf | Organizator pokreće odabir klikom na "Započni odabir", koji je dostupan samo u statusu "Prijave zatvorene". Nakon pokretanja odabira prilika se više ne može ponovno otvoriti. Prihvaćanje i odbijanje prijava moguće je samo u ovom statusu, a svako odbijanje zahtijeva obrazloženje. |
| F-XXX | Nakon odabira pobjednika prilika prelazi u arhivu (status "Završeno") | Visok | ArtConnect.pdf | Gumb "Završi odabir" dostupan je tek kada su sve prijave prihvaćene ili odbijene; do tada je onemogućen uz broj neobrađenih prijava. Prije završetka traži se potvrda. Nakon završetka prilika ima status "Završeno", prikazuje se u kartici "Završene" na /opportunities, a odluke o prijavama više se ne mogu mijenjati. |
 
#### F... - F...: Prijave na prilike
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Umjetnik se može prijaviti na istu priliku samo jednom, nakon čega gumb "Prijavi se" treba biti _locked_ | Visok | Dogovor tima | Nakon uspješne prijave gumb prikazuje tekst "Prijavljeno" i onemogućen je. Pokušaj ponovne prijave (npr. izravnim API pozivom) poslužitelj odbija s porukom o grešci. Povučena prijava je obrisana, pa se umjetnik može ponovno prijaviti dok je prilika otvorena. |
| F-XXX | Umjetnik može povući prijavu sve dok su prijave otvorene, nakon čega se prijava više ne može povući | Srednji | Dogovor tima | Gumb "Povuci prijavu" vidljiv je samo dok je prilika u statusu "Otvoreno za prijave" i rok nije istekao. Prije povlačenja traži se potvrda. Povlačenjem se prijava trajno briše zajedno s privicima: više se ne prikazuje u "Moje prijave", nije vidljiva organizatoru i ne ulazi u statistike ni izvještaje. Nakon zatvaranja prijava gumb nije dostupan, a API zahtjev se odbija. |
| F-XXX | Umjetnik može dodati događanje na koje je prihvaćen u osobni kalendar putem Google Calendar integracije | Srednji | ArtConnect.pdf | Gumb "Dodaj u kalendar" prikazuje se samo uz prihvaćene prijave. Nakon autorizacije Google računa u kalendaru se stvara događaj s nazivom prilike, datumom i vremenom početka i završetka događanja te adresom, ako je unesena. Ako završetak nije unesen, događaj u kalendaru traje 1 sat. Ako korisnik odbije autorizaciju, prikazuje se poruka o grešci, a prijava ostaje nepromijenjena. |
| F-XXX | Umjetnik se može prijaviti na istu priliku samo jednom, nakon čega gumb "Prijavi se" treba biti _locked_ | Visok | Dogovor tima | Nakon uspješne prijave gumb prikazuje tekst "Prijavljeno" i onemogućen je. Pokušaj ponovne prijave (npr. izravnim API pozivom) poslužitelj odbija s porukom o grešci. Povučena prijava se ne broji, pa se umjetnik može ponovno prijaviti dok je prilika otvorena. |
| F-XXX | Umjetnik može vidjeti na koje se prilike prijavio i u kojem su statusu prijave na svom Dashboardu ("Moje prijave"), uključujući povijest prijava na završene prilike | Visok | ArtConnect.pdf | Popis prikazuje naziv prilike, datum predaje, rok i trenutni status prijave. Status je jedan od: Predana, U pregledu, Potrebna dopuna, Prihvaćena, Odbijena. Prijave na završene prilike prikazuju se u odvojenoj sekciji "Povijest": prihvaćene (pobjede) označene su zelenom bojom, a odbijene crvenom, uz tekstualni status kako značenje ne bi ovisilo samo o boji. Promjena statusa koju napravi organizator vidljiva je umjetniku nakon osvježavanja stranice. |
| F-XXX | Umjetnik može povući prijavu sve dok su prijave otvorene, nakon čega se prijava više ne može povući | Srednji | Dogovor tima | Gumb "Povuci prijavu" vidljiv je samo dok je prilika u statusu "Otvoreno za prijave" i rok nije istekao. Prije povlačenja traži se potvrda. Povučena prijava više nije vidljiva organizatoru. Nakon zatvaranja prijava gumb nije dostupan, a API zahtjev se odbija. |
| F-XXX | Umjetnik može dopuniti prijavu kada organizator zatraži dopunu | Srednji | ArtConnect.pdf | Gumb "Dopuni prijavu" vidljiv je samo uz prijave u statusu "Potrebna dopuna", zajedno s porukom organizatora. Dopuna je moguća i nakon isteka roka za prijavu. Nakon slanja dopune status se mijenja u "U pregledu". |
| F-XXX | Umjetnik vidi razlog odbijanja prijave | Srednji | ArtConnect.pdf | Uz prijavu u statusu "Odbijena" prikazuje se obavezan razlog koji je unio organizator. |
| F-XXX | Umjetnik može dodati događanje na koje je prihvaćen u osobni kalendar putem Google Calendar integracije | Srednji | ArtConnect.pdf | Gumb "Dodaj u kalendar" prikazuje se samo uz prihvaćene prijave. Nakon autorizacije Google računa u kalendaru se stvara događaj s nazivom, datumom, vremenom i adresom prilike. Ako korisnik odbije autorizaciju, prikazuje se poruka o grešci, a prijava ostaje nepromijenjena. |
| F-XXX | Sudjelovanja i pobjede ostvarene putem platforme prikazuju se na javnom profilu umjetnika, a pobjede na arhiviranim prilikama umjetnik može istaknuti na glavnoj stranici profila | Visok | ArtConnect.pdf | Kada organizator označi umjetnika kao sudionika završene prilike, sudjelovanje se automatski pojavljuje u sekciji "Sudjelovanja" na profilu umjetnika. Umjetnik može pojedino sudjelovanje sakriti s javnog profila. Uz pobjede na prilikama u statusu "Završeno" nalazi se gumb "Istakni", kojim se pobjeda prikazuje na vrhu glavne stranice profila; ponovnim klikom isticanje se uklanja. |
 
#### F... - F...: Administrator
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-XXX | Sposobnost enumeracije dozvoljenih standardiziranih područja djelovanja (npr. "Fotografiranje", "Slikarstvo" i sl.) | Visok | ArtConnect.pdf | Administrator može dodati, preimenovati i deaktivirati (ne obrisati) područje djelovanja. Naziv područja je obavezan i jedinstven. Samo ova područja nude se pri registraciji umjetnika, unosu djela, objavi prilike i u filterima tražilice. Deaktivirano područje ostaje zapisano uz postojeće profile, djela i prilike, ali se ne može odabrati za nove unose. |
| F-XXX | Sposobnost enumeracije dozvoljenih standardiziranih vrsta prilika (npr. "Radionica", "Izložba" i sl.) | Visok | ArtConnect.pdf | Administrator može dodati, preimenovati i deaktivirati (ne obrisati) vrstu prilike. Naziv vrste je obavezan i jedinstven. Samo ove vrste nude se organizatoru pri kreiranju prilike i korisnicima u filterima tražilice. |
| F-XXX | Sposobnost ovjere organizatora, čime organizatori dobiju "kvačicu" pored svog imena | Srednji | Dogovor tima | Administrator na popisu organizatora može ovjeriti ili poništiti ovjeru organizatora. Ovjerenom organizatoru uz ime se prikazuje oznaka ovjere na javnom profilu, na karticama prilika i na stranicama prilika. Poništavanjem ovjere oznaka odmah nestaje sa svih tih mjesta. |
| F-XXX | Administrator upravlja korisničkim računima (pregled, blokiranje i brisanje umjetnika i organizatora) | Visok | ArtConnect.pdf | Administrator vidi popis svih korisnika s ulogom, datumom registracije i statusom računa, uz pretragu po imenu i e-adresi. Blokirani korisnik se ne može prijaviti u sustav, a njegov javni sadržaj nije vidljiv. Brisanje računa zahtijeva potvrdu. Administrator ne može blokirati ni obrisati vlastiti račun. |
| F-XXX | Administrator uklanja neprimjeren objavljeni sadržaj (djela i prilike) | Visok | ArtConnect.pdf | Administrator može obrisati bilo koje djelo ili priliku, uz unos razloga. Uklonjeni sadržaj više nije vidljiv javnosti ni u rezultatima pretrage. Vlasnik sadržaja na svom Dashboardu vidi da je sadržaj uklonjen i razlog uklanjanja. |
| F-XXX | Administrator upravlja osnovnim postavkama sustava | Visok | ArtConnect.pdf | Administrator može mijenjati vrijednosti poput najveće veličine datoteke, najvećeg broja datoteka po djelu i trajanja sesije. Nove vrijednosti primjenjuju se na sve nove unose i prijave, bez ponovnog pokretanja sustava. Neispravne vrijednosti (npr. negativni brojevi) se odbijaju uz poruku o grešci. |
| F-XXX | Administratoru su dostupni mjesečni izvještaji o korištenju platforme | Srednji | ArtConnect.pdf | Izvještaj za odabrani mjesec prikazuje broj novoregistriranih umjetnika, broj objavljenih prilika i broj predanih prijava, uz ukupne brojeve. Brojevi odgovaraju stvarnom stanju u bazi podataka. Izvještaj se može preuzeti u CSV formatu. |

<details>
<summary><strong>Izvori zahtjeva i kriteriji prihvaćanja</strong></summary>

Svaki zahtjev treba imati stabilan ID. **Izvor označava odakle zahtjev potječe**, primjerice iz odobrenog projektnog zadatka, zahtjeva dionika ili povratne informacije koja je promijenila zahtjev. Opišite opažljivo ponašanje umjesto naziva zaslona ili programskog okvira. U cijeloj dokumentaciji koristite istu ljestvicu prioriteta. Složenu korisničku interakciju objasnite u odgovarajućem obrascu uporabe umjesto kopiranja cijelog tijeka u ovu tablicu.

**Primjer — funkcijski zahtjevi za aplikaciju CrisisMap:**

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

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-01 | [Konkretan zahtjev (npr. odziv, sigurnost, pristupačnost)] | Visok / Srednji / Nizak | [Sigurnost / Uputa / SLA] | [Mjerenje / Testni scenarij / Pregled] |
|  |  |  |  |  |

<details>
<summary><strong>Nefunkcijski zahtjevi za analizu</strong></summary>

Relevantna svojstva mogu se odnositi na uporabljivost, pristupačnost, sigurnost, performanse ili pouzdanost. Odaberite svojstva specifična za projekt i opišite kako ih je moguće provjeriti. Zahtjev navodi što se očekuje; stvarna opažanja i dokazi pripadaju rezultatima ispitivanja, a ne drugom stupcu s rezultatima u ovoj tablici.

**Primjer — nefunkcijski zahtjevi za aplikaciju CrisisMap:**

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
|  |  |  |

<details>
<summary><strong>Akteri i povezani zahtjevi</strong></summary>

**Primjer — akteri aplikacije CrisisMap:**

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
| C-01 | Ograničenje | [Fiksni tehnički ili procesni uvjet] | [Zadatak / Pravila] | [Utjecaj na arhitekturu i oblikovanje] |
| AS-01 | Pretpostavka | [Očekivani uvjet, npr. o podacima ili okolini] | [Procjena tima] | [Kako i kada će se provjeriti valjanost] |
|  |  |  |  |  |
<details>
<summary><strong>Ograničenja nasuprot pretpostavkama</strong></summary>

Ograničenje je uvjet koji tim mora poštovati; pretpostavka je uvjet na koji se tim oslanja i koji treba ponovno provjeravati.

**Primjer — projektni kontekst CrisisMapa:**

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
|  |  |  |  |

<details>
<summary><strong>Primjer značajne promjene</strong></summary>

**Primjer scenarija — odluka tijekom pregleda CrisisMapa:**

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| [Datum pregleda] | F-004, NF-01 | Dodati ručni odabir lokacije kada korisnik odbije geolokaciju preglednika; bez toga građanin ne može podnijeti prijavu kriznog događaja s lokacijom. | [Poveznica na stvarnu bilješku pregleda ili zadatak tima] |

**Razlog promjene:** Zapis navodi zahvaćene stavke i objašnjava razlog iz perspektive korisnika, a zatim upućuje na dokaz odluke.  Nakon stvarne odluke ažurirajte trenutačne zahtjeve; stilska izmjena teksta ne zahtijeva zapis u dnevniku promjena. Trenutačni red zadataka držite u alatu za praćenje zadataka.

</details>

---

## 2.6 Sljedivost zahtjeva

**Cilj:** Osigurati dvosmjernu sljedivost — povezati zahtjeve s opisanim ponašanjem, dijelovima sustava koji ih ostvaruju te ispitivanjem ili drugom provjerom. 

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
| --- | --- | --- | --- |
| F-001 | [UC-001] | [Komponenta, modul ili drugo mjesto realizacije] | [ST-01, CT-01 ili druga provjera] |
|  |  |  |  |

<details>
<summary><strong>Sljedivost zahtjeva do obrazaca uporabe i ispitivanja</strong></summary>

**Primjer — poveznice zahtjeva CrisisMapa:**

| ID zahtjeva | Obrazac uporabe / ponašanje | Arhitekturna realizacija | Ispitivanje / provjera |
| --- | --- | --- | --- |
| F-004 | UC-002 Podnošenje prijave kriznog događaja | Web-klijent; API za prijave; usluga za prijave | ST-01 Valjano podnošenje prijave; ST-02 Nedostaje obavezna lokacija; ST-03 Dopuštenje geolokacije odbijeno |
| F-005 | Odabir primatelja obavijesti | Proces za obavijesti | CT-06 Primatelji obavijesti; potpuna dostava obavijesti nije pokrivena ovom provjerom |

**Pokrivenost i dokazi:** CT-06 provjerava odabir primatelja za F-005, ali sam po sebi ne dokazuje da je obavijest stvarno dostavljena; ako projekt zahtijeva potpunu dostavu od početka do kraja, za taj dio treba postojati zasebna provjera. Svaki redak pokazuje gdje je zahtjev opisan kao ponašanje, gdje je ostvaren u sustavu i gdje se nalazi dokaz njegove provjere. Zahtjev ne mora imati zaseban obrazac uporabe ako ne opisuje korisničku interakciju; tada navedite relevantno ponašanje, arhitekturni element ili drugi prikladan način realizacije. U svojem projektu koristite stvarne nazive komponenata, modula i provjera iz dokumentacije i implementacije. Nedostajuću poveznicu ostavite praznom ili označite kao *na čekanju* uz kratak razlog. Stvarni rezultati ispitivanja bilježe se uz ispitne slučajeve; ova tablica pokazuje gdje ih pronaći.

</details>

---

## 2.7 Pregled zahtjeva

**Cilj:** Zabilježiti važne povratne informacije o zahtjevima i odluke koje iz njih proizlaze na dvije formalne kontrolne točke projekta, u 7. i 14. tjednu.

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |
| Demo 2  | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |
| Završni pregled | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |

<details>
<summary><strong>Odluke o zahtjevima nakon pregleda</strong></summary>

**Primjer scenarija — pregled zahtjeva CrisisMapa:**

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | Demonstracija pokazuje da odbijanje pristupa lokaciji preglednika onemogućuje podnošenje prijave. | Dogovoriti ručni odabir lokacije; ažurirati F-004 i primjer NF-01 te razlog zabilježiti u odjeljku 2.5. |

**Odluka povezana s povratnom informacijom:** Zapis povezuje opaženo ponašanje s konkretnom promjenom zahtjeva i izbjegava zapisnik cijelog sastanka. Zapišite samo stvarne povratne informacije i odluke za kontrolne točke. Konzultacije u nekom drugom tjednu ne stvaraju dodatnu obaveznu predaju.

</details>

---

>**Završna provjera:** Zahtjevi su aktualni, provjerljivi i povezani. Svaki važan zahtjev moguće je pratiti od njegova opisa i ponašanja preko mjesta realizacije u sustavu do odgovarajućeg ispitivanja ili druge provjere. Poveznice koriste stvarne identifikatore i nazive iz projektne dokumentacije.










