import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Modal, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { registriraj } from "../../api/auth";
import PoljaUmjetnika from "../ObrasciProfila/PoljaUmjetnika";
import PoljaImenaIPrezimena from "../ObrasciProfila/PoljaImenaIPrezimena";
import { usePodrucja } from "../ObrasciProfila/usePodrucja";
import {
    prazanUmjetnik,
    uPodatkeUmjetnika,
    validirajUmjetnika,
    type VrijednostiUmjetnika,
} from "../ObrasciProfila/obrasciProfila";

interface Props {
    opened: boolean;
    onClose: () => void;
}

function ModalRegistracijaUmjetnik({ opened, onClose }: Props) {
    const navigate = useNavigate();
    const { podrucja, greska: greskaPodrucja } = usePodrucja();
    const [greska, setGreska] = useState<string | null>(null);
    const [salje, setSalje] = useState(false);

    const form = useForm<VrijednostiUmjetnika>({
        initialValues: prazanUmjetnik,
        validate: validirajUmjetnika,
    });

    const handleSubmit = async (values: VrijednostiUmjetnika) => {
        setSalje(true);
        setGreska(null);
        const poruka = await registriraj(uPodatkeUmjetnika(values));
        setSalje(false);

        if (poruka) setGreska(poruka);
        else navigate("/dashboard");
    };

    const prikazanaGreska = greska ?? greskaPodrucja;

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
                    <PoljaUmjetnika
                        form={form}
                        podrucja={podrucja ?? []}
                        osobnaPolja={<PoljaImenaIPrezimena form={form} />}
                    />

                    {prikazanaGreska && <Alert color="red">{prikazanaGreska}</Alert>}
                    <Button type="submit" loading={salje}>Podnesi registraciju</Button>
                </Stack>
            </form>
        </Modal>
    );
}

export default ModalRegistracijaUmjetnik;
