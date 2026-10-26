# 2. Analiza zahtjeva

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
| F-RL-1 | Registracija umjetnika i organizatora (nadalje: korisnika) putem vanjskog servisa OAuth 2.0 (Google) | Visok | ArtConnect.pdf | Korisnik se registrira odabirom uloge (umjetnik ili organizator) i potvrdom Google računa. Umjetnik pri registraciji unosi osnovne podatke, jedno ili više područja umjetničkog djelovanja (iz popisa aktivnih područja, F-AD-1) i opcionalno do 5 poveznica na web-stranice ili društvene mreže (F-US-3). Organizator unosi ime, prezime i naziv organizacije. Isti Google račun može se registrirati jednom po ulozi, odnosno jedan korisnik može imati i ulogu umjetnika i ulogu organizatora. Ponovna registracija u ulozi koju taj Google račun već ima nije moguća. Ako korisnik odbije autorizaciju na Googleu, račun se ne stvara i prikazuje se poruka o grešci. |
| F-RL-2 | Prijava u sustav korisnika i administratora putem vanjskog servisa OAuth 2.0 (Google) | Visok | ArtConnect.pdf | Prijava u sustav obavlja se odabirom uloge, klikom na "Prijava putem Googlea" i potvrdom Google računa. Nakon uspješne prijave u sustav korisnik se preusmjerava na Dashboard koji odgovara njegovoj ulozi. Pokušaj prijave u sustav Google računom koji nije registriran preusmjerava na registraciju. Administratorski računi ne mogu se stvoriti registracijom, nego su unaprijed definirani u sustavu. Blokirani korisnik ne može se prijaviti u sustav i prikazuje mu se odgovarajuća poruka. |
| F-RL-3 | Odjava korisnika iz sesije klikom na gumb | Visok | Dogovor tima | Gumb "Odjava" dostupan je na svim stranicama za prijavljene korisnike. Klikom na gumb sesija se poništava i korisnik se preusmjerava na početnu stranicu. Nakon odjave stranice Dashboarda nisu dostupne, ni putem gumba "Natrag" u pregledniku. |
| F-RL-4 | Automatska odjava korisnika iz sesije po isteku vremena | Srednji | Dogovor tima | Sesija umjetnika i organizatora zadano istječe nakon 24h od prijave, a administratorska sesija nakon 1h od prijave. Svaka aktivnost korisnika produljuje sesiju. Nakon isteka sesije korisnik se pri sljedećoj radnji preusmjerava na prijavu u sustav, uz poruku da je sesija istekla. Trajanje sesije administrator može promijeniti u postavkama sustava (F-AD-6). |
| F-RL-5 | Prijavljeni korisnici s ovjerenom sesijom imaju pristup Dashboardu | Visok | Dogovor tima | Svaka uloga ima pristup samo svom Dashboardu (umjetnik, organizator, administrator). Neprijavljeni korisnik koji pokuša otvoriti stranicu Dashboarda preusmjerava se na prijavu u sustav. Prijavljeni korisnik koji pokuša otvoriti Dashboard druge uloge dobiva poruku o zabranjenom pristupu (HTTP 403). Provjera ovlasti obavlja se i na poslužitelju, ne samo u sučelju. |

