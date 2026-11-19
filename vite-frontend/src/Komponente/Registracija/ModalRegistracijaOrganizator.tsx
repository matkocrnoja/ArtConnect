import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Modal, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { registriraj } from "../../api/auth";
import PoljaOrganizatora from "../ObrasciProfila/PoljaOrganizatora";
import PoljaImenaIPrezimena from "../ObrasciProfila/PoljaImenaIPrezimena";
import {
    prazanOrganizator,
    uPodatkeOrganizatora,
    validirajOrganizatora,
    type VrijednostiOrganizatora,
} from "../ObrasciProfila/obrasciProfila";

interface Props {
    opened: boolean;
    onClose: () => void;
}

function ModalRegistracijaOrganizator({ opened, onClose }: Props) {
    const navigate = useNavigate();
    const [greska, setGreska] = useState<string | null>(null);
    const [salje, setSalje] = useState(false);

    const form = useForm<VrijednostiOrganizatora>({
        initialValues: prazanOrganizator,
        validate: validirajOrganizatora,
    });

    const handleSubmit = async (values: VrijednostiOrganizatora) => {
        setSalje(true);
        setGreska(null);
        const poruka = await registriraj(uPodatkeOrganizatora(values));
        setSalje(false);

        if (poruka) setGreska(poruka);
        else navigate("/dashboard");
    };

    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            onClose={onClose}
            title="Registracija organizatora"
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <PoljaOrganizatora
                        form={form}
                        osobnaPolja={<PoljaImenaIPrezimena form={form} />}
                    />
                    {greska && <Alert color="red">{greska}</Alert>}
                    <Button type="submit" loading={salje}>Podnesi registraciju</Button>
                </Stack>
            </form>
        </Modal>
    );
}

export default ModalRegistracijaOrganizator;
