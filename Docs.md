# National Health Services – Mini Project Documentation

## Application Overview

The **National Health Services** mobile application is designed to support nurses in quickly locating and confirming nearby healthcare services for patients. The core purpose of the system is to determine the most appropriate service based on a patient’s **postcode or current geographic location**, calculate the **distance to available services**, and record confirmed selections for future reference.

The application is implemented as a multi-screen mobile system using **Expo (React Native)** and follows a clear, linear search and confirmation workflow.

Screen-capture images and a full video screen-capture demonstrating the application in operation have been produced and are included with this submission.

---

## Application Flow (Search Process)

The main search flow of the application is as follows:

1. **Postcode or Location Input**

   * Nurses either manually enter a patient’s postcode or use the device’s GPS to retrieve the current location.
2. **Service Category Selection**

   * Nurses select a category of healthcare services (e.g., GP, Dentist, Optician, School/Nursery).
3. **Service List Display**

   * A list of services within the selected category is displayed and **sorted by distance** from the patient’s location.
4. **Service Confirmation**

   * Nurses select and confirm a service after viewing its details and distance.
5. **History Review**

   * Previously confirmed services are available in a history screen, displayed as cards with embedded maps.

This workflow ensures efficiency and consistency when nurses are registering or reviewing patient service visits.

---

## Location and Postcode Resolution

### Converting Postcode to Geographic Coordinates

When a postcode is entered manually, the application converts it into latitude and longitude using the **Geoapify Postcode API**. This allows the system to perform distance calculations and map rendering.

#### Code Snippet: Postcode → Latitude/Longitude

```ts
export async function getLocationFromPostcode(
  postcode: string
): Promise<LatLng | null> {
  const url = `https://api.geoapify.com/v1/postcode/list?text=${postcode}&countrycode=uz&apiKey=${geoapifyApiKey}`;
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
```

This function ensures that only valid postcodes are processed and returns precise geographic coordinates for further calculations.

---

### Converting Location to Postcode

When the nurse chooses to use the current device location, the application performs **reverse geocoding** to identify the corresponding postcode. This is also handled via the Geoapify API.

#### Code Snippet: Latitude/Longitude → Postcode

```ts
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
  return props.postcode ?? null;
}
```

This functionality improves usability by reducing manual data entry and minimizing human error.

---

## Distance Calculation Between Patient and Service

A central technical requirement of the project is calculating the distance between the patient’s location and each available healthcare service. This is implemented using the **Haversine formula**, which calculates the shortest distance between two points on the Earth’s surface.

### Distance Algorithm Implementation

```ts
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
```

This function is used to:

* Sort services by proximity
* Display the distance to the nurse during service selection
* Provide visual feedback on the service detail map

Distances are displayed in **kilometres** for clarity and consistency.

---

## History Screen and Data Persistence

The application includes a **History screen** that displays previously confirmed services. Each record is shown as a card containing:

* Service name and address
* Date of confirmation
* Postcode used
* Embedded map with service location marker

All confirmed selections are stored in a backend database and retrieved dynamically, ensuring accurate historical records.

---

## Spike Solution and Testing Evidence

A working spike solution was successfully developed to validate:

* Location permissions
* Postcode and location conversion
* Distance calculation accuracy
* Map rendering and service confirmation flow

A full **video screen-capture** and supporting **screen-capture images** demonstrating the spike solution and the final application have been produced and included in this submission.

---

## Future Enhancements

Potential future enhancements for the National Health Services application include:

* Filtering services by availability and opening hours
* Offline access to recent searches
* Nurse authentication and role-based access
* Analytics on service usage patterns
* More coverage to more regions and countries

---

## Conclusion

The National Health Services mini-project successfully demonstrates the use of mobile development techniques, geolocation services, and distance-based algorithms to solve a real-world healthcare coordination problem. The application meets all core requirements, and the included screen-capture and video evidence confirm that the system functions correctly and reliably.


