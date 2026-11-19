import { useEffect, useState } from "react";
import { Alert, Button, Container, Skeleton, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import HeaderTabs from "../Komponente/HeaderTabs/HeaderTabs";
import ArtworkFormModal from "../Komponente/Portfolio/ArtworkFormModal";
import ArtworkGrid, { ArtworkGridSkeleton } from "../Komponente/Portfolio/ArtworkGrid";
import ArtworkPreviewModal from "../Komponente/Portfolio/ArtworkPreviewModal";
import ProfilTekstovi from "../Komponente/Portfolio/ProfilTekstovi";
import { ApiError, deleteArtwork, getArtwork, getPortfolio, porukaGreske } from "../api/portfolio";
import type { Artwork, Portfolio } from "../api/types";
import { showError, showSuccess, showWarning } from "../KorisnickeNotifikacije/KorisnickeNotifikacije";

type Formular = { artwork?: Artwork };

export default function MojPortfolio() {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [greskaUcitavanja, setGreskaUcitavanja] = useState(false);
    const [pokusaj, setPokusaj] = useState(0);
    const [formular, setFormular] = useState<Formular | null>(null);
    const [preview, setPreview] = useState<Artwork | null>(null);
    const [zauzetoId, setZauzetoId] = useState<string | null>(null);

    useEffect(() => {
        let otkazano = false;
        getPortfolio()
            .then((p) => { if (!otkazano) setPortfolio(p); })
            .catch(() => { if (!otkazano) setGreskaUcitavanja(true); });
        return () => { otkazano = true; };
    }, [pokusaj]);

    const ponovi = () => {
        setGreskaUcitavanja(false);
        setPokusaj((n) => n + 1);
    };

    // Uredi i Preview prikazuju svježe detalje djela s poslužitelja (GET /me/artworks/{id}).
    const dohvatiDetalje = async (artwork: Artwork): Promise<Artwork | null> => {
        setZauzetoId(artwork.id);
        try {
            return await getArtwork(artwork.id);
        } catch (greska) {
            showError(porukaGreske(greska));
            return null;
        } finally {
            setZauzetoId(null);
        }
    };

    const uredi = async (artwork: Artwork) => {
        const detalji = await dohvatiDetalje(artwork);
        if (detalji) setFormular({ artwork: detalji });
    };

    const pregledaj = async (artwork: Artwork) => {
        const detalji = await dohvatiDetalje(artwork);
        if (detalji) setPreview(detalji);
    };

    const obrisi = (artwork: Artwork) => {
        modals.openConfirmModal({
            title: "Brisanje djela",
            children: (
                <Text size="sm">
                    Želite li obrisati djelo <b>{artwork.title}</b>? Ova radnja se ne može poništiti.
                </Text>
            ),
            labels: { confirm: "Obriši", cancel: "Odustani" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                try {
                    await deleteArtwork(artwork.id);
                    // Makni obrisano djelo iz prikazane liste.
                    setPortfolio((prethodni) => {
                        if (prethodni === null) {
                            return prethodni;
                        }
                        const preostalaDjela = prethodni.artworks.filter((a) => a.id !== artwork.id);
                        return {
                            biography: prethodni.biography,
                            artDescription: prethodni.artDescription,
                            artworks: preostalaDjela,
                        };
                    });
                    showSuccess("Djelo je obrisano.");
                } catch (greska) {
                    // 409: djelo je dio aktivne prijave pa se ne može obrisati
                    if (greska instanceof ApiError && greska.status === 409) {
                        showWarning(porukaGreske(greska));
                    } else {
                        showError(porukaGreske(greska));
                    }
                }
            },
        });
    };

    // Poziva se nakon spremanja u ArtworkFormModal, i za novo i za uređeno djelo.
    const djeloSpremljeno = (spremljeno: Artwork) => {
        setPortfolio((prethodni) => {
            if (prethodni === null) {
                return prethodni;
            }

            const vecPostoji = prethodni.artworks.some((a) => a.id === spremljeno.id);

            let novaDjela: Artwork[];
            if (vecPostoji) {
                // Uređeno djelo: zamijeni staru verziju novom, ostala djela ostaju ista.
                novaDjela = prethodni.artworks.map((a) => {
                    if (a.id === spremljeno.id) {
                        return spremljeno;
                    }
                    return a;
                });
            } else {
                // Novo djelo: dodaj ga na početak liste.
                novaDjela = [spremljeno, ...prethodni.artworks];
            }

            return {
                biography: prethodni.biography,
                artDescription: prethodni.artDescription,
                artworks: novaDjela,
            };
        });
    };

    return (
        <>
            <HeaderTabs />
            <Container size="md">
                <Stack gap="xl">
                    {greskaUcitavanja && (
                        <Alert color="red" title="Portfolio se nije učitao">
                            <Stack gap="xs" align="flex-start">
                                <Text size="sm">Pokušaj ponovno za nekoliko trenutaka.</Text>
                                <Button size="xs" variant="light" color="red" onClick={ponovi}>Pokušaj ponovno</Button>
                            </Stack>
                        </Alert>
                    )}

                    {!portfolio && !greskaUcitavanja && (
                        <>
                            <Skeleton h={220} />
                            <ArtworkGridSkeleton />
                        </>
                    )}

                    {portfolio && (
                        <>
                            <ProfilTekstovi
                                profil={{ biography: portfolio.biography, artDescription: portfolio.artDescription }}
                                onSaved={(profil) => {
                                    // Spremi nove tekstove profila, a djela ostaju kakva jesu.
                                    setPortfolio((prethodni) => {
                                        if (prethodni === null) {
                                            return prethodni;
                                        }
                                        return {
                                            biography: profil.biography,
                                            artDescription: profil.artDescription,
                                            artworks: prethodni.artworks,
                                        };
                                    });
                                }}
                            />
                            <ArtworkGrid
                                artworks={portfolio.artworks}
                                zauzetoId={zauzetoId}
                                onAdd={() => setFormular({})}
                                onEdit={uredi}
                                onDelete={obrisi}
                                onPreview={pregledaj}
                            />
                        </>
                    )}
                </Stack>
            </Container>

            {formular && (
                <ArtworkFormModal
                    artwork={formular.artwork}
                    onClose={() => setFormular(null)}
                    onSaved={djeloSpremljeno}
                />
            )}
            {preview && <ArtworkPreviewModal artwork={preview} onClose={() => setPreview(null)} />}
        </>
    );
}
