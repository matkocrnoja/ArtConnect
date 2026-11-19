import { Button, Flex, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function NijeDovrseno() {
    const navigate = useNavigate();

    return (
        <Flex justify="center" align="center" h="100vh" w="100%">
            <Flex direction="column" justify="center" align="center">
                <Title mb="md">
                    Ova funkcionalnost još nije implementirana.
                </Title>
                <Button variant="default" onClick={() => navigate(-1)}>
                    Vrati me nazad
                </Button>
            </Flex>
        </Flex>
    );
}
