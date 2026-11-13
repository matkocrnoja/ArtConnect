import type { ReactNode } from "react";
import { Button, Fieldset, Group, MultiSelect, TextInput } from "@mantine/core";
import type { FormArrayElement, UseFormReturnType } from "@mantine/form";
import type { Podrucje } from "../../api/types";
import { MAKS_POVEZNICA } from "./obrasciProfila";

// Generički tip: registracija i postavke imaju različita osobna polja, ali obje imaju
// podrucja i poveznice, pa ova komponenta radi s bilo kojim obrascem koji ih sadrži.
interface Props<T extends { podrucja: string[]; poveznice: string[] }> {
    form: UseFormReturnType<T>;
    podrucja: Podrucje[];
    osobnaPolja: ReactNode; // registracija: Ime + Prezime; postavke: Ime i prezime + e-adresa
}

// Polja umjetnika iz modala za registraciju; koriste ih i registracija i Postavke.
function PoljaUmjetnika<T extends { podrucja: string[]; poveznice: string[] }>({
    form,
    podrucja,
    osobnaPolja,
}: Props<T>) {
    return (
        <>
            <Fieldset legend="Osobne informacije">{osobnaPolja}</Fieldset>
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
                    // Za generički T TypeScript ne može sam zaključiti da je element liste string,
                    // pa mu se to kaže tipom koji izvozi Mantine.
                    onClick={() =>
                        form.insertListItem("poveznice", "" as FormArrayElement<T, "poveznice">)
                    }
                >
                    + Dodaj poveznicu
                </Button>
            </Fieldset>
        </>
    );
}

export default PoljaUmjetnika;
