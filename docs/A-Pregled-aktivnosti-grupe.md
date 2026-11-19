# A. Pregled aktivnosti grupe


## A.1 Evidencija sastanaka

Kratice članova tima: MB = Mia Barada, VC = Vilim Crčić, MC = Matko Crnoja, AD = Ana Dumbović, BJ = Borna Janežić, LK = Luka Kauzlarić, LS = Leon Sabljak																												

| Datum i sudionici | Glavna tema | Donesena odluka ili zadatak  | Poveznica na zadatak ili  rezultat, ako postoji |
| --- | --- | --- | --- |
| 19.10.2026.; MB, VC,  MC, AD, BJ, LK, LS | Dogovor i organizacija rada za prvi ciklus|  Tim se odlučio prvo na izradu autentifikacije pa portofolija. Donesena je podjela: VC i BJ rade backend, MC i LS bazu, MB i AD frontend te LK dokumentaciju.|                                             |
| 3.11.2026.; MB, VC,  MC, AD, BJ, LK, LS | Usklađivanje frontenda i backenda te ostvarivanje registracije korisnika |  Odlučeno je da se pri registraciji na formi provjerava samo jesu li ispunjeni ime i prezime; ti se podaci ne povlače iz Google računa|  |   
| 10. 11. 2026.; BJ, VC, LS, MC | Upoznavanje sa sučeljem za programski (Python) pristup S3 bucketu | BJ, VC, LS su uspješno podesili .env file i povezali se sa S3 bucketom za upload datoteka; Dogovorili smo se za daljnji rad oko backenda |  |                                        


## A.2 Plan rada

**Trenutačni plan:** Plan se vodi u ovoj tablici, a prema podjeli rada dogovorenoj 19. 10. 2026. odgovorni su: VC i BJ za poslužitelj, MC i LS za bazu, MB i AD za klijent, LK za dokumentaciju. 

