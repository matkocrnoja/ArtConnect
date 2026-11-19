import { useState } from "react";
import { Button, Card, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { IconPencil, IconCheck, IconX } from "@tabler/icons-react";
import { porukaGreske, updateProfile } from "../../api/portfolio";
import { showError, showSuccess } from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";

const MAX_ZNAKOVA = 2000;

type Profil = { biography: string; artDescription: string };

interface Props {
    profil: Profil;
    onSaved: (profil: Profil) => void;
}

// Prikazuje jedan tekst profila (samo za čitanje), ako je prazan, prikaže sivi placeholder
function Tekst({ naslov, tekst, placeholder }: { naslov: string; tekst: string; placeholder: string }) {
    return (
        <Stack gap={6}>
            <Title order={5} c="dimmed" tt="uppercase" size="xs" fw={700}>
                {naslov}
            </Title>
            {tekst ? (
                <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }} size="sm">
                    {tekst}
                </Text>
            ) : (
                <Text c="dimmed" fs="italic" size="sm">
                    {placeholder}
                </Text>
            )}
        </Stack>
    );
}

// Polje za uređivanje jednog teksta, s brojačem znakova ispod (npr. "120 / 2000")
function Polje({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <Textarea
            label={label}
            placeholder={placeholder}
            autosize
            minRows={3}
            maxRows={8}
            maxLength={MAX_ZNAKOVA}
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            description={<Text size="xs" ta="right">{value.length} / {MAX_ZNAKOVA}</Text>}
            inputWrapperOrder={["label", "input", "description", "error"]}
            styles={{
                input: {
                    backgroundColor: "var(--mantine-color-body)",
                }
            }}
        />
    );
}

export default function ProfilTekstovi({ profil, onSaved }: Props) {
    const [uredujem, setUredujem] = useState(false);
    const [spremam, setSpremam] = useState(false);
    const [biography, setBiography] = useState(profil.biography);
    const [artDescription, setArtDescription] = useState(profil.artDescription);

    const uredi = () => {
        setBiography(profil.biography);
        setArtDescription(profil.artDescription);
        setUredujem(true);
    };

    const spremi = async () => {
        setSpremam(true);
        try {
            const spremljeniProfil = await updateProfile({ biography, artDescription });
            onSaved(spremljeniProfil);
            setUredujem(false);
            showSuccess("Biografija i opis rada su spremljeni.");
        } catch (greska) {
            showError(porukaGreske(greska));
        } finally {
            setSpremam(false);
        }
    };

    return (
        <Card withBorder padding="xl" radius="md">
            <Stack gap="lg">
                {uredujem ? (
                    <>
                        <Stack gap="md">
                            <Polje 
                                label="Biografija" 
                                value={biography} 
                                onChange={setBiography} 
                                placeholder="Napišite nešto o sebi i svojoj umjetničkoj karijeri..."
                            />
                            <Polje 
                                label="Opis umjetničkog rada" 
                                value={artDescription} 
                                onChange={setArtDescription} 
                                placeholder="Opišite tehniku, tematiku ili viziju svog rada..."
                            />
                        </Stack>
                        <Group justify="flex-end" mt="xs">
                            <Button 
                                variant="default" 
                                onClick={() => setUredujem(false)} 
                                disabled={spremam}
                                leftSection={<IconX size={16} />}
                            >
                                Odustani
                            </Button>
                            <Button 
                                onClick={spremi} 
                                loading={spremam}
                                leftSection={<IconCheck size={16} />}
                            >
                                Spremi
                            </Button>
                        </Group>
                    </>
                ) : (
                    <>
                        <Stack gap="xl">
                            <Tekst naslov="Biografija" tekst={profil.biography} placeholder="Biografija još nije unesena" />
                            <Tekst naslov="Opis umjetničkog rada" tekst={profil.artDescription} placeholder="Opis umjetničkog rada još nije unesen" />
                        </Stack>
                        <Group justify="flex-end" mt="xs">
                            <Button variant="light" leftSection={<IconPencil size={16} />} onClick={uredi}>
                                Uredi
                            </Button>
                        </Group>
                    </>
                )}
            </Stack>
        </Card>
    );
}