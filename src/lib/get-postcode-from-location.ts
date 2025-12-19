import { districtPostcodes } from "@/constants/postcode";
import { geoapifyApiKey } from "@/constants/config";

type GeoapifyPostcodeResponse = {
  features: {
    properties: {
      district?: string;
      county?: string;
      postcode?: string;
    };
  }[];
};

export async function getPostcodeFromLocation(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const url = `https://api.geoapify.com/v1/postcode/search?lat=${latitude}&lon=${longitude}&apiKey=${geoapifyApiKey}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as GeoapifyPostcodeResponse;

  if (!data.features || data.features.length === 0) return null;

  const props = data.features[0].properties;

  if (props.district || props.county) {
    const mappedPostcode =
      districtPostcodes[
        (props.district as keyof typeof districtPostcodes) ||
          (props.county as keyof typeof districtPostcodes)
      ];

    if (mappedPostcode) {
      return mappedPostcode;
    }
  }

  return props.postcode ?? null;
}
