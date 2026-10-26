import { Center, Flex, Image, Title } from "@mantine/core";

export default function Home() {
    return (
        <Center h="100dvh">
            <Flex direction="column" align="center" gap="lg">
                <div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <Image
                        src="/images/test.jpg"
                        w={200}
                        maw="70vw"
                        style={{ animation: "spin 4s linear infinite" }}
                    />
                </div>
                <Title mt="lg" ta="center">ArtConnect - Tim Piwko</Title>
            </Flex>
        </Center>
    );
}
