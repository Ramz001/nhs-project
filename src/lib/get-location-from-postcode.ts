import { geoapifyApiKey } from "@/constants/config";

type LatLng = {
  latitude: number;
  longitude: number;
};

type GeoapifyPostcodeListResponse = {
  features: {
    properties: {
      lat: number;
      lon: number;
      postcode: string;
    };
  }[];
};

export async function getLocationFromPostcode(
  postcode: string
): Promise<LatLng | null> {
  const url = `https://api.geoapify.com/v1/postcode/list?text=${postcode}&countrycode=uz&apiKey=${geoapifyApiKey}`;
  console.log('url',url);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as GeoapifyPostcodeListResponse;
  if (!data.features || data.features.length === 0) return null;
  const { lat, lon } = data.features[0].properties;
  return {
    latitude: lat,
    longitude: lon,
  };
}
