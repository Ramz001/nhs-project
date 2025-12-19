import { googleMapsApiKey } from "@/constants/config";
import { setCurrentService } from "@/features/navigation/navigation.slice";
import { getDistanceFromLatLonInKm } from "@/lib/get-distance-from-lat-lon";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Check, MapPin, Phone } from "@tamagui/lucide-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Text, XStack, YStack } from "tamagui";
import { z } from "zod";

const ConfirmServiceSchema = z.object({
  serviceId: z.string({ error: "Service ID must be a positive number" }),
  postcode: z
    .number({ error: "Please provide a valid postcode" })
    .min(100000, { error: "Please provide a valid postcode" })
    .max(999999, { error: "Please provide a valid postcode" }),
});

export default function ServiceDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { location, currentService, postcode } = useAppSelector(
    (state) => state.navigation
  );
  const distance =
    location && currentService?.latitude && currentService?.longitude
      ? getDistanceFromLatLonInKm(
          location.latitude,
          location.longitude,
          currentService.latitude,
          currentService.longitude
        ).toFixed(1)
      : null;

  const confirmServiceMutation = useMutation({
    mutationFn: async ({
      serviceId,
      postcode,
    }: {
      serviceId: string;
      postcode: number;
    }) => {
      const validated = ConfirmServiceSchema.safeParse({ serviceId, postcode });

      if (!validated.success) {
        const firstError = validated.error.issues[0];
        throw new Error(firstError.message);
      }

      const { data, error } = await supabase.from("patient_record").insert({
        service_id: validated.data.serviceId,
        postcode: validated.data.postcode,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      dispatch(setCurrentService(null));
      Alert.alert("Success", "Service confirmed successfully!");
      router.push("/");
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to confirm service"
      );
    },
  });

  if (!currentService) {
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
    latitude: currentService.latitude,
    longitude: currentService.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };
  const handleConfirmService = () => {
    if (currentService?.id && postcode) {
      confirmServiceMutation.mutate({
        serviceId: currentService.id,
        postcode: Number(postcode),
      });
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
              showsUserLocation={!!location}
              showsMyLocationButton={!!location}
            >
              {/* Service Marker */}
              <Marker
                coordinate={{
                  latitude: currentService.latitude,
                  longitude: currentService.longitude,
                }}
                title={currentService.name}
                description={currentService.address}
                pinColor="red"
              />

              {/* User Marker */}
              {location && (
                <Marker
                  coordinate={location}
                  title="Your Location"
                  pinColor="blue"
                />
              )}

              {/* Directions Path */}
              {location?.latitude && googleMapsApiKey && (
                <MapViewDirections
                  origin={location}
                  destination={{
                    latitude: currentService.latitude,
                    longitude: currentService.longitude,
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
                {currentService.name}
              </Text>
              <XStack items="center" gap="$2">
                <MapPin size={18} color="$blue10" />
                <Text fontSize="$5" fontWeight="600" color="$blue10">
                  {distance || 0} km away
                </Text>
              </XStack>
            </YStack>

            {/* Details Cards */}
            <YStack gap="$3">
              {currentService.address && (
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
                      <Text fontSize="$5">{currentService.address}</Text>
                    </YStack>
                  </XStack>
                </Card>
              )}
              {currentService.telephone && (
                <Card px="$4" py="$3" borderRadius="$4" elevate>
                  <XStack items="flex-start" gap="$3">
                    <Phone size={20} color="$blue10" style={{ marginTop: 2 }} />
                    <YStack flex={1} gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$color">
                        PHONE
                      </Text>
                      <Text fontSize="$5">{currentService.telephone}</Text>
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
                onPress={handleConfirmService}
                disabled={confirmServiceMutation.isPending}
                opacity={confirmServiceMutation.isPending ? 0.6 : 1}
              >
                <Text color="white" fontWeight="600" fontSize="$5">
                  {confirmServiceMutation.isPending
                    ? "Confirming..."
                    : "Confirm Selection"}
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
