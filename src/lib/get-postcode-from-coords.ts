import { postcodes } from "@/constants/postcode";

export async function getPostcodeFromCoords(
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") return null;

  for (const result of data.results) {
    for (const comp of result.address_components) {
      // Check neighborhood mapping
      if (comp.types.includes("neighborhood")) {
        const mappedPostcode =
          postcodes[comp.long_name as keyof typeof postcodes];
        if (mappedPostcode) return String(mappedPostcode);
      }
    }
  }

  return null;
}
