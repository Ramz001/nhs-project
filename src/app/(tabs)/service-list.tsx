import ServiceCard from "@/components/service-card";
import { Service } from "@/features/navigation/navigation.slice";
import { getDistanceFromLatLonInKm } from "@/lib/get-distance-from-lat-lon";
import { useAppSelector } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, YStack } from "tamagui";

export default function ServicesListPage() {
  const router = useRouter();

  const { serviceTypeId, postcode, location } = useAppSelector(
    (store) => store.navigation
  );

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["service", serviceTypeId, postcode],
    queryFn: async () => {
      const { data } = await supabase
        .from("service")
        .select("*")
        .eq("service_type_id", serviceTypeId)
        .eq("postcode", postcode);

      if (!data || !location) return data;

      const withDistance = data
        .map((service) => ({
          ...service,
          distance: Math.round(
            getDistanceFromLatLonInKm(
              location.latitude,
              location.longitude,
              service.latitude,
              service.longitude
            )
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      return withDistance;
    },
    enabled:
      !!serviceTypeId &&
      !!postcode &&
      !!location &&
      !!location?.latitude &&
      !!location?.longitude,
  });

  if (isLoading) {
    return (
      <YStack flex={1} justify="center" items="center">
        <ActivityIndicator size="large" color="$blue10" />
        <Text mt="$2">Loading services...</Text>
      </YStack>
    );
  }

  if (!services || services.length === 0) {
    return (
      <YStack flex={1} justify="center" items="center" px="$4">
        <Text fontSize="$6" fontWeight="600" text="center">
          No services found for the selected category.
        </Text>
        <Button onPress={() => router.back()} mt="$4">
          Go Back to Categories
        </Button>
      </YStack>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack px="$4" py="$4" gap="$4">
          {/* Services List */}
          <YStack gap="$3">
            {Array.isArray(services) &&
              services.map((service: Service) => (
                <ServiceCard service={service} key={service.id} />
              ))}
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
