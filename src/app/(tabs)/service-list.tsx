import { supabase } from "@/lib/supabase";
import { Check, MapPin, Phone } from "@tamagui/lucide-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Text, XStack, YStack } from "tamagui";

export default function ServicesListPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceTypeId = (params.type as string) || "";

  const [selectedService, setSelectedService] = useState<string | null>(null);

  const { data: { data: services } = {}, isLoading } = useQuery({
    queryKey: ["services", serviceTypeId],
    queryFn: async () =>
      supabase.from("service").select("*").eq("service_type_id", serviceTypeId),
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
              services.map((service: any) => {
                const isSelected = selectedService === service.id;

                return (
                  <Card
                    key={service.id}
                    px="$4"
                    py="$4"
                    borderRadius="$4"
                    elevate
                    borderWidth={isSelected ? 2 : 0}
                    borderColor={isSelected ? "$blue10" : "transparent"}
                    bg={isSelected ? "$blue2" : "$background"}
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => setSelectedService(service.id)}
                  >
                    <YStack gap="$3">
                      {/* Header Row */}
                      <XStack items="center" justify="space-between">
                        <YStack flex={1} gap="$1">
                          <Text fontSize="$6" fontWeight="600">
                            {service.name}
                          </Text>
                          <XStack items="center" gap="$2">
                            <MapPin size={16} color="$blue10" />
                            <Text
                              fontSize="$4"
                              fontWeight="600"
                              color="$blue10"
                            >
                              {service.distance || 0} km
                            </Text>
                          </XStack>
                        </YStack>
                        {isSelected && (
                          <XStack
                            bg="$blue10"
                            px="$3"
                            py="$2"
                            rounded="$4"
                            items="center"
                            gap="$2"
                          >
                            <Check size={16} color="white" />
                            <Text fontSize="$3" fontWeight="600" color="white">
                              Selected
                            </Text>
                          </XStack>
                        )}
                      </XStack>

                      {/* Address */}
                      <XStack items="flex-start" gap="$2">
                        <MapPin
                          size={16}
                          color="$color"
                          style={{ marginTop: 2 }}
                        />
                        <Text fontSize="$4" color="$color" flex={1}>
                          {service.address}
                        </Text>
                      </XStack>

                      {/* Phone */}
                      <XStack items="center" gap="$2">
                        <Phone size={16} color="$color" />
                        <Text fontSize="$4" color="$color">
                          {service.telephone}
                        </Text>
                      </XStack>
                    </YStack>
                  </Card>
                );
              })}
          </YStack>

          {/* Action Button */}
          {selectedService && (
            <Card
              px="$4"
              py="$4"
              borderRadius="$4"
              bg="$blue10"
              onPress={() =>
                router.push({
                  pathname: `/service-detail`,
                  params: { id: selectedService },
                })
              }
            >
              <Text color="white" fontWeight="600" fontSize="$5">
                Continue with Selected Service
              </Text>
            </Card>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