#### F-NU: Javni prikaz aplikacije (za neregistrirane korisnike) (NO USER)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-NU-1 | Korisnik na direktoriju /art vidi zadnjih 20 objavljenih javnih djela u grid formatu | Visok | ArtConnect.pdf | Prikazuje se najviše 20 djela sortiranih od najnovijeg. Prikazuju se isključivo djela označena kao "Javno". Svaka kartica prikazuje sliku djela, naziv i ime umjetnika, a klikom se otvara stranica djela. |
| F-NU-2 | Tražilica na direktoriju /art kojom se mogu pretraživati djela po nazivu djela | Srednji | Dogovor tima | Pretraga ne razlikuje velika i mala slova i pronalazi djela kojima naziv sadrži upisani pojam. Rezultati sadrže samo javna djela. Ako nema rezultata, prikazuje se poruka "Nema pronađenih djela". |
| F-NU-3 | Korisnik na direktoriju /artists ima pristup tražilici umjetnika | Srednji | ArtConnect.pdf | Umjetnici se mogu pretraživati po imenu i filtrirati po području umjetnosti. Klikom na umjetnika otvara se njegov javni profil s biografijom, javnim djelima i sudjelovanjima. Privatna djela nisu vidljiva. |
| F-NU-4 | Korisnik na direktoriju /opportunities vidi zadnjih 20 objavljenih prilika u grid formatu, ali se ne može na njih prijaviti | Visok | ArtConnect.pdf | Prikazuje se najviše 20 aktivnih prilika (statusi "Otvoreno za prijave", "Prijave zatvorene" i "U procesu odabira") sortiranih od najnovije. Prilike u statusu "Priprema" nisu vidljive. Umjesto gumba "Prijavi se" prikazuje se gumb "Prijavi se za sudjelovanje" koji neprijavljenog korisnika vodi na prijavu u sustav. Prijavljeni umjetnik vidi isti popis, uz mogućnost prijave na priliku (F-PP-1). |
| F-NU-5 | Korisnik na direktoriju /opportunities ima pristup tražilici objavljenih prilika | Visok | ArtConnect.pdf | Prilike se mogu pretraživati po nazivu i filtrirati po području umjetnosti, lokaciji, roku za prijavu i statusu. Filteri se mogu kombinirati. Ako nema rezultata, prikazuje se poruka "Nema pronađenih prilika". |
| F-NU-6 | Korisnik na direktoriju /opportunities može prikazati završene prilike odabirom kartice "Završene" | Srednji | Dogovor tima | Kartica "Završene" prikazuje prilike u statusu "Završeno" sortirane od najnovije prema datumu prelaska u status "Završeno". Završene prilike prikazuju se odvojeno od aktivnih i jasno su označene oznakom "Završeno". Tražilica i filteri rade i nad završenim prilikama. |
| F-NU-7 | Na stranici završene prilike korisnik vidi objavljene rezultate, odnosno pobjednike | Srednji | ArtConnect.pdf | Rezultati se objavljuju automatski prelaskom prilike u status "Završeno" (F-LC-5). Popis sadrži sve pobjednike, a ime svakog pobjednika poveznica je na njegov javni profil. Odbijene prijave i obrazloženja odbijanja nisu javno vidljivi. |
 
#### F-UD: Dashboard prijavljenog umjetnika (UMJETNIK DASHBOARD)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-UD-1 | Umjetnici mogu urediti svoj profil koji su kreirali prilikom registracije klikom na "Postavke" | Visok | ArtConnect.pdf | Klikom na "Postavke" otvara se stranica s trenutnim podacima profila u obliku za uređivanje. Detalji su opisani u zahtjevima F-US-1 - F-US-4. |
| F-UD-2 | Umjetnici mogu vidjeti svoj portfolio klikom na "Moj portfolio" gdje su sva djela prikazana kao kartice | Visok | ArtConnect.pdf |Prikazuju se sva djela umjetnika, javna i privatna, u obliku kartica. Svaka kartica prikazuje prvu sliku djela (ili placeholder ako slika nema), naziv, godinu nastanka i oznaku "Javno" ili "Privatno". Ako portfolio nema djela, prikazuje se poruka s pozivom na dodavanje prvog djela.|
| F-UD-3 | Umjetnici mogu vidjeti svoje prijave na prilike klikom na "Moje prijave" gdje su sve prijave prikazane kao kartice | Visok | ArtConnect.pdf | Detalji su opisani u zahtjevu F-PP-4. |
| F-UD-4 | Umjetnik može pregledati obavijesti u "Inbox" | Srednji | Dogovor tima | Klikom na "Inbox" otvara se popis obavijesti sortiran od najnovije (npr. promjena statusa prijave, zahtjev za dopunom, poziv organizatora da se prijavi na priliku). Uz Inbox se prikazuje broj nepročitanih obavijesti. Klikom na obavijest ona se označava pročitanom. |
  
