import { ArrowLeft, Check, MapPin, Phone } from "@tamagui/lucide-icons";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Text, XStack, YStack } from "tamagui";

const { googleMapsApiKey } = Constants.expoConfig?.extra || {};

export default function ServiceDetailPage() {
  const router = useRouter();
  const service = router.state?.service;

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    if (!service) return;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          setLocationPermission(true);
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.warn("Location access failed:", error);
      }
    })();
  }, [service]);

  if (!service) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} items="center" justify="center">
          <Text fontSize="$6">Service not provided</Text>
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
      console.log("Opening directions:", url);
      // Linking.openURL(url) in production
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
              {/* Service Marker */}
              <Marker
                coordinate={service.coordinates}
                title={service.name}
                description={service.address}
                pinColor="red"
              />

              {/* User Marker */}
              {userLocation && (
                <Marker
                  coordinate={userLocation}
                  title="Your Location"
                  pinColor="blue"
                />
              )}

              {/* Directions Path */}
              {userLocation && googleMapsApiKey && (
                <MapViewDirections
                  origin={userLocation}
                  destination={service.coordinates}
                  apikey={googleMapsApiKey}
                  strokeWidth={4}
                  strokeColor="blue"
                  mode="DRIVING"
                />
              )}
            </MapView>
          </YStack>

          {/* Service Info */}
          <YStack px="$4" py="$4" gap="$4">
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

            {/* Details Cards */}
            <YStack gap="$3">
              {service.address && (
                <Card px="$4" py="$3" borderRadius="$4" elevate>
                  <XStack items="flex-start" gap="$3">
                    <MapPin
                      size={20}
                      color="$blue10"
                      style={{ marginTop: 2 }}
                    />
                    <YStack flex={1} gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$color">
                        ADDRESS
                      </Text>
                      <Text fontSize="$5">{service.address}</Text>
                    </YStack>
                  </XStack>
                </Card>
              )}
              {service.phone && (
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
              )}
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
                  Open in Maps
                </Text>
              </Button>
              <Button size="$5" bordered onPress={() => router.back()}>
                <XStack items="center" gap="$2">
                  <ArrowLeft />
                  <Text fontWeight="600" fontSize="$5">
                    Back
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