| Razdoblje | Glavni planirani rad | Odgovorni članovi | Poveznica na zadatke |
| --- | --- | --- | --- |
| Ciklus 1 (7. tjedan) | Prijava Google računom, registracija i uloge, uređivanje profila | VC, BJ (poslužitelj); MB, AD (klijent) | [#2 (Izrada komponente za registraciju)](https://github.com/matkocrnoja/ArtConnect/issues/2), [ #3 (Registracija koristeći OAuth2.0 (Google))](https://github.com/matkocrnoja/ArtConnect/issues/3), [#4 (Dashboard prijavljenog umjetnika)](https://github.com/matkocrnoja/ArtConnect/issues/4), [#8 (Postavke umjetnika/organizatora)](https://github.com/matkocrnoja/ArtConnect/issues/8), [auth](../artconnect-api/app/routers/auth.py) |
| Ciklus 1 (7. tjedan) | Portfolio: djela s datotekama u S3 bucketu | VC, BJ, LS (poslužitelj i baza); AD (klijent) | [#5 Izrada i održavanje ER dijagrama](https://github.com/matkocrnoja/ArtConnect/issues/5), [#9 Umjetnik: Moj portfolio - frontend](https://github.com/matkocrnoja/ArtConnect/issues/9), [#11 Umjetnik: Moj portfolio - backend](https://github.com/matkocrnoja/ArtConnect/issues/11), [portfolio](../artconnect-api/app/routers/portfolio.py), [media](../artconnect-api/app/routers/media.py) |
| Ciklus 1 (7. tjedan) | Prilike: stvaranje, uređivanje, pregled | MB (klijent) | [#10 Organizator: Moje prilike - frontend](https://github.com/matkocrnoja/ArtConnect/issues/10) |
| Ciklus 1 (7. tjedan) | Analiza zahtjeva, obrasci uporabe, arhitektura | LK, MC | [#1 Sažimanje količine funkcionalnih zahtjeva](https://github.com/matkocrnoja/ArtConnect/issues/1), [#6 Izrada dokumentacije: Obrasci uporabe](https://github.com/matkocrnoja/ArtConnect/issues/6), [dokument 2](./2-Analiza%20zahtjeva.md), [dokument 3](./3-Obrasci-uporabe.md), [dokument 4](./4-Arhitektura-i-oblikovanje.md)|
| Ciklus 2 (14. tjedan) | Prijave na prilike, obavijesti, pregled prijava za organizatora, administracija | [TODO: tim upisuje raspodjelu] | [TODO: tim upisuje #issue]|


Plan nije dokaz da je planirani rad dovršen; to dokazuju kod i dokumentacija.

## A.3 Aktivnosti i doprinosi članova

Sate nisu zapisivali svi članovi pa je stupac „Prijavljeni sati” ostavljen da ga svaki član sam upiše. Rezultati su preuzeti iz povijesti zapisa promjena.

| Aktivnost ili rezultat | Član | Reprezentativni rezultat ili poveznica |
| :--- | :--- | :--- |
| Opseg projekta i analiza zahtjeva (dok. 1 i 2), kasnije sažimanje zahtjeva | MC, LK |[1-Projekt.md](./1-Projekt.md), [2-Analiza zahtjeva.md](./2-Analiza%20zahtjeva.md) |
| Obrasci uporabe (dok. 3), sažimanje i ispravak numeracije | LK | [3-Obrasci-uporabe.md](./3-Obrasci-uporabe.md) |
| Arhitektura i oblikovanje (dok. 4) | MC, LK | [4-Arhitektura-i-oblikovanje.md](./4-Arhitektura-i-oblikovanje.md) |
| Kostur poslužitelja (FastAPI), prijava i registracija preko OAuth-a | BJ, VC | [auth](../artconnect-api/app/routers/auth.py), [google](../artconnect-api/app/google.py) |
| Povezivanje klijenta i poslužitelja za prijavu, upload i kontrola pristupa datotekama | VC | [media](../artconnect-api/app/routers/media.py) |
| Dohvat portfolija, profila i djela | BJ | [portfolio](../artconnect-api/app/routers/portfolio.py) |
| ER dijagram, ograničenja datoteka i ispravak baze, uređivanje podataka umjetnika i organizatora | LS | [4-2-artconnect-data-ERD.puml](./puml/4-2-artconnect-data-ERD.puml) |
| Klijent: landing, registracija, prijava i odjava, usmjeravanje dev/prod | MC | [vite-frontend](../vite-frontend) |
| Klijent: komponente registracije, zaštićene rute, obavijesti (značka nepročitanih) | AD | [vite-frontend](../vite-frontend) |
| Klijent: zaglavlje s karticama, prilike (kartice, detalji, dodavanje i uređivanje) | MB | grana `prilike-funkcionalnost` |
| Spajanje klijenta s poslužiteljem za portfolio | MC | zapis promjene „Spajanje frontenda s backendom” (15. 11. 2026.) |
| S3 testna skripta i sustav korisničkih obavijesti | MC | zapis promjene od 10. 11. 2026. |


## A.4 Pregled promjena u repozitoriju

**Prikaz aktivnosti repozitorija:** [Contributors](https://github.com/matkocrnoja/ArtConnect/graphs/contributors); razdoblje od 12. 10. do 17. 11. 2026.

Prema broju zapisa promjena (uključujući spajanja grana) najviše ih je upisao MC (45, od toga dio pod dva korisnička imena), zatim AD (14), VC (13), LK (12), BJ (7), MB (6) i LS (6). Broj zapisa ne mjeri doprinos: dokumentaciju i oblikovanje, ispitivanje i rad u paru taj prikaz ne prikazuje, a MC je uz vlastiti rad često spajao grane drugih članova.

## A.5 Ključni inženjerski izazovi i rješenja

| Izazov | Poduzeta radnja | Ishod ili preostalo ograničenje |
| --- | --- | --- |
| Spajanje poslužitelja na S3 bucket za datoteke djela. | Na sastanku 10. 11. BJ, VC i LS postavili su `.env` datoteku i povezali se s bucketom; MC je napravio testnu skriptu, a VC upload i kontrolu pristupa datotekama. | Upload radi; S3 je izborna konfiguracija pa poslužitelj bez nje odgovara statusom 503. |
| Poslužitelj se nije pokretao na Windowsu. | MC je preskočio `uvloop` na Windowsu. | Lokalni razvoj radi na obje platforme. |
| Stranica Moj portfolio napravljena s lažnim (MSW) podacima nije odgovarala poslužitelju. | MC je 14. 11. poništio tu izmjenu, a 15. 11. klijent je spojen na poslužitelj. | Portfolio radi s pravim podacima iz API-ja. |
| Na Windowsu `mimetypes` ne vraća nastavak za `image/webp`, pa su ključevi u S3 bucketu ostajali bez nastavka. | U `s3storage.py` dodan je zaobilazni put koji vrstu `image/webp` rastavlja i uzima zadnji dio. | Datoteke tog formata dobivaju nastavak `webp` na svim platformama. |
| Zahtjevi su bili preopširni za pregled. | LK i MC spojili su srodne zahtjeve i skratili kriterije (1. 11., vidi odjeljak 2.5). | Zahtjevi u dokumentu 2 sažeti su na 28 funkcijskih. |