#### F-UP: Dashboard prijavljenog umjetnika - Portfolio (UMJETNIK PORTFOLIO)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-UP-1 | Umjetnik može urediti biografiju i opis umjetničkog rada koji se prikazuju na vrhu portfolija | Visok | ArtConnect.pdf | Biografija i opis rada su tekstualna polja do 2000 znakova. Promjene su nakon spremanja vidljive na javnom profilu. Prazna polja se na javnom profilu ne prikazuju. |
| F-UP-2 | Umjetnici mogu dodavati nova djela u svoj portfolio klikom na gumb "Dodaj" unutar "Moj portfolio" | Visok | ArtConnect.pdf | Formular sadrži polja naziv, godina nastanka, tehnika, dimenzije i opis te prijenos datoteka. Naziv i barem jedna datoteka su obavezni. Godina nastanka ne može biti u budućnosti. Novo djelo je po defaultu privatno. Nakon spremanja djelo se pojavljuje kao kartica u "Moj portfolio". |
| F-UP-3 | Umjetnici mogu uređivati djela unutar portfolija klikom na gumb "Uredi" na kartici djela | Visok | ArtConnect.pdf | Otvara se formular s trenutnim podacima djela. Mogu se mijenjati sva polja te dodavati i uklanjati datoteke, uz ista pravila kao kod dodavanja. Promjene se spremaju klikom na "Spremi", a klikom na "Odustani" djelo ostaje nepromijenjeno. |
| F-UP-4 | Umjetnici mogu brisati djela unutar portfolija klikom na gumb "Obriši" na kartici djela | Visok | Dogovor tima | Prije brisanja traži se potvrda. Obrisano djelo i njegove datoteke uklanjaju se iz portfolija i s javnog profila. Djelo koje je dio prijave u statusu "Predana", "U pregledu" ili "Potrebna dopuna" ne može se obrisati, a prikazuje se poruka s nazivom te prilike. |
| F-UP-5 | Svako djelo može sadržavati do N datoteka (.pdf, .jpg, .png, .gif) s ograničenjem od X MB po datoteci | Visok | Dogovor tima | N i X su postavke sustava (F-AD-6), zadano N = 3 i X = 5. Sustav odbija datoteke drugih formata i datoteke veće od X MB, uz poruku koja navodi razlog. Nakon N dodanih datoteka dodavanje nove nije moguće dok se neka ne ukloni. Provjera formata i veličine obavlja se i na poslužitelju. |
| F-UP-6 | Svako djelo može biti otvoreno za javnost ili skriveno privatno klikom na checkbox "Javno" unutar funkcionalnosti "Uredi" | Visok | ArtConnect.pdf | Javno djelo vidljivo je na javnom profilu umjetnika, na /art i u rezultatima tražilice. Privatno djelo vidi samo umjetnik, te organizator prilike na koju je djelo priloženo uz prijavu. Promjena vidljivosti primjenjuje se odmah nakon spremanja. |
| F-UP-7 | Klikom na gumb "Preview" na kartici prikazuje se djelo u cjelosti - iz perspektive javnog, neprijavljenog korisnika | Srednji | Dogovor tima | Prikaz je jednak javnoj stranici djela, bez gumba za uređivanje i brisanje. Za privatno djelo prikaz sadrži upozorenje "Ovo djelo trenutno nije javno vidljivo". |

#### F-US: Dashboard prijavljenog umjetnika - Postavke (UMJETNIK SETTINGS)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-US-1 | Umjetnik može urediti ime i prezime profila | Visok | ArtConnect.pdf | Promjene se spremaju klikom na "Spremi" i odmah su vidljive na javnom profilu. Ime i prezime su obavezni. E-adresa se preuzima iz Google računa i ne može se mijenjati. |
| F-US-2 | Umjetnik može promijeniti područja umjetničkog djelovanja | Visok | ArtConnect.pdf | Umjetnik odabire jedno ili više područja iz popisa aktivnih područja koja definira administrator (F-AD-1). Mora biti odabrano barem jedno područje. Promjena se odražava u rezultatima tražilice umjetnika. |
| F-US-3 | Umjetnik može dodati, urediti ili ukloniti poveznice na web-stranice i društvene mreže | Srednji | ArtConnect.pdf | Svaka poveznica unosi se u zasebno tekstualno polje. Novo prazno polje dodaje se klikom na gumb "+", a pojedino polje uklanja se klikom na gumb "X" pored njega. Moguće je dodati najviše 5 poveznica, nakon čega gumb "+" postaje onemogućen. Poveznice nisu obavezne, a prazna polja se pri spremanju zanemaruju. Sustav prihvaća samo ispravno oblikovane URL adrese, a za neispravne prikazuje poruku o grešci uz odgovarajuće polje. Poveznice se na javnom profilu otvaraju u novoj kartici preglednika. |
| F-US-4 | Umjetnik može uređivati koje obavijesti dobiva klikom na "Postavke obavijesti" unutar izbornika "Postavke" | Nizak | Dogovor tima |Za svaku vrstu obavijesti postoji zaseban prekidač za uključivanje i isključivanje. Sve vrste obavijesti su zadano uključene. Nakon spremanja umjetnik više ne prima obavijesti isključenih vrsta.|
 
#### F-UW: Dashboard prijavljenog umjetnika - Lista želja (UMJETNIK WISHLIST)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-UW-1 | Umjetnik može staviti priliku na "listu želja" prije nego što pripremi svu dokumentaciju potrebnu za prijavu | Nizak | Dogovor tima | Gumb "Dodaj na listu želja" prikazuje se prijavljenom umjetniku na kartici i stranici prilike u statusu "Otvoreno za prijave". Ponovnim klikom prilika se uklanja s liste. Nakon što se umjetnik prijavi na priliku, ona se automatski uklanja s liste želja. |
| F-UW-2 | Umjetnik može pregledati sve prilike s liste želja klikom na "Lista želja" u desnom izborniku | Nizak | Dogovor tima | Prikazuju se sve prilike s liste želja kao kartice, sortirane po roku za prijavu od najbližeg. Svaka kartica prikazuje naziv, rok i datum događanja te gumb "Prijavi se". Prilike kojima su prijave zatvorene ostaju na listi s oznakom "Prijave zatvorene" i bez gumba "Prijavi se". Ako je lista prazna, prikazuje se odgovarajuća poruka. |
 
