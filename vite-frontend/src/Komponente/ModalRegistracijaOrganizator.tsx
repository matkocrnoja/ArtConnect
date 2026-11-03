import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Modal, TextInput, Button, Stack, Fieldset } from "@mantine/core";
import { useForm } from "@mantine/form";
import { registriraj } from "../api";

interface Props {
    opened: boolean;
    onClose: () => void;
}

function ModalRegistracijaOrganizator({ opened, onClose }: Props) {
    const navigate = useNavigate();
    const [greska, setGreska] = useState<string | null>(null);
    const [salje, setSalje] = useState(false);

    const form = useForm({
        initialValues: {
            ime: "",
            prezime: "",
            nazivOrganizacije: "",
        },
        validate: {
            ime: (v) => (v.trim() ? null : "Ime je obavezno"),
            prezime: (v) => (v.trim() ? null : "Prezime je obavezno"),
            nazivOrganizacije: (v) => (v.trim() ? null : "Naziv organizacije je obavezan"),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setSalje(true);
        setGreska(null);
        const poruka = await registriraj({
            ime: values.ime,
            prezime: values.prezime,
            naziv_organizacije: values.nazivOrganizacije,
        });
        setSalje(false);

        if (poruka) setGreska(poruka);
        else navigate("/dashboard");
    };

    return (
        <Modal
            opened={opened}
            // withCloseButton={false}
            // closeOnClickOutside={false}
            // closeOnEscape={false}
            onClose={onClose}
            title="Registracija organizatora"
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <Fieldset legend="Osobne informacije">
                        <TextInput label="Ime" {...form.getInputProps("ime")} required />
                        <TextInput label="Prezime" {...form.getInputProps("prezime")} required />
                        <TextInput
                            label="Naziv organizacije"
                            {...form.getInputProps("nazivOrganizacije")}
                            required
                        />
                    </Fieldset>
                    {greska && <Alert color="red">{greska}</Alert>}
                    <Button type="submit" loading={salje}>Podnesi registraciju</Button>
                </Stack>
            </form>
        </Modal>
    );
}

export default ModalRegistracijaOrganizator;
