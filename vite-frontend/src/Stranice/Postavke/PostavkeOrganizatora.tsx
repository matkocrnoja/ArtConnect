import { useEffect, useState } from "react";
import { Alert, Button, Group, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { dohvatiProfilOrganizatora, spremiProfilOrganizatora } from "../../api/profil";
import type { ProfilOrganizatora } from "../../api/types";
import { useAzurirajKorisnika } from "../../context/KorisnikContext";
import { showSuccess } from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";
import PoljaOrganizatora from "../../Komponente/ObrasciProfila/PoljaOrganizatora";
import {
    uPodatkeOrganizatora,
    validirajOrganizatora,
    type VrijednostiOrganizatora,
} from "../../Komponente/ObrasciProfila/obrasciProfila";

function uVrijednosti(profil: ProfilOrganizatora): VrijednostiOrganizatora {
    return {
        ime: profil.ime,
        prezime: profil.prezime,
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

    const form = useForm<VrijednostiOrganizatora>({
        initialValues: uVrijednosti(profil),
        validate: validirajOrganizatora,
    });

    const handleSubmit = async (values: VrijednostiOrganizatora) => {
        setSalje(true);
        setGreska(null);
        const rezultat = await spremiProfilOrganizatora(uPodatkeOrganizatora(values));
        setSalje(false);

        if ("greska" in rezultat) {
            setGreska(rezultat.greska);
            return;
        }
        const spremljeno = uVrijednosti(rezultat.profil);
        form.setInitialValues(spremljeno);
        form.setValues(spremljeno);
        azurirajKorisnika({ ime_prezime: `${rezultat.profil.ime} ${rezultat.profil.prezime}` });
        showSuccess("Promjene su spremljene.");
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <PoljaOrganizatora
                    form={form}
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