#### F-OD: Dashboard prijavljenog organizatora (ORGANIZATOR DASHBOARD)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-OD-1 | Organizator može urediti svoj profil koji je kreirao prilikom registracije klikom na "Postavke" | Visok | Dogovor tima | Klikom na "Postavke" otvara se stranica s trenutnim podacima profila u obliku za uređivanje. Detalji su opisani u zahtjevima F-OS-1 - F-OS-3. |
| F-OD-2 | Organizator može vidjeti svoje prilike klikom na "Moje prilike" gdje su sve prilike prikazane kao kartice | Visok | ArtConnect.pdf | Prikazuju se samo prilike koje je organizator sam kreirao. Svaka kartica prikazuje naziv, status, rok za prijavu i broj pristiglih prijava. Ako organizator nema prilika, prikazuje se poruka s pozivom na kreiranje prve prilike. |
| F-OD-3 | Organizator može pregledati obavijesti o svojim trenutno aktivnim prilikama klikom na "Inbox" | Srednji | Dogovor tima | Klikom na "Inbox" otvara se popis obavijesti sortiran od najnovije (npr. nova prijava, poslana dopuna, povučena prijava). Uz Inbox se prikazuje broj nepročitanih obavijesti. Klikom na obavijest ona se označava pročitanom. |
 
#### F-OU: Dashboard prijavljenog organizatora na profilu nekog umjetnika (ORGANIZATOR UMJETNICI)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-OU-1 | Organizator gledajući profil umjetnika može pozvati umjetnika na sudjelovanje u svojoj prilici klikom na gumb "Pozovi" te odabirom željene prilike u izborniku | Nizak | Dogovor tima | Izbornik nudi samo organizatorove prilike u statusu "Otvoreno za prijave". Umjetnik prima obavijest s poveznicom na priliku. Isti umjetnik može biti pozvan na istu priliku samo jednom. Poziv nije moguć ako se umjetnik već prijavio na tu priliku ili ako ga je organizator blokirao. |
| F-OU-2 | Organizator gledajući profil umjetnika može onemogućiti umjetniku prijave na svoje prilike klikom na gumb "Blokiraj" | Nizak | Dogovor tima | Prije blokiranja traži se potvrda. Blokirani umjetnik ne može se prijaviti ni na jednu priliku tog organizatora; umjesto gumba "Prijavi se" vidi poruku "Prijava na ovu priliku nije moguća". Već predane prijave ostaju nepromijenjene. Umjetnik se dodaje na popis "Blokirani umjetnici" (F-OS-3). |

#### F-OS: Dashboard prijavljenog organizatora - Postavke (ORGANIZATOR SETTINGS)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-OS-1 | Organizator može promijeniti osnovne podatke o sebi (ime, prezime, naziv organizacije) | Visok | Dogovor tima | Promjene se spremaju klikom na "Spremi" i odmah su vidljive na javnom profilu organizatora. Ime, prezime i naziv organizacije su obavezni. |
| F-OS-2 | Organizator može uređivati koje obavijesti dobiva klikom na "Postavke obavijesti" unutar izbornika "Postavke" | Nizak | Dogovor tima | Za svaku vrstu obavijesti postoji zaseban prekidač za uključivanje i isključivanje. Sve vrste obavijesti su zadano uključene. Nakon spremanja organizator više ne prima obavijesti isključenih vrsta. |
| F-OS-3 | Organizator može uređivati blokirane umjetnike klikom na "Blokirani umjetnici" unutar izbornika "Postavke" | Nizak | Dogovor tima | Prikazuje se popis umjetnika blokiranih prema F-OU-2, s imenom i datumom blokiranja. Klikom na "Odblokiraj" umjetnik se uklanja s popisa i ponovno se može prijavljivati na prilike tog organizatora. Ako nema blokiranih umjetnika, prikazuje se odgovarajuća poruka. |
 
