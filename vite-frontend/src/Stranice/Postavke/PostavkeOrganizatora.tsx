import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { dohvatiProfilOrganizatora, spremiProfilOrganizatora } from "../../api/profil";
import type { ProfilOrganizatora } from "../../api/types";
import { useAzurirajKorisnika } from "../../context/KorisnikContext";
import { showSuccess } from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";
import PoljaOrganizatora from "../../Komponente/ObrasciProfila/PoljaOrganizatora";
import PoljaPostavkiOsobno from "../../Komponente/ObrasciProfila/PoljaPostavkiOsobno";
import {
    uPodatkePostavkiOrganizatora,
    validirajPostavkeOrganizatora,
    type VrijednostiPostavkiOrganizatora,
} from "../../Komponente/ObrasciProfila/obrasciProfila";

// ime_prezime ide u jedno polje, bez dijeljenja na ime i prezime.
function uVrijednosti(profil: ProfilOrganizatora): VrijednostiPostavkiOrganizatora {
    return {
        imePrezime: profil.ime_prezime,
        nazivOrganizacije: profil.naziv_organizacije,
    };
}

// Učitava profil, a obrazac crta tek kad stigne (s pravim početnim vrijednostima).
export default function PostavkeOrganizatora() {
    const [profil, setProfil] = useState<ProfilOrganizatora | null>(null);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        dohvatiProfilOrganizatora().then((rezultat) => {
            if ("profil" in rezultat) setProfil(rezultat.profil);
            else setGreska(rezultat.greska);
        });
    }, []);

    if (greska) return <Alert color="red">{greska}</Alert>;
    if (!profil) return <Loader />;
    return <ObrazacOrganizatora profil={profil} />;
}

function ObrazacOrganizatora({ profil }: { profil: ProfilOrganizatora }) {
    const azurirajKorisnika = useAzurirajKorisnika();
    const [greska, setGreska] = useState<string | null>(null);
    const [salje, setSalje] = useState(false);

    const form = useForm<VrijednostiPostavkiOrganizatora>({
        initialValues: uVrijednosti(profil),
        validate: validirajPostavkeOrganizatora,
    });

    const handleSubmit = async (values: VrijednostiPostavkiOrganizatora) => {
        setSalje(true);
        setGreska(null);
        const rezultat = await spremiProfilOrganizatora(uPodatkePostavkiOrganizatora(values));
        setSalje(false);

        if ("greska" in rezultat) {
            setGreska(rezultat.greska);
            return;
        }
        const spremljeno = uVrijednosti(rezultat.profil);
        form.setInitialValues(spremljeno);
        form.setValues(spremljeno);
        azurirajKorisnika({ ime_prezime: rezultat.profil.ime_prezime });
        showSuccess("Promjene su spremljene.");
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <PoljaOrganizatora
                    form={form}
                    osobnaPolja={<PoljaPostavkiOsobno form={form} email={profil.email} />}
                />
                {greska && <Alert color="red">{greska}</Alert>}
                <Group justify="flex-end">
                    <Button type="submit" loading={salje}>Spremi</Button>
                </Group>
            </Stack>
        </form>
    );
}
