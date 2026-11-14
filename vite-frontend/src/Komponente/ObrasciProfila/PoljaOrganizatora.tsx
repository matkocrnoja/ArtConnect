import type { ReactNode } from "react";
import { Fieldset, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

// Generički tip: radi s obrascem registracije i obrascem postavki (oba imaju nazivOrganizacije).
interface Props<T extends { nazivOrganizacije: string }> {
    form: UseFormReturnType<T>;
    osobnaPolja: ReactNode; // registracija: Ime + Prezime; postavke: Ime i prezime + e-adresa
}

// Polja organizatora iz modala za registraciju; koriste ih i registracija i Postavke.
function PoljaOrganizatora<T extends { nazivOrganizacije: string }>({ form, osobnaPolja }: Props<T>) {
    return (
        <Fieldset legend="Osobne informacije">
            {osobnaPolja}
            <TextInput
                label="Naziv organizacije"
                {...form.getInputProps("nazivOrganizacije")}
                required
            />
        </Fieldset>
    );
}

export default PoljaOrganizatora;