#### F-ON: Dashboard prijavljenog organizatora - Moje prilike (ORGANIZATOR NATJEČAJI)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-ON-1 | Organizator može stvarati nove prilike klikom na gumb "Nova prilika" unutar "Moje prilike" | Visok | ArtConnect.pdf | Sadržaj prilike unosi se kao slobodni tekst u Markdown formatu: organizator u jedno tekstualno polje upisuje opis, kriterije za prijavu, informacije o nagradi i sve ostale detalje, uz pregled oblikovanog teksta prije spremanja. Dokumenti (npr. pravilnik, plakat) prilažu se putem upload dropzonea, povlačenjem datoteka ili klikom na nju; dozvoljeno je najviše M datoteka (.pdf, .jpg, .png, .gif) do X MB po datoteci, gdje su M i X postavke sustava (F-AD-6), zadano M = 5 i X = 5. Svaka dodana datoteka može se ukloniti klikom na "X". Obavezni su tekst prilike te strukturirana polja koja sustav koristi za pretraživanje, statuse i kalendar: naslov, vrsta prilike, područje umjetnosti, rok za prijavu i datum i vrijeme početka događanja. Datum i vrijeme završetka događanja i adresa nisu obavezni. Prilika se ne može spremiti bez obaveznih polja. Vrsta i područje biraju se iz popisa koje definira administrator (F-AD-1, F-AD-2), a rok mora biti u budućnosti. Početak događanja ne smije biti prije roka za prijavu, a završetak ne smije biti prije početka. Na stranici prilike prikazuju se rok za prijavu i datum događanja, Markdown se prikazuje oblikovan, a ugrađeni HTML i skripte se ne izvršavaju. Privici su dostupni za preuzimanje. Nova prilika dobiva status "Priprema". |
| F-ON-2 | Organizator može unijeti adresu prilike, a lokacija se prikazuje na karti putem Google Maps API-ja | Srednji | ArtConnect.pdf | Adresa nije obavezna. Nakon unosa ispravne adrese karta s oznakom lokacije prikazuje se na stranici prilike. Ako adresa nije unesena, karta se ne prikazuje. Za adresu koju servis ne prepozna prikazuje se poruka o grešci i prilika se ne može spremiti dok se adresa ne ispravi ili ukloni. |
| F-ON-3 | Organizator može uređivati priliku klikom na gumb "Uredi" na kartici prilike | Visok | Dogovor tima | Sva polja prilike moguće je urediti u svim statusima. Pravila provjere iz F-ON-1 primjenjuju se na polja koja se mijenjaju. Rok za prijavu može se mijenjati samo u statusima "Priprema", "Otvoreno za prijave" i "Prijave zatvorene"; nakon objave prilike rok se može samo produžiti, a novi rok mora biti u budućnosti. Produženje roka ne mijenja status prilike automatski (ponovno otvaranje opisano je u F-LC-3). Promjene se spremaju klikom na "Spremi". |
| F-ON-4 | Organizator može brisati prilike klikom na gumb "Obriši" na kartici prilike | Visok | Dogovor tima | Prije brisanja traži se potvrda. Brisanje je moguće samo dok prilika nema nijednu prijavu; povučene prijave su obrisane i ne broje se. Za priliku s prijavama gumb "Obriši" je onemogućen uz objašnjenje. |
 
#### F-OP: Dashboard prijavljenog organizatora - Prijave na prilike (ORGANIZATOR PRIJAVE)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-OP-1 | Organizator može pregledati priliku te umjetnike koji su trenutno prijavljeni na nju | Visok | ArtConnect.pdf | Stranica prilike prikazuje njezine podatke i popis prijavljenih umjetnika s imenom, datumom predaje i statusom prijave, uz ukupan broj prijava. Povučene prijave su obrisane pa se ne prikazuju ni ne broje. Klikom na prijavu otvaraju se detalji s odabranim djelima, porukom umjetnika i priloženom dokumentacijom. Prvim otvaranjem status prijave automatski se mijenja iz "Predana" u "U pregledu". |
| F-OP-2 | Organizator može zatražiti dopunu prijave | Visok | ArtConnect.pdf | Gumb "Zatraži dopunu" dostupan je za prijave u statusu "U pregledu" dok prilika nije u statusu "U procesu odabira" ili "Završeno". Gumb otvara polje za poruku koje je obavezno. Nakon slanja status prijave mijenja se u "Potrebna dopuna", poruka je vidljiva umjetniku, a umjetnik prima obavijest. |
| F-OP-3 | Organizator u procesu odabira označava potencijalne pobjednike, a neoznačenim prijavama upisuje obrazloženje odbijanja | Visok | ArtConnect.pdf | U statusu "U procesu odabira" (F-LC-4) svaka prijava, u popisu prijava i u detaljima prijave, ima checkbox "Pobjednik" i polje "Obrazloženje odbijanja" (do 500 znakova), koje je dostupno samo dok checkbox nije označen. Označavanje je privremeno: organizator ga može mijenjati proizvoljno mnogo puta, a ono nije vidljivo umjetniku i ne mijenja status prijave. Popis prijava prikazuje broj označenih prijava i broj neoznačenih prijava bez obrazloženja. Konačni statusi dodjeljuju se tek završetkom odabira (F-LC-5). |
| F-OP-4 | Organizator pregledava osnovne statistike svojih prilika | Srednji | ArtConnect.pdf | Prikazuju se broj prijava po području umjetnosti, broj pobjednika (prihvaćenih prijava) i broj prijava po pojedinoj prilici. Brojevi odgovaraju stvarnom stanju u bazi podataka. |
  
