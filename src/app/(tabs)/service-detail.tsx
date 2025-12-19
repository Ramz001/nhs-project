import { addSelectedService } from "@/features/navigation/navigation.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ArrowLeft, Check, MapPin, Phone } from "@tamagui/lucide-icons";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Text, XStack, YStack } from "tamagui";

const { googleMapsApiKey } = Constants.expoConfig?.extra || {};

export default function ServiceDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const service = useAppSelector((state) => state.navigation.currentService);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  console.log(service);

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
          <Button mt="$4" onPress={() => router.back()}>
            <XStack items="center" gap="$2">
              <ArrowLeft />
              <Text fontWeight="600" fontSize="$5">
                Back
              </Text>
            </XStack>
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  const mapRegion = {
    latitude: service.latitude,
    longitude: service.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const handleGetDirections = () => {
    dispatch(addSelectedService(service));
    router.back();
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
                coordinate={{
                  latitude: service.latitude,
                  longitude: service.longitude,
                }}
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
                  destination={{
                    latitude: service.latitude,
                    longitude: service.longitude,
                  }}
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
                  {} km away
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
              {service.telephone && (
                <Card px="$4" py="$3" borderRadius="$4" elevate>
                  <XStack items="flex-start" gap="$3">
                    <Phone size={20} color="$blue10" style={{ marginTop: 2 }} />
                    <YStack flex={1} gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$color">
                        PHONE
                      </Text>
                      <Text fontSize="$5">{service.telephone}</Text>
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
                  Confirm Selection
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
