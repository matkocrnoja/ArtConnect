import { Alert, Modal, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { Artwork } from "../../api/types";
import ArtworkPublicView from "./ArtworkPublicView";

interface Props {
    artwork: Artwork;
    onClose: () => void;
}

export default function ArtworkPreviewModal({ artwork, onClose }: Props) {
    const mobitel = useMediaQuery("(max-width: 48em)");

    return (
        <Modal opened onClose={onClose} title="Pregled djela" size="xl" fullScreen={mobitel}>
            <Stack>
                {!artwork.isPublic && (
                    <Alert color="yellow">Ovo djelo trenutno nije javno vidljivo</Alert>
                )}
                <ArtworkPublicView artwork={artwork} />
            </Stack>
        </Modal>
    );
}