#### F-LC: Prilike - životni ciklus (LIFECYCLE)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-LC-1 | Prilika prolazi kroz definirane statuse | Visok | ArtConnect.pdf | Statusi idu redom: Priprema -> Otvoreno za prijave -> Prijave zatvorene -> U procesu odabira -> Završeno. Prijelazi su mogući samo prema naprijed, osim ponovnog otvaranja opisanog u F-LC-3. Prijelaze pokreće organizator (F-LC-2 - F-LC-5), osim automatskog zatvaranja: po isteku roka status "Otvoreno za prijave" automatski se mijenja u "Prijave zatvorene". |
| F-LC-2 | Organizator objavljuje priliku klikom na gumb "Objavi priliku" | Visok | ArtConnect.pdf | Gumb "Objavi priliku" dostupan je samo u statusu "Priprema", na kartici i stranici prilike. Objava je moguća samo ako je rok za prijavu i dalje u budućnosti; inače se prikazuje poruka da rok treba pomaknuti. Prije objave traži se potvrda. Nakon objave prilika ima status "Otvoreno za prijave", vidljiva je na /opportunities i u tražilici, a umjetnici se mogu prijaviti. Objavljena prilika ne može se vratiti u status "Priprema". |
| F-LC-3 | Organizator prije roka može prisilno zatvoriti priliku klikom na gumb "Zatvori priliku", te je može ponovno otvoriti klikom na gumb "Otvori priliku" | Srednji | Dogovor tima | Gumb "Zatvori priliku" dostupan je samo u statusu "Otvoreno za prijave" i mijenja status u "Prijave zatvorene". Gumb "Otvori priliku" dostupan je samo u statusu "Prijave zatvorene" i ako rok još nije istekao; ako je rok istekao, organizator ga najprije može produžiti (F-ON-3). Dok je prilika zatvorena, umjetnici se ne mogu prijaviti ni povući prijavu. Prije obje radnje traži se potvrda. |
| F-LC-4 | Organizator pokreće odabir klikom na gumb "Započni odabir", čime prilika prelazi u status "U procesu odabira" | Visok | ArtConnect.pdf | Gumb "Započni odabir" dostupan je samo u statusu "Prijave zatvorene". Prije pokretanja traži se potvrda. Nakon pokretanja prilika ima status "U procesu odabira" i više se ne može ponovno otvoriti. Označavanje potencijalnih pobjednika i upis obrazloženja odbijanja (F-OP-3) mogući su samo u ovom statusu. |
| F-LC-5 | Organizator završava odabir klikom na gumb "Završi odabir", čime označeni umjetnici postaju pobjednici, a prilika prelazi u status "Završeno" | Visok | ArtConnect.pdf | Gumb "Završi odabir" dostupan je samo u statusu "U procesu odabira" i tek kada svaka neoznačena prijava ima upisano obrazloženje odbijanja; do tada je onemogućen uz broj prijava bez obrazloženja. Prije završetka traži se potvrda koja prikazuje broj pobjednika i broj odbijenih prijava; ako nijedna prijava nije označena, potvrda upozorava da prilika neće imati pobjednika. Završetkom odabira označene prijave dobivaju status "Prihvaćena", a neoznačene status "Odbijena" s upisanim obrazloženjem, i svi prijavljeni umjetnici primaju obavijest. Prilika ima status "Završeno", rezultati se objavljuju na stranici prilike (F-NU-7), sudjelovanja se dodaju na profile pobjednika (F-PP-8), prilika se prikazuje u kartici "Završene" na /opportunities, a statusi prijava više se ne mogu mijenjati. |
 
