import type { OpportunityLocation } from "../api/types";

const mockLokacije: Record<string, OpportunityLocation> = {
  "unska 3 zagreb": {
    address: "Unska 3, Zagreb",
    lat: 45.8003,
    lng: 15.9708,
  },
  "ilica 1 zagreb": {
    address: "Ilica 1, Zagreb",
    lat: 45.8131,
    lng: 15.9775,
  },
};

export async function geocodeAddress(
  address: string,
): Promise<OpportunityLocation | null> {
  // Simulacija kašnjenja geokodiranja.
  await new Promise((resolve) => setTimeout(resolve, 400));

  const normaliziranaAdresa = address
    .trim()
    .toLocaleLowerCase("hr-HR")
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ");

  return mockLokacije[normaliziranaAdresa] ?? null;
}
