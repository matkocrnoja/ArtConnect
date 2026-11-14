import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Modal, TextInput, MultiSelect, Button, Stack, Group, Fieldset } from "@mantine/core";
import { useForm } from "@mantine/form";
import { registriraj } from "../../api/auth";
import { req } from "../../api/client";

interface Podrucje {
    sifra_podrucja: string;
    naziv_podrucja: string;
}

interface Props {
    opened: boolean;
    onClose: () => void;
}

function ModalRegistracijaUmjetnik({ opened, onClose }: Props) {
    const [maxBrPoveznica] = useState(5);
    const navigate = useNavigate();
    const [podrucja, setPodrucja] = useState<Podrucje[]>([]);
    const [greska, setGreska] = useState<string | null>(null);
    const [salje, setSalje] = useState(false);

    useEffect(() => {
        req('/podrucja')
            .then((odgovor) => {
                if (!odgovor.ok) throw new Error();
                return odgovor.json();
            })
            .then(setPodrucja)
            .catch(() => setGreska("Područja nije moguće učitati. Osvježi stranicu."));
    }, []);

    const form = useForm({
        initialValues: {
            ime: "",
            prezime: "",
            umjetnickoIme: "",
            podrucja: [] as string[],
            poveznice: [] as string[],
        },
        validate: {
            ime: (v) => (v.trim() ? null : "Ime je obavezno"),
            prezime: (v) => (v.trim() ? null : "Prezime je obavezno"),
            podrucja: (v) => (v.length > 0 ? null : "Odaberi barem jedno područje"),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setSalje(true);
        setGreska(null);
        const poruka = await registriraj({
            ime: values.ime,
            prezime: values.prezime,
            sifre_podrucja: values.podrucja,
            poveznice: values.poveznice.map((p) => p.trim()).filter(Boolean),
        });
        setSalje(false);

        if (poruka) setGreska(poruka);
        else navigate("/dashboard");
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Registracija umjetnika" 
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <Fieldset legend="Osobne informacije">
                        <TextInput label="Ime" {...form.getInputProps("ime")} required />
                        <TextInput label="Prezime" {...form.getInputProps("prezime")} required />
                    </Fieldset>
                    <Fieldset legend="Umjetničko djelovanje">
                        <MultiSelect
                            label="Područja umjetničkog djelovanja"
                            data={podrucja.map((p) => ({
                                value: p.sifra_podrucja,
                                label: p.naziv_podrucja,
                            }))}
                            searchable
                            required
                            {...form.getInputProps("podrucja")}
                        />

                        {form.values.poveznice.map((_, i) => (
                            <Group key={i} align="flex-end" wrap="nowrap">
                                <TextInput
                                    style={{ flex: 1 }}
                                    label={`Poveznica ${i + 1}`}
                                    placeholder="https://..."
                                    {...form.getInputProps(`poveznice.${i}`)}
                                />
                                <Button
                                    variant="light"
                                    color="red"
                                    onClick={() => form.removeListItem("poveznice", i)}
                                >
                                    ✕
                                </Button>
                            </Group>
                        ))}

                        <Button
                            mt="md"
                            variant="outline"
                            disabled={form.values.poveznice.length >= maxBrPoveznica}
                            onClick={() => form.insertListItem("poveznice", "")}
                        >
                            + Dodaj poveznicu
                        </Button>
                    </Fieldset>

                    {greska && <Alert color="red">{greska}</Alert>}
                    <Button type="submit" loading={salje}>Podnesi registraciju</Button>
                </Stack>
            </form>
        </Modal>
    );
}

export default ModalRegistracijaUmjetnik;
