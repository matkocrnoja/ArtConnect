import { TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

// Postavke: jedno polje "Ime i prezime" (sprema se izravno u ime_prezime) i nepromjenjiva e-adresa.
function PoljaPostavkiOsobno<T extends { imePrezime: string }>({
    form,
    email,
}: {
    form: UseFormReturnType<T>;
    email: string;
}) {
    return (
        <>
            <TextInput
                label="Ime i prezime"
                description="Dozvoljena su samo slova i razmaci."
                {...form.getInputProps("imePrezime")}
                required
            />
            <TextInput
                label="E-adresa"
                value={email}
                description="E-adresa se preuzima iz Google računa i ne može se mijenjati."
                disabled
                readOnly
            />
        </>
    );
}

export default PoljaPostavkiOsobno;
