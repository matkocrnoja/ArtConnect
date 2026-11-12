import type { ReactNode } from "react";
import { Button, Fieldset, Group, MultiSelect, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import type { Podrucje } from "../../api/types";
import { MAKS_POVEZNICA, type VrijednostiUmjetnika } from "./obrasciProfila";

interface Props {
    form: UseFormReturnType<VrijednostiUmjetnika>;
    podrucja: Podrucje[];
    dodatak?: ReactNode; // dodatno polje u osobnim informacijama (npr. e-adresa u postavkama)
}

// Polja umjetnika iz modala za registraciju; koriste ih i registracija i Postavke.
function PoljaUmjetnika({ form, podrucja, dodatak }: Props) {
    return (
        <>
            <Fieldset legend="Osobne informacije">
                <TextInput label="Ime" {...form.getInputProps("ime")} required />
                <TextInput label="Prezime" {...form.getInputProps("prezime")} required />
                {dodatak}
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
                    <Group key={i} align="flex-start" wrap="nowrap" mt="sm">
                        <TextInput
                            style={{ flex: 1 }}
                            label={`Poveznica ${i + 1}`}
                            placeholder="https://..."
                            {...form.getInputProps(`poveznice.${i}`)}
                        />
                        <Button
                            mt={25}
                            variant="light"
                            color="red"
                            aria-label={`Ukloni poveznicu ${i + 1}`}
                            onClick={() => form.removeListItem("poveznice", i)}
                        >
                            ✕
                        </Button>
                    </Group>
                ))}

                <Button
                    mt="md"
                    variant="outline"
                    disabled={form.values.poveznice.length >= MAKS_POVEZNICA}
                    onClick={() => form.insertListItem("poveznice", "")}
                >
                    + Dodaj poveznicu
                </Button>
            </Fieldset>
        </>
    );
}

export default PoljaUmjetnika;
