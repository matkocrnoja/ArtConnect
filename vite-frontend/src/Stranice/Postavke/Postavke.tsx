import { Alert, Container, Title } from "@mantine/core";
import HeaderTabs from "../../Komponente/HeaderTabs/HeaderTabs";
import { useKorisnik } from "../../context/KorisnikContext";
import PostavkeUmjetnika from "./PostavkeUmjetnika";
import PostavkeOrganizatora from "./PostavkeOrganizatora";

// Stranica /postavke: prema ulozi prijavljenog korisnika prikazuje odgovarajući obrazac.
export default function Postavke() {
    const { uloga } = useKorisnik();

    return (
        <>
            <HeaderTabs />
            <Container size="sm" py="xl">
                <Title order={2} mb="lg">Postavke</Title>
                {uloga === "umjetnik" && <PostavkeUmjetnika />}
                {uloga === "organizator" && <PostavkeOrganizatora />}
                {uloga === "administrator" && (
                    <Alert color="gray">Postavke profila nisu dostupne za ovu ulogu.</Alert>
                )}
            </Container>
        </>
    );
}