#### F-PP: Prijave na prilike - umjetnik (PRIJAVE PRILIKE)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-PP-1 | Umjetnik se prijavljuje na priliku slanjem odabranih djela iz portfolija i dodatnih materijala | Visok | ArtConnect.pdf | Gumb "Prijavi se" prikazuje se prijavljenom umjetniku na kartici i stranici prilike u statusu "Otvoreno za prijave" ako rok nije istekao i ako ga organizator nije blokirao (F-OU-2). Obrazac prijave sadrži odabir djela iz vlastitog portfolija (javnih ili privatnih), opcionalnu poruku organizatoru do 2000 znakova i opcionalne privitke, koji podliježu istim ograničenjima kao datoteke djela (F-UP-5). Barem jedno djelo je obavezno. Nakon slanja prijava ima status "Predana", organizator prima obavijest, prilika se uklanja s liste želja umjetnika (F-UW-1), a gumb mijenja tekst u "Prijavljeno" (F-PP-2). |
| F-PP-2 | Umjetnik se može prijaviti na istu priliku samo jednom, nakon čega gumb "Prijavi se" treba biti _locked_ | Visok | Dogovor tima | Nakon uspješne prijave gumb prikazuje tekst "Prijavljeno" i onemogućen je. Pokušaj ponovne prijave (npr. izravnim API pozivom) poslužitelj odbija s porukom o grešci. Povučena prijava je obrisana, pa se umjetnik može ponovno prijaviti dok je prilika otvorena. |
| F-PP-3 | Umjetnik može povući prijavu sve dok su prijave otvorene, nakon čega se prijava više ne može povući | Srednji | Dogovor tima | Gumb "Povuci prijavu" vidljiv je samo dok je prilika u statusu "Otvoreno za prijave" i rok nije istekao. Prije povlačenja traži se potvrda. Povlačenjem se prijava trajno briše zajedno s privicima: više se ne prikazuje u "Moje prijave", nije vidljiva organizatoru i ne ulazi u statistike ni izvještaje. Nakon zatvaranja prijava gumb nije dostupan, a API zahtjev se odbija. |
| F-PP-4 | Umjetnik može vidjeti na koje se prilike prijavio i u kojem su statusu prijave na svom Dashboardu ("Moje prijave"), uključujući povijest prijava na završene prilike | Visok | ArtConnect.pdf | Svaka kartica prikazuje naziv prilike, datum predaje, rok i trenutni status prijave. Status je jedan od: Predana, U pregledu, Potrebna dopuna, Prihvaćena, Odbijena. Prijave na završene prilike prikazuju se u odvojenoj sekciji "Povijest": prihvaćene su označene zelenom bojom, a odbijene crvenom, uz tekstualni status kako značenje ne bi ovisilo samo o boji. Statusi "Prihvaćena" i "Odbijena" dodjeljuju se tek završetkom odabira (F-LC-5); dok traje odabir, umjetnik vidi status "U pregledu" ili "Potrebna dopuna", a ne vidi je li njegova prijava označena. Promjena statusa vidljiva je umjetniku nakon osvježavanja stranice. |
| F-PP-5 | Umjetnik može dopuniti prijavu kada organizator zatraži dopunu | Visok | ArtConnect.pdf | Gumb "Dopuni prijavu" vidljiv je samo uz prijave u statusu "Potrebna dopuna", zajedno s porukom organizatora. Dopuna je moguća i nakon isteka roka za prijavu, sve dok prilika nije u statusu "Završeno". Nakon slanja dopune status se mijenja u "U pregledu", a organizator prima obavijest. |
| F-PP-6 | Umjetnik vidi razlog odbijanja prijave | Srednji | ArtConnect.pdf | Uz prijavu u statusu "Odbijena" prikazuje se obavezan razlog koji je unio organizator. |
| F-PP-7 | Umjetnik može dodati događanje prilike na kojoj je pobjednik u osobni kalendar putem Google Calendar integracije | Srednji | ArtConnect.pdf | Gumb "Dodaj u kalendar" prikazuje se samo uz prihvaćene prijave; budući da se status "Prihvaćena" dodjeljuje tek završetkom odabira (F-LC-5), odluka je u tom trenutku konačna. Nakon autorizacije Google računa u kalendaru se stvara događaj s nazivom prilike, datumom i vremenom početka i završetka događanja te adresom, ako je unesena. Ako završetak nije unesen, događaj u kalendaru traje 1 sat. Ako korisnik odbije autorizaciju, prikazuje se poruka o grešci, a prijava ostaje nepromijenjena. |
| F-PP-8 | Sudjelovanja ostvarena putem platforme prikazuju se na javnom profilu umjetnika, a umjetnik ih može istaknuti na glavnoj stranici profila | Visok | ArtConnect.pdf | Kada prilika prijeđe u status "Završeno" (F-LC-5), svakom pobjedniku sudjelovanje se automatski pojavljuje u sekciji "Sudjelovanja" na javnom profilu, s nazivom i vrstom prilike te datumom događanja. Umjetnik može pojedino sudjelovanje sakriti s javnog profila. Gumbom "Istakni" sudjelovanje se prikazuje na vrhu glavne stranice profila; ponovnim klikom isticanje se uklanja. |
 
