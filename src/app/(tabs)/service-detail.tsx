import React, { useState, useEffect } from "react";
import { ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Card, Button } from "tamagui";
import { MapPin, Phone, Check, Clock, ArrowLeft } from "@tamagui/lucide-icons";
import { useLocalSearchParams, router } from "expo-router";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

// Mock data - will be replaced with actual API data
const mockServices: Record<
  string,
  {
    id: string;
    name: string;
    distance: number;
    address: string;
    phone: string;
    coordinates: { latitude: number; longitude: number };
    openingHours: string;
    rating: number;
    reviews: number;
  }
> = {
  "1": {
    id: "1",
    name: "Harley Street Medical Practice",
    distance: 0.4,
    address: "123 Harley Street, London",
    phone: "020 7935 4444",
    coordinates: { latitude: 51.5186, longitude: -0.1479 },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM",
    rating: 4.5,
    reviews: 234,
  },
  "2": {
    id: "2",
    name: "City Health Centre",
    distance: 0.8,
    address: "45 Oxford Street, London",
    phone: "020 7123 5678",
    coordinates: { latitude: 51.515, longitude: -0.144 },
    openingHours: "Mon-Sat: 9:00 AM - 8:00 PM",
    rating: 4.2,
    reviews: 156,
  },
  "3": {
    id: "3",
    name: "Westminster Medical Clinic",
    distance: 1.2,
    address: "78 Westminster Road, London",
    phone: "020 7456 7890",
    coordinates: { latitude: 51.4975, longitude: -0.1357 },
    openingHours: "Mon-Fri: 7:30 AM - 7:00 PM",
    rating: 4.7,
    reviews: 189,
  },
  "4": {
    id: "4",
    name: "Camden Healthcare",
    distance: 1.5,
    address: "92 Camden High Street, London",
    phone: "020 7789 0123",
    coordinates: { latitude: 51.539, longitude: -0.143 },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM",
    rating: 4.3,
    reviews: 98,
  },
  "5": {
    id: "5",
    name: "Chelsea Medical Centre",
    distance: 2.1,
    address: "156 Kings Road, London",
    phone: "020 7234 5678",
    coordinates: { latitude: 51.4874, longitude: -0.1687 },
    openingHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    rating: 4.6,
    reviews: 267,
  },
};

export default function ServiceDetailPage() {
  const params = useLocalSearchParams();
  const serviceId = params.id as string;
  const service = mockServices[serviceId];

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  if (!service) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} items="center" justify="center">
          <Text>Service not found</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  const mapRegion = {
    latitude: service.coordinates.latitude,
    longitude: service.coordinates.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const handleGetDirections = () => {
    // Open directions in native maps app
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${service.coordinates.latitude},${service.coordinates.longitude}`;
    const label = service.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      // In a real app, you'd use Linking.openURL(url)
      console.log("Opening directions:", url);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack flex={1}>
          {/* Map */}
          <YStack height={300} width="100%">
            <MapView
              style={{ width: "100%", height: "100%" }}
              provider={PROVIDER_GOOGLE}
              initialRegion={mapRegion}
              showsUserLocation={locationPermission}
              showsMyLocationButton={locationPermission}
            >
              {/* Service Location Marker */}
              <Marker
                coordinate={service.coordinates}
                title={service.name}
                description={service.address}
                pinColor="red"
              />

              {/* User Location Marker (if available) */}
              {userLocation && (
                <Marker
                  coordinate={userLocation}
                  title="Your Location"
                  pinColor="blue"
                />
              )}
            </MapView>
          </YStack>

          {/* Service Information */}
          <YStack px="$4" py="$4" gap="$4" flex={1}>
            {/* Service Name and Distance */}
            <YStack gap="$2">
              <Text fontSize="$8" fontWeight="700">
                {service.name}
              </Text>
              <XStack items="center" gap="$2">
                <MapPin size={18} color="$blue10" />
                <Text fontSize="$5" fontWeight="600" color="$blue10">
                  {service.distance} km away
                </Text>
              </XStack>
            </YStack>

            {/* Rating */}
            <XStack items="center" gap="$2">
              <Text fontSize="$6" fontWeight="600">
                ⭐ {service.rating}
              </Text>
              <Text fontSize="$4" color="$color">
                ({service.reviews} reviews)
              </Text>
            </XStack>

            {/* Details Cards */}
            <YStack gap="$3">
              {/* Address Card */}
              <Card px="$4" py="$3" borderRadius="$4" elevate>
                <XStack items="flex-start" gap="$3">
                  <MapPin size={20} color="$blue10" style={{ marginTop: 2 }} />
                  <YStack flex={1} gap="$1">
                    <Text fontSize="$3" fontWeight="600" color="$color">
                      ADDRESS
                    </Text>
                    <Text fontSize="$5">{service.address}</Text>
                  </YStack>
                </XStack>
              </Card>

              {/* Phone Card */}
              <Card px="$4" py="$3" borderRadius="$4" elevate>
                <XStack items="flex-start" gap="$3">
                  <Phone size={20} color="$blue10" style={{ marginTop: 2 }} />
                  <YStack flex={1} gap="$1">
                    <Text fontSize="$3" fontWeight="600" color="$color">
                      PHONE
                    </Text>
                    <Text fontSize="$5">{service.phone}</Text>
                  </YStack>
                </XStack>
              </Card>

              {/* Opening Hours Card */}
              <Card px="$4" py="$3" borderRadius="$4" elevate>
                <XStack items="flex-start" gap="$3">
                  <Clock size={20} color="$blue10" style={{ marginTop: 2 }} />
                  <YStack flex={1} gap="$1">
                    <Text fontSize="$3" fontWeight="600" color="$color">
                      OPENING HOURS
                    </Text>
                    <Text fontSize="$5">{service.openingHours}</Text>
                  </YStack>
                </XStack>
              </Card>
            </YStack>

            {/* Action Buttons */}
            <YStack gap="$3" mt="$2">
              <Button
                theme="blue"
                size="$5"
                icon={<Check size={20} color="white" />}
                onPress={handleGetDirections}
              >
                <Text color="white" fontWeight="600" fontSize="$5">
                  Confirm
                </Text>
              </Button>

              <Button size="$5" bordered onPress={() => router.back()}>
                <XStack items="center" gap="$2">
                  <ArrowLeft />
                  <Text fontWeight="600" fontSize="$5">
                    Look for Others
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
