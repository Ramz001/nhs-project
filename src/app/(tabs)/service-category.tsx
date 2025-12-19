import { setServiceTypeId } from "@/features/navigation/navigation.slice";
import { useAppDispatch } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "@tamagui/lucide-icons";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Circle, Text, XStack, YStack } from "tamagui";

export default function ServiceCategoriesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: { data: services } = {}, isLoading } = useQuery({
    queryKey: ["service_category"],
    queryFn: async () => supabase.from("service_type").select("*"),
  });

  const handleCategoryPress = (id: string) => {
    dispatch(setServiceTypeId(id));
    router.push({
      pathname: "/service-list",
    });
  };

  if (isLoading) {
    return (
      <YStack flex={1} justify="center" items="center">
        <ActivityIndicator size="large" color="$blue10" />
        <Text mt="$2">Loading categories...</Text>
      </YStack>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack px="$4" py="$4" gap="$4">
          {/* Header */}
          <YStack gap="$2">
            <Text fontSize="$9" fontWeight="700">
              Select Service Type
            </Text>
            <Text fontSize="$5" color="$color">
              Choose the type of healthcare service you need
            </Text>
          </YStack>

          {/* Service Categories List */}
          <YStack gap="$3">
            {Array.isArray(services) &&
              services.map((service) => {
                const Icon =
                  (LucideIcons as any)[service.icon] || LucideIcons.Stethoscope;

                return (
                  <Card
                    key={service.id}
                    px="$4"
                    py="$4"
                    borderRadius="$4"
                    elevate
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => handleCategoryPress(service.id)}
                  >
                    <XStack gap="$4" items="center">
                      <Circle rounded="$4" size={56} bg="$blue4">
                        <Icon size={28} color="$blue10" />
                      </Circle>
                      <YStack flex={1} gap="$1">
                        <Text fontSize="$6" fontWeight="600">
                          {service.title}
                        </Text>
                        <Text fontSize="$3" color="$color">
                          {service.description}
                        </Text>
                      </YStack>
                      <ChevronRight size={24} color="$color" />
                    </XStack>
                  </Card>
                );
              })}
          </YStack>

          {/* Info Card */}
          <Card px="$4" py="$4" borderRadius="$4" bg="$blue2">
            <Text fontSize="$4" color="$color">
              Select a service category to view available providers in your area
            </Text>
          </Card>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
