import { useEffect, useState } from "react";
import { dohvatiPodrucja } from "../../api/profil";
import type { Podrucje } from "../../api/types";

// Učitava popis aktivnih područja. podrucja je null dok se učitava.
export function usePodrucja() {
    const [podrucja, setPodrucja] = useState<Podrucje[] | null>(null);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        dohvatiPodrucja()
            .then(setPodrucja)
            .catch(() => {
                setPodrucja([]);
                setGreska("Područja nije moguće učitati. Osvježi stranicu.");
            });
    }, []);

    return { podrucja, greska };
}
