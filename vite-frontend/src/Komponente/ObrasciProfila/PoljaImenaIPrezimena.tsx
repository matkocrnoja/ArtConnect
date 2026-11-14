import { TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

// Registracija: zasebna polja Ime i Prezime (backend ih spaja u ime_prezime).
function PoljaImenaIPrezimena<T extends { ime: string; prezime: string }>({
    form,
}: {
    form: UseFormReturnType<T>;
}) {
    return (
        <>
            <TextInput label="Ime" {...form.getInputProps("ime")} required />
            <TextInput label="Prezime" {...form.getInputProps("prezime")} required />
        </>
    );
}

export default PoljaImenaIPrezimena;
