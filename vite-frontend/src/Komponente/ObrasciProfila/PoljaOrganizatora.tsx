import type { ReactNode } from "react";
import { Fieldset, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import type { VrijednostiOrganizatora } from "./obrasciProfila";

interface Props {
    form: UseFormReturnType<VrijednostiOrganizatora>;
    dodatak?: ReactNode; // dodatno polje (npr. e-adresa u postavkama)
}

// Polja organizatora iz modala za registraciju; koriste ih i registracija i Postavke.
function PoljaOrganizatora({ form, dodatak }: Props) {
    return (
        <Fieldset legend="Osobne informacije">
            <TextInput label="Ime" {...form.getInputProps("ime")} required />
            <TextInput label="Prezime" {...form.getInputProps("prezime")} required />
            <TextInput
                label="Naziv organizacije"
                {...form.getInputProps("nazivOrganizacije")}
                required
            />
            {dodatak}
        </Fieldset>
    );
}

export default PoljaOrganizatora;
