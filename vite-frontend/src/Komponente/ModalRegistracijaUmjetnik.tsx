import { useState } from "react";
import { Modal, TextInput, MultiSelect, Button, Stack, Group, Fieldset } from "@mantine/core";
import { useForm } from "@mantine/form";

const PODRUCJA = [
    "Glazba",
    "Ples",
    "Kazalište",
    "Vizualna umjetnost",
    "Film",
    "Književnost",
    "Fotografija",
];

interface Props {
    opened: boolean;
    onClose: () => void;
}

function ModalRegistracijaUmjetnik({ opened, onClose }: Props) {
    const [maxBrPoveznica] = useState(5);

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
        const podaci = { ...values, poveznice: values.poveznice.filter((p) => p.trim()) };
        console.log("POST /register/umjetnik", podaci);
        // await fetch('/register/umjetnik', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(podaci),
        // });
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Registracija umjetnika" // withCloseButton={false}
            // closeOnClickOutside={false}
            // closeOnEscape={false}
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
                            data={PODRUCJA}
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

                    <Button type="submit">Podnesi registraciju</Button>
                </Stack>
            </form>
        </Modal>
    );
}

export default ModalRegistracijaUmjetnik;
