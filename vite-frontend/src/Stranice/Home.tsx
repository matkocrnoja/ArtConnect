import { Center, Image } from '@mantine/core';

export default function Home() {
    return (
        <Center h="100dvh">
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <Image
                src="/images/test.jpg"
                w={200}
                maw="70vw"
                style={{ animation: 'spin 4s linear infinite' }}
            />
        </Center>
    )
}