#### F-AD: Administrator (ADMIN)
| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-AD-1 | Sposobnost enumeracije dozvoljenih standardiziranih područja djelovanja (npr. "Fotografiranje", "Slikarstvo" i sl.) | Visok | ArtConnect.pdf | Administrator može dodati, preimenovati i deaktivirati (ne obrisati) područje djelovanja. Naziv područja je obavezan i jedinstven. Samo ova područja nude se pri registraciji umjetnika, u postavkama profila umjetnika, pri stvaranju prilike i u filterima tražilica. Deaktivirano područje ostaje zapisano uz postojeće profile i prilike, ali se ne može odabrati za nove unose. |
| F-AD-2 | Sposobnost enumeracije dozvoljenih standardiziranih vrsta prilika (npr. "Radionica", "Izložba" i sl.) | Visok | ArtConnect.pdf | Administrator može dodati, preimenovati i deaktivirati (ne obrisati) vrstu prilike. Naziv vrste je obavezan i jedinstven. Samo ove vrste nude se organizatoru pri kreiranju prilike i korisnicima u filterima tražilice. |
| F-AD-3 | Sposobnost ovjere organizatora, čime organizatori dobiju "kvačicu" pored svog imena | Srednji | Dogovor tima | Administrator na popisu organizatora može ovjeriti ili poništiti ovjeru organizatora. Ovjerenom organizatoru uz ime se prikazuje oznaka ovjere na javnom profilu, na karticama prilika i na stranicama prilika. Poništavanjem ovjere oznaka odmah nestaje sa svih tih mjesta. |
| F-AD-4 | Administrator upravlja korisničkim računima (pregled, blokiranje i brisanje umjetnika i organizatora) | Visok | ArtConnect.pdf | Administrator vidi popis svih korisnika s ulogom, datumom registracije i statusom računa, uz pretragu po imenu i e-adresi. Blokirani korisnik se ne može prijaviti u sustav, a njegov javni sadržaj nije vidljiv. Brisanje računa zahtijeva potvrdu. Administrator ne može blokirati ni obrisati vlastiti račun. |
| F-AD-5 | Administrator uklanja neprimjeren objavljeni sadržaj (djela i prilike) | Visok | ArtConnect.pdf | Administrator može obrisati bilo koje djelo ili priliku, uz unos razloga. Uklonjeni sadržaj više nije vidljiv javnosti ni u rezultatima pretrage. Vlasnik sadržaja na svom Dashboardu vidi da je sadržaj uklonjen i razlog uklanjanja. Brisanjem prilike brišu se i sve prijave na nju, a prijavljeni umjetnici primaju obavijest s razlogom uklanjanja. |
| F-AD-6 | Administrator upravlja osnovnim postavkama sustava | Visok | ArtConnect.pdf | Administrator može mijenjati najveću veličinu datoteke (X), najveći broj datoteka po djelu (N), najveći broj privitaka po prilici (M) i trajanje sesije po ulozi. Nove vrijednosti primjenjuju se na sve nove unose i prijave, bez ponovnog pokretanja sustava. Neispravne vrijednosti (npr. negativni brojevi) se odbijaju uz poruku o grešci. |
| F-AD-7 | Administratoru su dostupni mjesečni izvještaji o korištenju platforme | Srednji | ArtConnect.pdf | Izvještaj za odabrani mjesec prikazuje broj novoregistriranih umjetnika, broj objavljenih prilika i broj predanih prijava, uz ukupne brojeve. Brojevi odgovaraju stvarnom stanju u bazi podataka. Izvještaj se može preuzeti u CSV formatu. |

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

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-01 | [Konkretan zahtjev (npr. odziv, sigurnost, pristupačnost)] | Visok / Srednji / Nizak | [Sigurnost / Uputa / SLA] | [Mjerenje / Testni scenarij / Pregled] |
|  |  |  |  |  |

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
|  |  |  |

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
| C-01 | Ograničenje | [Fiksni tehnički ili procesni uvjet] | [Zadatak / Pravila] | [Utjecaj na arhitekturu i oblikovanje] |
| AS-01 | Pretpostavka | [Očekivani uvjet, npr. o podacima ili okolini] | [Procjena tima] | [Kako i kada će se provjeriti valjanost] |
|  |  |  |  |  |
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
|  |  |  |  |

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
| F-001 | [UC-001] | [Komponenta, modul ili drugo mjesto realizacije] | [ST-01, CT-01 ili druga provjera] |
|  |  |  |  |

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

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |
| Demo 2  | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |
| Završni pregled | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |

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