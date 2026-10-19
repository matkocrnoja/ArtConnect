import { useParams } from 'react-router-dom';

export default function ShowNumber() {
    const { id } = useParams();
    return (
        <>
            Broj: {id ?? 'nije zadan'}
        </>
    )
}
