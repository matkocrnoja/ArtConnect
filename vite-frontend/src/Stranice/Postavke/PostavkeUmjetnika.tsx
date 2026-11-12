import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { dohvatiProfilUmjetnika, spremiProfilUmjetnika } from "../../api/profil";
import type { Podrucje, ProfilUmjetnika } from "../../api/types";
import { useAzurirajKorisnika } from "../../context/KorisnikContext";
import { showSuccess } from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";
import PoljaUmjetnika from "../../Komponente/ObrasciProfila/PoljaUmjetnika";
import { usePodrucja } from "../../Komponente/ObrasciProfila/usePodrucja";
import {
    uPodatkeUmjetnika,
    validirajUmjetnika,
    type VrijednostiUmjetnika,
} from "../../Komponente/ObrasciProfila/obrasciProfila";

// Profil s backenda -> vrijednosti obrasca. Zadržavaju se samo područja koja su
// i dalje aktivna, jer se odabire isključivo iz popisa aktivnih područja.
function uVrijednosti(profil: ProfilUmjetnika, aktivna: Podrucje[]): VrijednostiUmjetnika {
    const aktivneSifre = new Set(aktivna.map((p) => p.sifra_podrucja));
    return {
        ime: profil.ime,
        prezime: profil.prezime,
        podrucja: profil.podrucja
            .map((p) => p.sifra_podrucja)
            .filter((sifra) => aktivneSifre.has(sifra)),
        poveznice: profil.poveznice,
    };
}

// Učitava profil i popis područja, a obrazac crta tek kad je oboje stiglo,
// pa obrazac odmah dobiva prave početne vrijednosti.
export default function PostavkeUmjetnika() {
    const { podrucja, greska: greskaPodrucja } = usePodrucja();
    const [profil, setProfil] = useState<ProfilUmjetnika | null>(null);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        dohvatiProfilUmjetnika().then((rezultat) => {
            if ("profil" in rezultat) setProfil(rezultat.profil);
            else setGreska(rezultat.greska);
        });
    }, []);

    if (greska) return <Alert color="red">{greska}</Alert>;
    if (!profil || !podrucja) return <Loader />;

    return (
        <Stack>
            {greskaPodrucja && <Alert color="red">{greskaPodrucja}</Alert>}
            <ObrazacUmjetnika profil={profil} podrucja={podrucja} />
        </Stack>
    );
}

function ObrazacUmjetnika({ profil, podrucja }: { profil: ProfilUmjetnika; podrucja: Podrucje[] }) {
    const azurirajKorisnika = useAzurirajKorisnika();
    const [greska, setGreska] = useState<string | null>(null);
    const [salje, setSalje] = useState(false);

    const form = useForm<VrijednostiUmjetnika>({
        initialValues: uVrijednosti(profil, podrucja),
        validate: validirajUmjetnika,
    });

    const handleSubmit = async (values: VrijednostiUmjetnika) => {
        setSalje(true);
        setGreska(null);
        const rezultat = await spremiProfilUmjetnika(uPodatkeUmjetnika(values));
        setSalje(false);

        if ("greska" in rezultat) {
            setGreska(rezultat.greska);
            return;
        }
        // Obrazac preuzima stanje koje je backend spremio (npr. bez praznih poveznica).
        const spremljeno = uVrijednosti(rezultat.profil, podrucja);
        form.setInitialValues(spremljeno);
        form.setValues(spremljeno);
        azurirajKorisnika({ ime_prezime: `${rezultat.profil.ime} ${rezultat.profil.prezime}` });
        showSuccess("Promjene su spremljene.");
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <PoljaUmjetnika
                    form={form}
                    podrucja={podrucja}
                    dodatak={
                        <TextInput
                            label="E-adresa"
                            value={profil.email}
                            description="E-adresa se preuzima iz Google računa i ne može se mijenjati."
                            disabled
                            readOnly
                        />
                    }
                />
                {greska && <Alert color="red">{greska}</Alert>}
                <Group justify="flex-end">
                    <Button type="submit" loading={salje}>Spremi</Button>
                </Group>
            </Stack>
        </form>
    );
}
