
import { Card, Text } from "@mantine/core";
import type { OpportunityLocation } from "../../api/types";

interface LocationMapProps {
  location: OpportunityLocation;
}

export default function LocationMap({ location }: LocationMapProps) {
  const delta = 0.005;

  const bbox = [
    location.lng - delta,
    location.lat - delta,
    location.lng + delta,
    location.lat + delta,
  ].join(",");

  const mapUrl =
    `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}` +
    `&layer=mapnik&marker=${location.lat}%2C${location.lng}`;

  return (
    <Card withBorder p="sm">
      <Text fw={500} mb="sm">
        {location.address}
      </Text>

      <iframe
        title={`Karta lokacije: ${location.address}`}
        src={mapUrl}
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: 8 }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </Card>
  );
}
